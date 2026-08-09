import { assert } from "chai";
import { defaultCompletion } from "../../../src/services/completion/defaultCompletion";

describe("defaultCompletion", () => {
  const labels = defaultCompletion.map((item) => item.label);

  it("includes integer types up to 512 bits", () => {
    for (const label of ["int8", "int256", "int264", "int512"]) {
      assert.include(labels, label);
      assert.include(labels, `u${label}`);
    }
  });

  it("includes bytes types up to 64 bytes", () => {
    for (const label of ["bytes1", "bytes32", "bytes33", "bytes64"]) {
      assert.include(labels, label);
    }
  });

  it("does not include types beyond the 512-bit word", () => {
    for (const label of ["int520", "uint520", "bytes65"]) {
      assert.notInclude(labels, label);
    }
  });
});
