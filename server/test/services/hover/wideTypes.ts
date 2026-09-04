import * as path from "path";
import { VSCodePosition } from "@common/types";
import { MarkupKind } from "vscode-languageserver/node";
import { setupMockLanguageServer } from "../../helpers/setupMockLanguageServer";
import { forceToUnixStyle } from "../../helpers/forceToUnixStyle";
import { assertOnServerHover } from "./assertOnServerHover";

describe("Parser", () => {
  describe("Hover", () => {
    // uint512/bytes64 parse as user-defined type names in
    // @solidity-parser/parser — make sure analysis and hover still work
    describe("512-bit types", () => {
      const wideTypesUri = forceToUnixStyle(
        path.join(__dirname, "testData", "WideTypes.hyp")
      );

      let assertHover: (
        position: VSCodePosition,
        expectedHoverText: string
      ) => Promise<void>;

      before(async () => {
        const {
          server: { hover },
        } = await setupMockLanguageServer({
          documents: [{ uri: wideTypesUri, analyze: true }],
          errors: [],
        });

        await new Promise((resolve) => setTimeout(resolve, 500));

        assertHover = (position: VSCodePosition, expectedHoverText: string) =>
          assertOnServerHover(hover, wideTypesUri, position, {
            kind: MarkupKind.Markdown,
            value: ["```hyperion", expectedHoverText, "```"].join("\n"),
          });
      });

      it("should display details for a uint512 state variable", () =>
        assertHover({ line: 8, character: 26 }, "uint512 public wideUint"));

      it("should display details for a bytes64 local variable", () =>
        assertHover({ line: 10, character: 25 }, "bytes64 localBlob"));

      it("should display details for a uint512 local variable", () =>
        assertHover({ line: 11, character: 13 }, "uint512 localWide"));
    });
  });
});
