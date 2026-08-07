/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";
import path from "path";
import { stub } from "sinon";
import * as basicCompilation from "../../../src/frameworks/shared/buildBasicCompilation";
import { FoundryProject } from "../../../src/frameworks/Foundry/FoundryProject";
import { ServerState } from "../../../src/types";
import { toUnixStyle } from "../../../src/utils";

describe("FoundryProject", function () {
  let project: FoundryProject;
  const serverStateMock = {
    logger: {},
  } as ServerState;

  beforeEach(async () => {
    project = new FoundryProject(
      serverStateMock,
      path.join(__dirname, "test_project"),
      path.join(__dirname, "test_project", "foundry.toml")
    );
  });

  describe("resolveImportPath", function () {
    it("resolves relative imports", async () => {
      const foundImport = await project.resolveImportPath(
        path.join(project.basePath, "src", "A.hyp"),
        "./B.hyp"
      );
      const notFoundImport = await project.resolveImportPath(
        path.join(project.basePath, "src", "A.hyp"),
        "./C.hyp"
      );
      expect(foundImport).to.eq(
        toUnixStyle(path.join(project.basePath, "src", "B.hyp"))
      );
      expect(notFoundImport).to.eq(undefined);
    });

    it("resolves root imports", async () => {
      const importFromSameLevel = await project.resolveImportPath(
        path.join(project.basePath, "src", "nested", "D.hyp"),
        "nested/E.hyp"
      );
      const importFromParent = await project.resolveImportPath(
        path.join(project.basePath, "src", "nested", "D.hyp"),
        "src/A.hyp"
      );
      const importFromLib = await project.resolveImportPath(
        path.join(project.basePath, "src", "nested", "D.hyp"),
        "lib/C.hyp"
      );
      const illegalImport = await project.resolveImportPath(
        path.join(project.basePath, "src", "A.hyp"),
        "foundry/Illegal.hyp"
      );

      expect(importFromSameLevel).to.eq(
        toUnixStyle(path.join(project.basePath, "src", "nested", "E.hyp"))
      );
      expect(importFromParent).to.eq(
        toUnixStyle(path.join(project.basePath, "src", "A.hyp"))
      );
      expect(importFromLib).to.eq(
        toUnixStyle(path.join(project.basePath, "lib", "C.hyp"))
      );
      expect(illegalImport).to.eq(undefined);
    });
  });

  describe("buildCompilation", function () {
    it("replaces absolute paths provided by buildBasicCompilation with root-relative paths", async () => {
      const sourceUri = path.join(project.basePath, "src", "A.hyp");

      stub(basicCompilation, "buildBasicCompilation").resolves({
        input: {
          sources: {
            [sourceUri]: { content: "" },
          },
          settings: {},
        },
      } as any);

      const compilation = await project.buildCompilation(sourceUri, []);
      expect(compilation.input.sources).to.deep.eq({
        [path.join("src", "A.hyp")]: { content: "" },
      });
    });
  });
});
