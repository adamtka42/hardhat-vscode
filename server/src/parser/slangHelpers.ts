import _ from "lodash";
import { Range, Position } from "vscode-languageserver-types";
import semver from "semver";
import type {
  TextIndex,
  TextRange,
} from "@theqrl/slang/cst" with { "resolution-mode": "import" };
import { Logger } from "../utils/Logger";

export function slangToVSCodeRange(range: TextRange): Range {
  return {
    start: slangToVSCodePosition(range.start),
    end: slangToVSCodePosition(range.end),
  };
}

export function slangToVSCodePosition(position: TextIndex): Position {
  return {
    line: position.line,
    character: position.column,
  };
}

export async function resolveVersion(
  logger: Logger,
  versionPragmas: string[]
): Promise<string> {
  const { LanguageFacts } = await import("@theqrl/slang/utils");
  const versions = LanguageFacts.allVersions();

  const slangVersion = semver.maxSatisfying(versions, versionPragmas.join(" "));

  if (slangVersion !== null) {
    return slangVersion;
  } else {
    // Deviation from upstream (which falls back to the latest version):
    // the latest Hyperion version (0.3.0) tracks the unreleased 64-byte
    // address migration and its grammar is a moving target, so fall back
    // to the latest *released* Hyperion version instead.
    const fallback = "0.2.0";

    logger.info(
      `No Slang-supported version (fallback: ${fallback}) for Hyperion found that satisfies the pragma directives: '${versionPragmas.join(
        " "
      )}'.`
    );

    return fallback;
  }
}
