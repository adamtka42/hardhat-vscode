/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

import { CompilationDetails } from "../../frameworks/base/CompilationDetails";
import { Logger } from "../../utils/Logger";

// hypc-js exposes the same wrapper API as solc-js
interface HypcWrapper {
  version(): string;
  compile(input: string): string;
}

export class CompilationService {
  private static _hypc: HypcWrapper | undefined;

  public static async compile(
    { logger }: { logger: Logger },
    compilationDetails: CompilationDetails
  ): Promise<any> {
    const { input, solcVersion } = compilationDetails;

    // Empty outputSelection for faster compilation
    delete (input.settings as any).outputSelection;

    logger.trace(
      `Hypc Input: ${JSON.stringify(
        {
          ...compilationDetails.input,
          sources: Object.keys(compilationDetails.input.sources),
        },
        null,
        2
      )}`
    );

    const hypc = this._getHypc();

    logger.trace(
      `Compiling with bundled hypc ${hypc.version()} (requested: ${solcVersion})`
    );

    const output = JSON.parse(hypc.compile(JSON.stringify(input)));

    // Normalize errors' sourceLocation to use utf-8 offsets instead of byte offsets
    for (const error of output.errors || []) {
      const source = input.sources[error.sourceLocation?.file];

      if (source === undefined) {
        continue;
      }

      error.sourceLocation.start = this._normalizeOffset(
        source.content,
        error.sourceLocation.start
      );
      error.sourceLocation.end = this._normalizeOffset(
        source.content,
        error.sourceLocation.end
      );
    }

    return output;
  }

  // Lazy-load the WASM compiler: it is large and takes noticeable time to
  // instantiate, so don't pay that cost on server startup.
  private static _getHypc(): HypcWrapper {
    if (this._hypc === undefined) {
      this._hypc = require("@theqrl/hypc") as HypcWrapper;
    }
    return this._hypc;
  }

  private static _normalizeOffset(text: string, offset: number) {
    if (offset < 0) {
      return offset; // don't transform negative offsets
    } else {
      return Buffer.from(text, "utf-8").slice(0, offset).toString("utf-8")
        .length;
    }
  }
}
