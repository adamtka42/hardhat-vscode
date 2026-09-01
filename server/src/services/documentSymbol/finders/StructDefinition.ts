import { SymbolKind } from "vscode-languageserver-types";
import type { Query } from "@theqrl/slang/cst" with { "resolution-mode": "import" };
import { SymbolFinder } from "../SymbolFinder";

export class StructDefinition extends SymbolFinder {
  public override readonly symbolKind = SymbolKind.Struct;

  public override async getQuery(): Promise<Query> {
    const { Query } = await import("@theqrl/slang/cst");
    return Query.create(`
      @definition [StructDefinition
        @identifier name: [_]
      ]
    `);
  }
}
