/* eslint-disable @typescript-eslint/no-var-requires */
import semver from "semver";
import { ServerState } from "../../types";

// The extension bundles a single hypc compiler (see server/vendor) and there
// is no public registry of hypc builds to fetch. The version is normalized
// (e.g. "0.2.0-64b.0" -> "0.2.0") because nightly/prerelease tags would never
// match plain semver ranges used in pragmas.
const bundledHypcVersion: string = semver.coerce(
  require("@theqrl/hypc/package.json").version
)!.version;

export const availableVersions = [bundledHypcVersion];

export async function updateAvailableSolcVersions(state: ServerState) {
  state.solcVersions = availableVersions;
}
