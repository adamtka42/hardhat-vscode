import { CompletionItemKind } from "@common/types";

const elementaryTypeNames = ["address", "bool", "string", "var"];

// Hyperion's 512-bit VM word: intM/uintM go up to 512 (in steps of 8) and
// bytesM up to 64 (liblangutil/Token.cpp in the hyperion compiler).
const integerSizes = Array.from({ length: 64 }, (_, i) => (i + 1) * 8);
const byteSizes = Array.from({ length: 64 }, (_, i) => i + 1);

const ints = ["int", ...integerSizes.map((size) => `int${size}`)];
const uints = ["uint", ...integerSizes.map((size) => `uint${size}`)];
const bytes = ["byte", "bytes", ...byteSizes.map((size) => `bytes${size}`)];
const fixed = "fixed";
const ufixed = "ufixed";

const functionVisibilitySpecifiers = [
  "public",
  "private",
  "external",
  "internal",
];
const modifiers = [
  "pure",
  "view",
  "payable",
  "constant",
  "immutable",
  "anonymous",
  "indexed",
  "virtual",
  "override",
];
const reservedKeywords = [
  "after",
  "alias",
  "apply",
  "auto",
  "case",
  "copyof",
  "default",
  "define",
  "final",
  "immutable",
  "implements",
  "in",
  "inline",
  "let",
  "macro",
  "match",
  "mutable",
  "null",
  "of",
  "partial",
  "promise",
  "return",
  "reference",
  "relocatable",
  "sealed",
  "sizeof",
  "static",
  "supports",
  "switch",
  "typedef",
  "typeof",
  "unchecked",
];
const statements = ["assert", "revert", "require"];

const globalFunctions = [
  "gasleft",
  "blockhash",
  "keccak256",
  "sha256",
  "ripemd160",
  "ecrecover",
  "addmod",
  "mulmod",
  "selfdestruct",
];

interface GlobalVariablesType {
  [globalVariable: string]: string[];
}
export const globalVariables: GlobalVariablesType = {
  abi: [
    "decode",
    "encode",
    "encodePacked",
    "encodeWithSelector",
    "encodeWithSignature",
    "encodeCall",
  ],
  bytes: ["concat"],
  block: [
    "chainid",
    "coinbase",
    "difficulty",
    "gaslimit",
    "number",
    "timestamp",
  ],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  "msg.sender": [
    "balance",
    "code",
    "codehash",
    "call",
    "delegatecall",
    "staticcall",
  ],
  msg: ["data", "sender", "sig", "value"],
  tx: ["gasprice", "origin"],
};

export const defaultCompletion = [
  // --------------- Global Functions ---------------
  ...globalFunctions.map((globalFunction) => {
    return {
      label: globalFunction,
      kind: CompletionItemKind.Function,
    };
  }),

  // --------------- Global Variables ---------------
  ...Object.keys(globalVariables).map((globalVariable) => {
    return {
      label: globalVariable,
      kind: CompletionItemKind.Variable,
    };
  }),

  // --------------- Keywords ---------------
  ...functionVisibilitySpecifiers.map((functionVisibilitySpecifier) => {
    return {
      label: functionVisibilitySpecifier,
      kind: CompletionItemKind.Keyword,
    };
  }),
  ...modifiers.map((modifier) => {
    return {
      label: modifier,
      kind: CompletionItemKind.Keyword,
    };
  }),
  ...reservedKeywords.map((reservedKeyword) => {
    return {
      label: reservedKeyword,
      kind: CompletionItemKind.Keyword,
    };
  }),
  ...statements.map((statement) => {
    return {
      label: statement,
      kind: CompletionItemKind.Keyword,
    };
  }),

  ...elementaryTypeNames.map((elementaryTypeName) => {
    return {
      label: elementaryTypeName,
      kind: CompletionItemKind.Keyword,
    };
  }),
  ...ints.map((intType) => {
    return {
      label: intType,
      kind: CompletionItemKind.Keyword,
    };
  }),
  ...uints.map((uintType) => {
    return {
      label: uintType,
      kind: CompletionItemKind.Keyword,
    };
  }),
  ...bytes.map((byteType) => {
    return {
      label: byteType,
      kind: CompletionItemKind.Keyword,
    };
  }),
  {
    label: fixed,
    kind: CompletionItemKind.Keyword,
  },
  {
    label: ufixed,
    kind: CompletionItemKind.Keyword,
  },
];
