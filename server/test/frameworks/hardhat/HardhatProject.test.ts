import { assert } from "chai";
import { Hardhat2Project } from "../../../src/frameworks/Hardhat/Hardhat2/Hardhat2Project";
import { ServerState } from "../../../src/types";

describe("HardhatProject", function () {
  let project: Hardhat2Project;
  const serverStateMock = {
    logger: {},
  } as ServerState;

  beforeEach(async () => {
    project = new Hardhat2Project(
      serverStateMock,
      "/my_hardhat_project",
      "/my_hardhat_project/hardhat.config.ts"
    );
  });

  describe("fileBelongs", function () {
    it("claims files under the project root as local", async () => {
      const result = await project.fileBelongs(
        "/my_hardhat_project/contracts/Counter.hyp"
      );

      assert.deepEqual(result, { belongs: true, isLocal: true });
    });

    it("claims files under node_modules as non-local", async () => {
      const result = await project.fileBelongs(
        "/my_hardhat_project/node_modules/@theqrl/hardhat/console.hyp"
      );

      assert.deepEqual(result, { belongs: true, isLocal: false });
    });

    it("rejects files outside the project root", async () => {
      const result = await project.fileBelongs("/other_project/Counter.hyp");

      assert.isFalse(result.belongs);
    });
  });

  describe("project metadata", function () {
    it("is identified by its config path", function () {
      assert.equal(project.id(), "/my_hardhat_project/hardhat.config.ts");
      assert.equal(project.frameworkName(), "Hardhat");
    });
  });
});
