/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompilationDetails } from "../../frameworks/base/CompilationDetails";
import { ValidationResult, ValidationFail, ValidationPass } from "../../types";

export class OutputConverter {
  public static getValidationResults(
    compilationDetails: CompilationDetails,
    solcOutput: any,
    projectBasePath: string
  ): ValidationResult {
    // Drop warning 3805 ("This is a pre-release compiler version") — the
    // bundled hypc is a nightly build, so it would flag every single file.
    const errors = (solcOutput.errors ?? []).filter(
      (solcError: any) => solcError.errorCode !== "3805"
    );

    if (errors.length > 0) {
      const validationFailMessage: ValidationFail = {
        status: "VALIDATION_FAIL",
        projectBasePath,
        version: compilationDetails.solcVersion,
        // Errors without a sourceLocation (e.g. standard JSON input errors)
        // are passed through untouched
        errors: errors.map((solcError: any) => ({
          ...solcError,
          sourceLocation: solcError.sourceLocation && {
            ...solcError.sourceLocation,
            file: normalizeSourceName(solcError.sourceLocation.file),
          },
        })),
      };

      return validationFailMessage;
    } else {
      const validationPassMessage: ValidationPass = {
        status: "VALIDATION_PASS",
        projectBasePath,
        version: compilationDetails.solcVersion,
        sources: Object.keys(compilationDetails.input.sources).map(
          normalizeSourceName
        ),
      };

      return validationPassMessage;
    }
  }
}

export function normalizeSourceName(internalSourceName: string) {
  return internalSourceName.replace("project/", "");
}
