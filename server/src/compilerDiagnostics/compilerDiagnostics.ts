import { AddLicenseIdentifier } from "./diagnostics/AddLicenseIdentifier";
import { AddMultiOverrideSpecifier } from "./diagnostics/AddMultiOverrideSpecifier";
import { AddOverrideSpecifier } from "./diagnostics/AddOverrideSpecifier";
import { AddVirtualSpecifier } from "./diagnostics/AddVirtualSpecifier";
import { ConstrainMutability } from "./diagnostics/ConstrainMutability";
import { ContractCodeSize } from "./diagnostics/ContractCodeSize";
import { MarkContractAbstract } from "./diagnostics/MarkContractAbstract";
import { SpecifyVisibility } from "./diagnostics/SpecifyVisibility";
import { SpecifyCompilerVersion } from "./diagnostics/SpecifyCompilerVersion";
import { CompilerDiagnostic } from "./types";
import { SpecifyDataLocation } from "./diagnostics/SpecifyDataLocation";

export const compilerDiagnostics: { [key: string]: CompilerDiagnostic } = [
  new AddOverrideSpecifier(),
  new AddLicenseIdentifier(),
  new AddMultiOverrideSpecifier(),
  new AddVirtualSpecifier(),
  new ConstrainMutability(),
  new ContractCodeSize(),
  // InvalidChecksum (9429) is not registered: hypc never emits it — QRL
  // addresses are 64 bytes and use a different (SHAKE-256) checksum scheme.
  new MarkContractAbstract(),
  new SpecifyVisibility(),
  new SpecifyCompilerVersion(),
  new SpecifyDataLocation(),
].reduce((acc, item) => ({ ...acc, [item.code]: item }), {});
