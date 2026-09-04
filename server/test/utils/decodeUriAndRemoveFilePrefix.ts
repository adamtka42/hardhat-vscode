import { assert } from "chai";
import { decodeUriAndRemoveFilePrefix } from "@utils/index";
import { runningOnWindows } from "../../src/utils/operatingSystem";

describe("utils", () => {
  describe("decodeUriAndRemoveFilePrefix", () => {
    it("should strip the file prefix", () => {
      if (runningOnWindows()) {
        assertDecode(
          "file:///c:/Users/example/somefile.hyp",
          "c:/Users/example/somefile.hyp"
        );
      } else {
        assertDecode(
          "file:///Users/example/somefile.hyp",
          "/Users/example/somefile.hyp"
        );
      }
    });

    it("should convert to unix separator", () => {
      assertDecode(
        "c:\\Users\\example\\somefile.hyp",
        "c:/Users/example/somefile.hyp"
      );
    });

    it("should lowercase windows drive letters", () => {
      assertDecode(
        "C:/Users/example/somefile.hyp",
        "c:/Users/example/somefile.hyp"
      );

      assertDecode(
        "/C:/Users/example/somefile.hyp",
        "/c:/Users/example/somefile.hyp"
      );
    });
  });
});

function assertDecode(actual: string, expected: string) {
  assert.equal(decodeUriAndRemoveFilePrefix(actual), expected);
}
