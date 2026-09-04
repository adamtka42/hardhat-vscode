import path from "path";
import { WorkspaceFolder } from "vscode-languageserver-protocol";
import { decodeUriAndRemoveFilePrefix } from "../../utils";
import { ProjectIndexer } from "../base/ProjectIndexer";
import { Project } from "../base/Project";
import { Hardhat2Project } from "./Hardhat2/Hardhat2Project";

export class HardhatIndexer extends ProjectIndexer {
  public async index(folder: WorkspaceFolder) {
    const uri = decodeUriAndRemoveFilePrefix(folder.uri);

    // Find all hardhat.config files in the workspace folder
    const configFiles = await this.fileRetriever.findFiles(
      uri,
      "**/hardhat.config.{ts,js}",
      ["**/node_modules/**"]
    );

    // The @theqrl/hardhat fork follows the hardhat 2 line, so every config
    // maps to a Hardhat2Project.
    const hardhatProjects: Project[] = configFiles.map(
      (configFile) =>
        new Hardhat2Project(
          this.serverState,
          path.dirname(configFile),
          configFile
        )
    );

    return hardhatProjects;
  }
}
