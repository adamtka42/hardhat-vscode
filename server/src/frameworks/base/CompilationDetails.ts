// Standard JSON compiler input (subset of the solc/hypc interface, previously
// imported from hardhat/types).
export interface CompilerInput {
  language: string;
  sources: { [sourceName: string]: { content: string } };
  settings: {
    optimizer: { enabled?: boolean; runs?: number };
    outputSelection: { [file: string]: { [contract: string]: string[] } };
    remappings?: string[];
    evmVersion?: string;
    metadata?: unknown;
    libraries?: {
      [libraryFileName: string]: { [libraryName: string]: string };
    };
  };
}

export interface CompilationDetails {
  input: CompilerInput;
  solcVersion: string;
}
