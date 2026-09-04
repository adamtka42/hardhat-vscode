import { window, extensions, workspace } from "vscode";
import { Logger } from "../utils/Logger";

// Solidity extensions don't claim `.hyp`, but a stale `files.associations`
// entry (or manual language selection) can route hyperion files to them,
// producing confusing diagnostics from a solc compiler that doesn't know
// `pragma hyperion` — while this extension's language server never attaches.
const CONFLICTING_EXTENSIONS = [
  { id: "juanblanco.solidity", name: "solidity" },
  {
    id: "nomicfoundation.hardhat-solidity",
    name: "Solidity by Nomic Foundation",
  },
];

export async function warnOnOtherSolidityExtensions({
  logger,
}: {
  logger: Logger;
}) {
  try {
    const associations =
      workspace
        .getConfiguration("files")
        .get<Record<string, string>>("associations") ?? {};

    for (const [pattern, language] of Object.entries(associations)) {
      if (pattern.endsWith(".hyp") && language !== "hyperion") {
        await window.showWarningMessage(
          `Your \`files.associations\` setting maps \`${pattern}\` to the \`${language}\` language. Hyperion features only work when \`.hyp\` files use the \`hyperion\` language — remove the association or point it at \`hyperion\`.`,
          "Okay"
        );
      }
    }

    for (const { id, name } of CONFLICTING_EXTENSIONS) {
      const conflictingExtension = extensions.getExtension(id);

      if (conflictingExtension === undefined) {
        continue;
      }

      await window.showWarningMessage(
        `The \`${name}\` (${id}) extension is enabled. It targets Solidity and can conflict with Hyperion \`.hyp\` files (e.g. through file associations). Consider disabling it while working on Hyperion.`,
        "Okay"
      );
    }
  } catch (err) {
    logger.error(err);
  }
}
