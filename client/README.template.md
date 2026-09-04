# Hyperion for Visual Studio Code

This extension adds language support for [Hyperion](https://github.com/theqrl/hyperion) — the smart contract language of the [QRL](https://www.theqrl.org/) Zond network — to Visual Studio Code, and provides editor integration for [Hardhat](https://github.com/theqrl/hardhat) projects. It supports:

- [Code completion](#code-completions)
- [Go to definition, type definition and references](#navigation)
- [Symbol renames](#renames)
- [Hyperion code formatting](#format-document)
- [Inline code validation from compiler errors/warnings](#inline-code-validation-diagnostics)
- [Hover help for variables, function calls, errors, events etc.](#hover)
- [Document symbols and outline](#document-symbols-and-outline)
- [Code actions (quickfixes) suggested from compiler errors/warnings](#code-actions)
  - [Implement missing functions on interface with stubs](#implement-missing-functions-on-interface)
  - [Constrain mutability by adding `view`/`pure` to function signature](#constrain-mutability)
  - [Meet inheritance requirements by adding `virtual`/`override` on function signature](#adding-virtualoverride-on-inherited-function-signature)
  - [Provide accessibility by adding `public`/`private` to function signature](#adding-publicprivate-to-function-signature)
  - [Specify license identifier and pragma hyperion version](#adding-license-identifier-and-pragma-hyperion-version)

Based on [hardhat-vscode](https://github.com/NomicFoundation/hardhat-vscode) by the Nomic Foundation, ported to Hyperion for the QRL/Zond ecosystem.

---

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Project support](#project-support)
- [Monorepo Support](#monorepo-support)
- [Formatting](#formatting)
  - [Formatting Configuration](#formatting-configuration)
- [Feedback, help and news](#feedback-help-and-news)

---

## Installation

Until the extension is published to the Visual Studio Code Marketplace, install it from a `.vsix` package:

```sh
code --install-extension hardhat-hyperion-<version>.vsix
```

The `.vsix` can be built from this repository with `npm ci && npm run package`.

[include '../docs/features.md']

### Commands

#### Compile project

When working on a Hardhat project, the command `Hardhat: Compile project` is available on the command palette. This will trigger a `hardhat compile` run.

#### Clean artifacts

When working on a hardhat project, the command `Hardhat: Clear cache and artifacts` is present on the command palette. This will trigger a `hardhat clean` run.

#### Flatten contract

When working on a hyperion file inside a hardhat project, the command `Hardhat: Flatten this file and its dependencies` is present on the command palette and the context menu. This will trigger a `hardhat flatten $FILE` run, and will output the result in a new file tab.

### Task provider

The extension is registered as a task provider for Hardhat projects, in which the `build` task is provided, running `hardhat compile`, and the `test` task, which runs `hardhat test`.

## Formatting

**Hyperion for Visual Studio Code** provides formatting support for `.hyp` files, by leveraging [prettier-plugin-solidity](https://github.com/prettier-solidity/prettier-plugin-solidity).

> **Note:** if you currently have other solidity/hyperion extensions installed, or have had previously, they may be set as your default formatter for hyperion files.

To set **Hyperion for Visual Studio Code** as your default formatter for hyperion files:

1. Within a Hyperion file run the _Format Document With_ command, either through the **command palette**, or by right clicking and selecting through the context menu.

2. Select `Configure Default Formatter...`

3. Select `Hyperion` as the default formatter for hyperion files.

### Formatting Configuration

The default formatting rules that will be applied are taken from [prettier-plugin-solidity](https://github.com/prettier-solidity/prettier-plugin-solidity#configuration-file), with the exception that `explicitTypes` are preserved (rather than forced).

To override the settings, add a `prettierrc` configuration file at the root of your project. Add a `*.hyp` file override to the prettier configuration file and change from the **defaults** shown:

```javascript
// .prettierrc.json
{
  "overrides": [
    {
      "files": "*.hyp",
      "options": {
        "printWidth": 80,
        "tabWidth": 4,
        "useTabs": false,
        "singleQuote": false,
        "bracketSpacing": false,
        "explicitTypes": "preserve"
      }
    }
  ]
}
```

Formatting can be disabled by setting the `hyperion.formatter` configuration option to `none`.

## Alternative editors

We also distribute a [vim.coc](https://www.npmjs.com/package/@theqrl/coc-hyperion) extension and a [standalone language server](https://www.npmjs.com/package/@theqrl/hyperion-language-server) that you can integrate with your editor of choice to have full Hyperion language support.

## Feedback, help and news

Found a bug or have a feature request? [Open an issue](https://github.com/theqrl/hardhat-vscode/issues).

For QRL/Zond news and support, visit [theqrl.org](https://www.theqrl.org/).
