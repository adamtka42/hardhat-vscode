import fs from "fs";
import _ from "lodash";
import path from "path";
import {
  CodeAction,
  CompletionItem,
  Diagnostic,
  DidChangeWatchedFilesParams,
  Position,
} from "vscode-languageserver-protocol";
import { TextDocument } from "vscode-languageserver-textdocument";
import { OpenDocuments, ServerState } from "../../../types";
import { toUnixStyle } from "../../../utils";
import { directoryContains } from "../../../utils/directoryContains";
import { Logger } from "../../../utils/Logger";
import { CompilationDetails } from "../../base/CompilationDetails";
import { FileBelongsResult, Project } from "../../base/Project";
import { buildBasicCompilation } from "../../shared/buildBasicCompilation";
import { getImportCompletions } from "./getImportCompletions";
import { resolveActionsFor } from "./resolveActionsFor";

export class Hardhat2Project extends Project {
  public priority = 4;

  private logger: Logger;

  constructor(
    serverState: ServerState,
    basePath: string,
    public configPath: string
  ) {
    super(serverState, basePath);
    this.logger = _.clone(serverState.logger);
    this.logger.tag = path.basename(basePath);
  }

  public id(): string {
    return this.configPath;
  }

  public frameworkName(): string {
    return "Hardhat";
  }

  public async initialize(): Promise<void> {
    return;
  }

  public async fileBelongs(sourceURI: string): Promise<FileBelongsResult> {
    const belongs = directoryContains(this.basePath, sourceURI);
    const inNodeModules = directoryContains(
      path.join(this.basePath, "node_modules"),
      sourceURI
    );

    return { belongs, isLocal: belongs && !inNodeModules };
  }

  public async resolveImportPath(file: string, importPath: string) {
    try {
      const resolvedPath = require.resolve(importPath, {
        paths: [fs.realpathSync(path.dirname(file))],
      });

      return toUnixStyle(fs.realpathSync(resolvedPath));
    } catch (error) {
      return undefined;
    }
  }

  public async buildCompilation(
    sourceUri: string,
    openDocuments: OpenDocuments
  ): Promise<CompilationDetails> {
    return buildBasicCompilation(this, sourceUri, openDocuments);
  }

  public async onWatchedFilesChanges(
    _params: DidChangeWatchedFilesParams
  ): Promise<void> {
    return;
  }

  public getImportCompletions(
    position: Position,
    currentImport: string
  ): CompletionItem[] {
    return getImportCompletions(
      { basePath: this.basePath, solFileIndex: this.serverState.solFileIndex },
      position,
      currentImport
    );
  }

  public resolveActionsFor(
    diagnostic: Diagnostic,
    document: TextDocument,
    uri: string
  ): CodeAction[] {
    return resolveActionsFor(this.serverState, diagnostic, document, uri);
  }
}
