import path from "path";
import { expect } from "chai";
import { removeSync } from "fs-extra";
import { readFileSync, writeFileSync } from "fs";
import { LSPDependencyGraph } from "../../../src/frameworks/Hardhat/Hardhat3/LSPDependencyGraph";

// See image.png inside lsp_dg_project for the graph
describe("LSPDependencyGraph", () => {
  let dg: LSPDependencyGraph;

  beforeEach(async () => {
    const { ResolverImplementation } = await import(
      "hardhat3/internal/lsp-helpers"
    );
    const resolverFactory = () => {
      return ResolverImplementation.create(
        projectPath,
        async (filePath: string) => readFileSync(filePath).toString()
      );
    };
    dg = new LSPDependencyGraph(resolverFactory);
  });

  const projectPath = path.join(__dirname, "lsp_dg_project");
  const contractPath = (contractName: string) =>
    path.join(projectPath, `${contractName}.hyp`);

  describe("#walkFile", function () {
    it("walking a file with no dependencies", async () => {
      await dg.walkFile(contractPath("I"));

      expect(Array.from(dg.files.keys())).to.deep.equal([contractPath("I")]);
      expect(Array.from(dg.dependencies.get(contractPath("I"))!)).to.deep.eq(
        []
      );
      expect(Array.from(dg.dependants.get(contractPath("I"))!)).to.deep.eq([]);
      expect(dg.unresolvedImports.size).to.eq(0);
    });

    it("walking a file with only one unresolved dependency", async () => {
      await dg.walkFile(contractPath("H"));

      expect(Array.from(dg.files.keys())).to.deep.equal([contractPath("H")]);
      expect(Array.from(dg.dependencies.get(contractPath("H"))!)).to.deep.eq(
        []
      );
      expect(Array.from(dg.dependants.get(contractPath("H"))!)).to.deep.eq([]);
      expect(dg.unresolvedImports.size).to.eq(1);
      expect(
        Array.from(dg.unresolvedImports.get(contractPath("H"))!)
      ).to.deep.eq(["./nonexistent2.hyp"]);
    });

    it("walking a file with one dependency and some unresolved", async () => {
      await dg.walkFile(contractPath("C"));

      expect(Array.from(dg.files.keys())).to.deep.equal([
        contractPath("C"),
        contractPath("H"),
      ]);

      expect(Array.from(dg.dependencies.get(contractPath("C"))!)).to.deep.eq([
        { fileAbsPath: contractPath("H"), importPath: "./H.hyp" },
      ]);
      expect(Array.from(dg.dependencies.get(contractPath("H"))!)).to.deep.eq(
        []
      );

      expect(Array.from(dg.dependants.get(contractPath("H"))!)).to.deep.eq([
        { fileAbsPath: contractPath("C"), importPath: "./H.hyp" },
      ]);
      expect(Array.from(dg.dependants.get(contractPath("C"))!)).to.deep.eq([]);

      expect(dg.unresolvedImports.size).to.eq(2);
      expect(
        Array.from(dg.unresolvedImports.get(contractPath("C"))!)
      ).to.deep.eq(["./nonexistent1.hyp"]);
      expect(
        Array.from(dg.unresolvedImports.get(contractPath("H"))!)
      ).to.deep.eq(["./nonexistent2.hyp"]);
    });

    it("walking subpaths several times starting from leaves will not duplicate files or links", async () => {
      await dg.walkFile(contractPath("H"));
      await dg.walkFile(contractPath("C"));
      await dg.walkFile(contractPath("B"));
      await dg.walkFile(contractPath("D"));

      expect(Array.from(dg.files.keys())).to.deep.equal([
        contractPath("H"),
        contractPath("C"),
        contractPath("B"),
        contractPath("D"),
      ]);

      expect(Array.from(dg.dependencies.get(contractPath("H"))!)).to.deep.eq(
        []
      );
      expect(Array.from(dg.dependencies.get(contractPath("C"))!)).to.deep.eq([
        { fileAbsPath: contractPath("H"), importPath: "./H.hyp" },
      ]);
      expect(Array.from(dg.dependencies.get(contractPath("B"))!)).to.deep.eq([
        { fileAbsPath: contractPath("C"), importPath: "./C.hyp" },
        { fileAbsPath: contractPath("D"), importPath: "./D.hyp" },
      ]);
      expect(Array.from(dg.dependencies.get(contractPath("D"))!)).to.deep.eq([
        { fileAbsPath: contractPath("C"), importPath: "./C.hyp" },
      ]);

      expect(Array.from(dg.dependants.get(contractPath("H"))!)).to.deep.eq([
        { fileAbsPath: contractPath("C"), importPath: "./H.hyp" },
      ]);
      expect(Array.from(dg.dependants.get(contractPath("C"))!)).to.deep.eq([
        { fileAbsPath: contractPath("B"), importPath: "./C.hyp" },
        { fileAbsPath: contractPath("D"), importPath: "./C.hyp" },
      ]);
      expect(Array.from(dg.dependants.get(contractPath("B"))!)).to.deep.eq([]);
      expect(Array.from(dg.dependants.get(contractPath("D"))!)).to.deep.eq([
        { fileAbsPath: contractPath("B"), importPath: "./D.hyp" },
      ]);

      expect(dg.unresolvedImports.size).to.eq(2);
      expect(
        Array.from(dg.unresolvedImports.get(contractPath("C"))!)
      ).to.deep.eq(["./nonexistent1.hyp"]);
      expect(
        Array.from(dg.unresolvedImports.get(contractPath("H"))!)
      ).to.deep.eq(["./nonexistent2.hyp"]);
    });

    it("walking subpaths several times starting from roots will not duplicate files or links", async () => {
      await dg.walkFile(contractPath("A"));
      await dg.walkFile(contractPath("F"));
      await dg.walkFile(contractPath("B"));
      await dg.walkFile(contractPath("D"));
      await dg.walkFile(contractPath("E"));
      await dg.walkFile(contractPath("I"));
      await dg.walkFile(contractPath("C"));
      await dg.walkFile(contractPath("G"));
      await dg.walkFile(contractPath("H"));

      expect(Array.from(dg.files.keys()).sort()).to.deep.equal([
        contractPath("A"),
        contractPath("B"),
        contractPath("C"),
        contractPath("D"),
        contractPath("E"),
        contractPath("F"),
        contractPath("G"),
        contractPath("H"),
        contractPath("I"),
      ]);

      expect(Array.from(dg.dependencies.get(contractPath("A"))!)).to.deep.eq([
        { fileAbsPath: contractPath("B"), importPath: "./B.hyp" },
        { fileAbsPath: contractPath("D"), importPath: "./D.hyp" },
        { fileAbsPath: contractPath("E"), importPath: "./E.hyp" },
      ]);
      expect(Array.from(dg.dependencies.get(contractPath("B"))!)).to.deep.eq([
        { fileAbsPath: contractPath("C"), importPath: "./C.hyp" },
        { fileAbsPath: contractPath("D"), importPath: "./D.hyp" },
      ]);
      expect(Array.from(dg.dependencies.get(contractPath("C"))!)).to.deep.eq([
        { fileAbsPath: contractPath("H"), importPath: "./H.hyp" },
      ]);
      expect(Array.from(dg.dependencies.get(contractPath("D"))!)).to.deep.eq([
        { fileAbsPath: contractPath("C"), importPath: "./C.hyp" },
      ]);
      expect(Array.from(dg.dependencies.get(contractPath("E"))!)).to.deep.eq([
        { fileAbsPath: contractPath("G"), importPath: "./G.hyp" },
      ]);
      expect(Array.from(dg.dependencies.get(contractPath("F"))!)).to.deep.eq([
        { fileAbsPath: contractPath("E"), importPath: "./E.hyp" },
        { fileAbsPath: contractPath("G"), importPath: "./G.hyp" },
        { fileAbsPath: contractPath("I"), importPath: "./I.hyp" },
      ]);
      expect(Array.from(dg.dependencies.get(contractPath("G"))!)).to.deep.eq([
        { fileAbsPath: contractPath("H"), importPath: "./H.hyp" },
        { fileAbsPath: contractPath("D"), importPath: "./D.hyp" },
      ]);
      expect(Array.from(dg.dependencies.get(contractPath("H"))!)).to.deep.eq(
        []
      );
      expect(Array.from(dg.dependencies.get(contractPath("I"))!)).to.deep.eq(
        []
      );

      expect(Array.from(dg.dependants.get(contractPath("A"))!)).to.deep.eq([]);
      expect(Array.from(dg.dependants.get(contractPath("B"))!)).to.deep.eq([
        { fileAbsPath: contractPath("A"), importPath: "./B.hyp" },
      ]);
      expect(Array.from(dg.dependants.get(contractPath("C"))!)).to.deep.eq([
        { fileAbsPath: contractPath("D"), importPath: "./C.hyp" },
        { fileAbsPath: contractPath("B"), importPath: "./C.hyp" },
      ]);
      expect(Array.from(dg.dependants.get(contractPath("D"))!)).to.deep.eq([
        { fileAbsPath: contractPath("A"), importPath: "./D.hyp" },
        { fileAbsPath: contractPath("G"), importPath: "./D.hyp" },
        { fileAbsPath: contractPath("B"), importPath: "./D.hyp" },
      ]);
      expect(Array.from(dg.dependants.get(contractPath("E"))!)).to.deep.eq([
        { fileAbsPath: contractPath("A"), importPath: "./E.hyp" },
        { fileAbsPath: contractPath("F"), importPath: "./E.hyp" },
      ]);
      expect(Array.from(dg.dependants.get(contractPath("F"))!)).to.deep.eq([]);
      expect(Array.from(dg.dependants.get(contractPath("G"))!)).to.deep.eq([
        { fileAbsPath: contractPath("E"), importPath: "./G.hyp" },
        { fileAbsPath: contractPath("F"), importPath: "./G.hyp" },
      ]);
      expect(Array.from(dg.dependants.get(contractPath("H"))!)).to.deep.eq([
        { fileAbsPath: contractPath("G"), importPath: "./H.hyp" },
        { fileAbsPath: contractPath("C"), importPath: "./H.hyp" },
      ]);
      expect(Array.from(dg.dependants.get(contractPath("I"))!)).to.deep.eq([
        { fileAbsPath: contractPath("F"), importPath: "./I.hyp" },
      ]);

      expect(dg.unresolvedImports.size).to.eq(2);
      expect(
        Array.from(dg.unresolvedImports.get(contractPath("C"))!)
      ).to.deep.eq(["./nonexistent1.hyp"]);
      expect(
        Array.from(dg.unresolvedImports.get(contractPath("H"))!)
      ).to.deep.eq(["./nonexistent2.hyp"]);
    });
  });

  describe("#deleteFile", function () {
    it("deletes from dependent's dependencies", async () => {
      await dg.walkFile(contractPath("C"));

      expect(Array.from(dg.dependencies.get(contractPath("C"))!)).to.deep.eq([
        { fileAbsPath: contractPath("H"), importPath: "./H.hyp" },
      ]);

      await dg.deleteFile(contractPath("H"));

      expect(Array.from(dg.dependencies.get(contractPath("C"))!)).to.deep.eq(
        []
      );
    });

    it("deletes from dependencies's dependants", async () => {
      await dg.walkFile(contractPath("C"));

      expect(Array.from(dg.dependants.get(contractPath("H"))!)).to.deep.eq([
        { fileAbsPath: contractPath("C"), importPath: "./H.hyp" },
      ]);

      await dg.deleteFile(contractPath("C"));

      expect(Array.from(dg.dependants.get(contractPath("H"))!)).to.deep.eq([]);
    });

    it("adds to dependants' unresolved dependencies", async () => {
      await dg.walkFile(contractPath("C"));

      expect(
        Array.from(dg.unresolvedImports.get(contractPath("C"))!)
      ).to.deep.eq(["./nonexistent1.hyp"]);

      await dg.deleteFile(contractPath("H"));

      expect(
        Array.from(dg.unresolvedImports.get(contractPath("C"))!)
      ).to.deep.eq(["./nonexistent1.hyp", "./H.hyp"]);
    });

    it("removes this file's entry, dependencies and dependants", async () => {
      await dg.walkFile(contractPath("C"));

      expect(Array.from(dg.files.keys())).to.deep.equal([
        contractPath("C"),
        contractPath("H"),
      ]);
      expect(dg.dependencies.size).to.eq(2);
      expect(Array.from(dg.dependencies.get(contractPath("C"))!)).to.deep.eq([
        { fileAbsPath: contractPath("H"), importPath: "./H.hyp" },
      ]);
      expect(dg.dependants.size).to.eq(2);
      expect(Array.from(dg.dependants.get(contractPath("H"))!)).to.deep.eq([
        { fileAbsPath: contractPath("C"), importPath: "./H.hyp" },
      ]);

      await dg.deleteFile(contractPath("C"));

      expect(Array.from(dg.files.keys())).to.deep.equal([contractPath("H")]);

      expect(dg.dependencies.size).to.eq(1);
      expect(Array.from(dg.dependencies.get(contractPath("H"))!)).to.deep.eq(
        []
      );
      expect(dg.dependants.size).to.eq(1);
      expect(Array.from(dg.dependants.get(contractPath("H"))!)).to.deep.eq([]);
    });

    it("removes unresolved dependencies for this file", async () => {
      await dg.walkFile(contractPath("C"));

      expect(dg.unresolvedImports.size).to.eq(2);

      expect(
        Array.from(dg.unresolvedImports.get(contractPath("C"))!)
      ).to.deep.eq(["./nonexistent1.hyp"]);

      await dg.deleteFile(contractPath("C"));

      expect(dg.unresolvedImports.size).to.eq(1);
    });
  });

  describe("#addNewFile", function () {
    afterEach(() => {
      removeSync(contractPath("nonexistent2"));
    });
    beforeEach(() => {
      removeSync(contractPath("nonexistent2"));
    });

    it("walks the file", async () => {
      await dg.addNewFile(contractPath("C"));

      expect(Array.from(dg.files.keys())).to.deep.equal([
        contractPath("C"),
        contractPath("H"),
      ]);

      expect(dg.dependencies.size).to.eq(2);
      expect(Array.from(dg.dependencies.get(contractPath("C"))!)).to.deep.eq([
        { fileAbsPath: contractPath("H"), importPath: "./H.hyp" },
      ]);
      expect(Array.from(dg.dependencies.get(contractPath("H"))!)).to.deep.eq(
        []
      );

      expect(dg.dependants.size).to.eq(2);
      expect(Array.from(dg.dependants.get(contractPath("H"))!)).to.deep.eq([
        { fileAbsPath: contractPath("C"), importPath: "./H.hyp" },
      ]);
      expect(Array.from(dg.dependants.get(contractPath("C"))!)).to.deep.eq([]);

      expect(dg.unresolvedImports.size).to.eq(2);
      expect(
        Array.from(dg.unresolvedImports.get(contractPath("C"))!)
      ).to.deep.eq(["./nonexistent1.hyp"]);
      expect(
        Array.from(dg.unresolvedImports.get(contractPath("H"))!)
      ).to.deep.eq(["./nonexistent2.hyp"]);
    });

    it("resolves a previously unresolved link", async () => {
      await dg.walkFile(contractPath("H"));

      expect(Array.from(dg.dependencies.get(contractPath("H"))!)).to.deep.eq(
        []
      );

      expect(dg.unresolvedImports.size).to.eq(1);
      expect(
        Array.from(dg.unresolvedImports.get(contractPath("H"))!)
      ).to.deep.eq(["./nonexistent2.hyp"]);

      writeFileSync(contractPath("nonexistent2"), "");
      await dg.addNewFile(contractPath("nonexistent2"));

      expect(
        Array.from(dg.unresolvedImports.get(contractPath("H"))!)
      ).to.deep.eq([]);

      expect(Array.from(dg.dependencies.get(contractPath("H"))!)).to.deep.eq([
        {
          fileAbsPath: contractPath("nonexistent2"),
          importPath: "./nonexistent2.hyp",
        },
      ]);

      expect(
        Array.from(dg.dependants.get(contractPath("nonexistent2"))!)
      ).to.deep.eq([
        { fileAbsPath: contractPath("H"), importPath: "./nonexistent2.hyp" },
      ]);
    });
  });

  describe("#resolveImport", function () {
    it("returns the absolute path of the resolved import if its present in the graph", async () => {
      await dg.walkFile(contractPath("C"));

      expect(dg.resolveImport(contractPath("C"), "./H.hyp")).to.eq(
        contractPath("H")
      );
    });

    it("returns undefined if the import is not present in the graph", async () => {
      await dg.walkFile(contractPath("C"));

      expect(dg.resolveImport(contractPath("C"), "./nonexistent1.hyp")).to.eq(
        undefined
      );
    });
  });
});
