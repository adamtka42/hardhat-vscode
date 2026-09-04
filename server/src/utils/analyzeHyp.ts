/**
 * Pure-TS replacement for `@nomicfoundation/solidity-analyzer` (native Rust
 * module). Extracts import paths and `pragma hyperion` version constraints
 * from hyperion source text. Same result shape as the native analyzer so
 * call sites are drop-in compatible.
 */
export interface AnalysisResult {
  versionPragmas: string[];
  imports: string[];
}

const PRAGMA_REGEX = /pragma\s+hyperion\s+([^;]+);/g;
const IMPORT_REGEX = /\bimport\s+(?:[^"';]*?from\s+)?(["'])([^"']*)\1/g;

export function analyze(input: string): AnalysisResult {
  const cleaned = stripCommentsAndBlankStrings(input);

  const versionPragmas: string[] = [];
  const imports: string[] = [];

  for (const match of cleaned.matchAll(PRAGMA_REGEX)) {
    versionPragmas.push(match[1].trim());
  }

  // Import paths are string literals, which stripping replaced with
  // placeholders, so extract them from the original text at the same offsets.
  for (const match of cleaned.matchAll(IMPORT_REGEX)) {
    const literalStart = match.index + match[0].length - match[2].length - 1;
    imports.push(input.slice(literalStart, literalStart + match[2].length));
  }

  return { versionPragmas, imports };
}

/**
 * Replaces comment contents and string literal contents with spaces (never
 * changing offsets or line structure), so that regexes above cannot match
 * inside comments and cannot be confused by `//` or quotes within strings.
 */
function stripCommentsAndBlankStrings(text: string): string {
  const out = text.split("");

  type State = "code" | "line" | "block" | "single" | "double";
  let state: State = "code";

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    switch (state) {
      case "code":
        if (c === "/" && next === "/") {
          state = "line";
          out[i] = " ";
        } else if (c === "/" && next === "*") {
          state = "block";
          out[i] = " ";
        } else if (c === '"') {
          state = "double";
        } else if (c === "'") {
          state = "single";
        }
        break;
      case "line":
        if (c === "\n") {
          state = "code";
        } else {
          out[i] = " ";
        }
        break;
      case "block":
        if (c === "*" && next === "/") {
          out[i] = " ";
          out[i + 1] = " ";
          i++;
          state = "code";
        } else if (c !== "\n") {
          out[i] = " ";
        }
        break;
      case "double":
        if (c === '"') {
          state = "code";
        } else if (c === "\\") {
          out[i] = " ";
          if (next !== undefined && next !== "\n") {
            out[i + 1] = " ";
            i++;
          }
        } else if (c !== "\n") {
          out[i] = " ";
        }
        break;
      case "single":
        if (c === "'") {
          state = "code";
        } else if (c === "\\") {
          out[i] = " ";
          if (next !== undefined && next !== "\n") {
            out[i + 1] = " ";
            i++;
          }
        } else if (c !== "\n") {
          out[i] = " ";
        }
        break;
    }
  }

  return out.join("");
}
