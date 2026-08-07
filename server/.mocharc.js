module.exports = {
  file: ["./test/setup.ts"],
  require: "ts-node/register",
  // Node >=22.18 strips types natively, which bypasses ts-node and breaks
  // loading the .ts setup/spec files under a commonjs package.
  "node-option": ["no-experimental-strip-types"],
  spec: "test/**/*.ts",
  timeout: 5000,
  exit: true,
};
