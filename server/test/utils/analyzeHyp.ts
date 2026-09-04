import { assert } from "chai";
import { analyze } from "@utils/analyzeHyp";

describe("utils", () => {
  describe("analyzeHyp", () => {
    it("extracts version pragmas", () => {
      const { versionPragmas } = analyze(
        `pragma hyperion ^0.1.0;\npragma hyperion >=0.1.0 <0.2.0;`
      );

      assert.deepStrictEqual(versionPragmas, ["^0.1.0", ">=0.1.0 <0.2.0"]);
    });

    it("ignores non-version pragmas and solidity pragmas", () => {
      const { versionPragmas } = analyze(
        `pragma solidity ^0.8.0;\npragma abicoder v2;\npragma hyperion 0.1.2;`
      );

      assert.deepStrictEqual(versionPragmas, ["0.1.2"]);
    });

    it("extracts all import statement forms", () => {
      const { imports } = analyze(
        [
          `import "./Token.hyp";`,
          `import {A, B} from "../lib/Utils.hyp";`,
          `import * as X from '@openqrl/contracts/QRL20.hyp';`,
          `import "double//slash.hyp" as Y;`,
          `import`,
          `    "multiline.hyp";`,
        ].join("\n")
      );

      assert.deepStrictEqual(imports, [
        "./Token.hyp",
        "../lib/Utils.hyp",
        "@openqrl/contracts/QRL20.hyp",
        "double//slash.hyp",
        "multiline.hyp",
      ]);
    });

    it("ignores imports and pragmas inside comments", () => {
      const { imports, versionPragmas } = analyze(
        [
          `// import "./line-comment.hyp";`,
          `/* import "./block-comment.hyp"; */`,
          `/* pragma hyperion ^9.9.9; */`,
          `// pragma hyperion ^8.8.8;`,
          `import "./real.hyp";`,
          `pragma hyperion ^0.1.0;`,
        ].join("\n")
      );

      assert.deepStrictEqual(imports, ["./real.hyp"]);
      assert.deepStrictEqual(versionPragmas, ["^0.1.0"]);
    });

    it("ignores import-like content inside string literals", () => {
      const { imports } = analyze(
        [
          `contract C {`,
          `  string a = "import \\"./in-string.hyp\\";";`,
          `  string b = 'import "./in-single-quotes.hyp";';`,
          `}`,
          `import "./real.hyp";`,
        ].join("\n")
      );

      assert.deepStrictEqual(imports, ["./real.hyp"]);
    });

    it("returns empty results for sources without imports or pragmas", () => {
      const result = analyze(`contract Empty {\n  uint512 x;\n}`);

      assert.deepStrictEqual(result, { versionPragmas: [], imports: [] });
    });
  });
});
