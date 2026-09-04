import { OpenDocuments } from "../../types";
import { isRelativeImport } from "../../utils";
import { CompilationDetails } from "../base/CompilationDetails";
import { Project } from "../base/Project";
import { getDependenciesAndPragmas } from "./crawlDependencies";

export async function buildBasicCompilation(
  project: Project,
  sourceUri: string,
  openDocuments: OpenDocuments,
  explicitSolcVersion?: string
): Promise<CompilationDetails> {
  // Load contract text from openDocuments
  const documentText = openDocuments.find(
    (doc) => doc.uri === sourceUri
  )?.documentText;

  if (documentText === undefined) {
    throw new Error(
      `sourceUri (${sourceUri}) should be included in openDocuments ${JSON.stringify(
        openDocuments.map((doc) => doc.uri)
      )} `
    );
  }

  // Get list of all dependencies (deep) and their pragma statements
  const dependencyDetails = await getDependenciesAndPragmas(project, sourceUri);

  // A single hypc version is bundled with the extension — always compile with
  // it and let the compiler report any pragma mismatch (error 5333).
  const solcVersion =
    explicitSolcVersion ?? project.serverState.solcVersions[0];

  // Build solc input
  const sources: { [uri: string]: { content: string } } = {};
  const remappings: string[] = [];

  for (const { sourceName, absolutePath } of dependencyDetails) {
    // Read all sol files via openDocuments or solFileIndex
    const contractText =
      openDocuments.find((doc) => doc.uri === absolutePath)?.documentText ??
      project.serverState.solFileIndex[absolutePath].text;
    if (contractText === undefined) {
      throw new Error(`Contract not indexed: ${absolutePath}`);
    }
    sources[absolutePath] = { content: contractText };

    if (!isRelativeImport(sourceName) && sourceName !== absolutePath) {
      remappings.push(`${sourceName}=${absolutePath}`);
    }
  }

  sources[sourceUri] = { content: documentText };

  return {
    input: {
      language: "Hyperion",
      sources,
      settings: {
        outputSelection: {},
        remappings,
        optimizer: {
          enabled: false,
          runs: 200,
        },
      },
    },
    solcVersion,
  };
}
