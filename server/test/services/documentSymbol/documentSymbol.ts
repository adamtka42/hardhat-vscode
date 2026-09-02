import { assert } from "chai";
import { TextDocument } from "vscode-languageserver-textdocument";
import { DocumentSymbol, SymbolKind } from "vscode-languageserver-types";
import { onDocumentSymbol } from "@services/documentSymbol/onDocumentSymbol";
import { ServerState } from "../../../src/types";
import { setupMockLogger } from "../../helpers/setupMockLogger";
import { setupMockTelemetry } from "../../helpers/setupMockTelemetry";

describe("documentSymbol", () => {
  const uri = "file:///project/contracts/Symbols.hyp";

  const text = [
    "// SPDX-License-Identifier: MIT",
    "pragma hyperion >=0.1.0;",
    "",
    "uint constant FILE_CONSTANT = 1;",
    "",
    "interface ICounter {",
    "  function current() external view returns (uint512);",
    "}",
    "",
    "library MathLib {",
    "  function add(uint512 a, uint512 b) internal pure returns (uint512) {",
    "    return a + b;",
    "  }",
    "}",
    "",
    "contract Counter is ICounter {",
    "  struct Entry {",
    "    uint512 value;",
    "  }",
    "",
    "  enum Status { Idle, Busy }",
    "",
    "  event Incremented(uint512 value);",
    "  error TooBig();",
    "",
    "  uint512 public count;",
    "",
    "  modifier onlyPositive() {",
    "    _;",
    "  }",
    "",
    "  constructor() {}",
    "",
    "  function current() external view returns (uint512) {",
    "    uint512 local = count;",
    "    return local;",
    "  }",
    "",
    "  fallback() external {}",
    "  receive() external payable {}",
    "}",
  ].join("\n");

  let symbols: DocumentSymbol[];

  before(async () => {
    const serverState = {
      documents: {
        get: (documentUri: string) =>
          documentUri === uri
            ? TextDocument.create(uri, "hyperion", 0, text)
            : undefined,
      },
      telemetry: setupMockTelemetry(),
      logger: setupMockLogger(),
    } as unknown as ServerState;

    const result = await onDocumentSymbol(serverState)({
      textDocument: { uri },
    });

    symbols = result as DocumentSymbol[];
  });

  it("returns top level symbols in document order", () => {
    assert.deepEqual(
      symbols.map((symbol) => [symbol.name, symbol.kind]),
      [
        ["FILE_CONSTANT", SymbolKind.Constant],
        ["ICounter", SymbolKind.Interface],
        ["MathLib", SymbolKind.Class],
        ["Counter", SymbolKind.Class],
      ]
    );
  });

  it("nests members under their contract", () => {
    const counter = symbols.find((symbol) => symbol.name === "Counter");

    assert.isDefined(counter);
    assert.deepEqual(
      counter!.children!.map((symbol) => [symbol.name, symbol.kind]),
      [
        ["Entry", SymbolKind.Struct],
        ["Status", SymbolKind.Enum],
        ["Incremented", SymbolKind.Event],
        ["TooBig", SymbolKind.Event],
        ["count", SymbolKind.Property],
        ["onlyPositive", SymbolKind.Function],
        ["constructor", SymbolKind.Constructor],
        ["current", SymbolKind.Function],
        ["fallback", SymbolKind.Function],
        ["receive", SymbolKind.Function],
      ]
    );
  });

  it("nests struct members and local variables", () => {
    const counter = symbols.find((symbol) => symbol.name === "Counter");
    const entry = counter!.children!.find((symbol) => symbol.name === "Entry");
    const current = counter!.children!.find(
      (symbol) => symbol.name === "current"
    );

    assert.deepEqual(
      entry!.children!.map((symbol) => [symbol.name, symbol.kind]),
      [["value", SymbolKind.Property]]
    );
    assert.deepEqual(
      current!.children!.map((symbol) => [symbol.name, symbol.kind]),
      [["local", SymbolKind.Variable]]
    );
  });
});
