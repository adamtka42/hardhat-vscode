import { SemanticTokenTypes } from "vscode-languageserver-protocol";
import type { Query } from "@theqrl/slang/cst" with { "resolution-mode": "import" };
import { Highlighter } from "../Highlighter";

export class FunctionDefinitionHighlighter extends Highlighter {
  public override readonly semanticTokenType = SemanticTokenTypes.function;

  public override async getQuery(): Promise<Query> {
    const { Query } = await import("@theqrl/slang/cst");
    return Query.create(`
    [FunctionDefinition
      [FunctionName
        @identifier [Identifier]
      ]
    ]
  `);
  }
}
