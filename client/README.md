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

## Features

### Code Completions

The hyperion language server autocompletes references to existing symbols (e.g. contract instances, globally available variables and built-in types like arrays) and import directives (i.e. it autocompletes the path to the imported file).

Direct imports (those not starting with `./` or `../`) are completed based on suggestions from `./node_modules`.

Relative imports pull their suggestions from the file system based on the current hyperion file's location.

Natspec documentation completion is also supported.

Completions cover the full Hyperion type range, including the 512-bit integer types (`uint264`–`uint512`, `int264`–`int512`) and the extended byte types (`bytes33`–`bytes64`).

---

### Navigation

Move through your codebase with semantic navigation commands:

#### Go to Definition

Navigates to the definition of an identifier.

#### Go to Type Definition

Navigates to the type of an identifier.

#### Go to References

Shows all references of the identifier under the cursor.

---

### Renames

Rename the identifier under the cursor and all of its references.

---

### Format document

Apply Hyperion formatting to the current document, for all the configuration options see [Formatting Configuration](#formatting-configuration).

---

### Hover

Hovering the cursor over variables, function calls, errors and events will display a popup showing type and signature information.

---

### Document symbols and outline

The structure of the current file (contracts, functions, state variables, structs, events, …) is provided to the editor, powering the _Outline_ view, breadcrumbs and `Go to Symbol` navigation.

---

### Inline code validation (Diagnostics)

As code is edited, the [hypc](https://github.com/theqrl/hyperion) compiler bundled with the extension is run over the changes and any warnings or errors are displayed. This works both for standalone `.hyp` files and for files within a Hardhat project.

---

### Code Actions

Code actions, or quickfixes are refactorings suggested to resolve a `hypc` warning or error.

A line with a warning/error that has a _code action_, will appear with small light bulb against it; clicking the light bulb will provide the option to trigger the _code action_.

#### Implement missing functions on interface

A contract that implements an interface, but is missing functions specified in the interface, will get a `hyperion(3656)` error.

The matching code action _Add missing functions from interface_ will determine which functions need to be implemented to satisfy the interface and add them as stubs to the body of the contract.

#### Constrain mutability

A function without a mutability keyword but which does not update contract state will show a `hyperion(2018)` warning, with `hypc` suggesting adding either the `view` or `pure` keyword depending on whether the function reads from state.

The matching code action _Add view/pure modifier to function declaration_ resolves the warning by adding the keyword to the function signature.

#### Adding `virtual`/`override` on inherited function signature

A function in an inheriting contract, that has the same name and parameters as a function in the base contract, causes `hyperion(4334)` in the base contract function if it does not have the `virtual` keyword and `hyperion(9456)` in the inheriting contract function if does not have the `override` keyword.

The _Add virtual specifier to function definition_ and _Add override specifier to function definition_ code actions appear against functions with these errors.

#### Adding `public`/`private` to function signature

A function without an accessibility keyword will cause the `hyperion(4937)` error.

Two code actions will appear against a function with this error: _Add public visibility to declaration_ and _Add private visibility to declaration_.

#### Adding license identifier and `pragma hyperion` version

When no license is specified on a contract, the `hyperion(1878)` warning is raised by the compiler. Similarly, when no compiler version is specified with a `pragma hyperion` statement, the compiler shows the `hyperion(3420)` warning. There are code actions available for quick fixes.

> **Note:** the _Add version specification_ quickfix relies on the version suggestion embedded in the compiler warning, which release builds of `hypc` provide. With a pre-release (nightly) compiler bundled, the warning is still shown but the quickfix is not offered.

#### Specifying data location for variables

Some types require you to specify a data location (memory, storage, calldata), depending on where they are defined. The available code actions allow the user to add, change or remove data locations depending on the error being raised.

#### Hardhat console auto-import

Hardhat's `console.hyp` (from the [`@theqrl/hardhat`](https://github.com/theqrl/hardhat) fork) can be imported with this quickfix. Please note that this is only available on hardhat projects.

---

## Project support

Inline code validation is powered by the `hypc` compiler bundled with the extension, so it works out of the box — both for standalone `.hyp` files and for files within a project.

### Hardhat

Hardhat projects (using the [`@theqrl/hardhat`](https://github.com/theqrl/hardhat) fork) are detected by looking for a `hardhat.config.{js,ts}` file. Within a Hardhat project, import resolution additionally covers direct imports from the project's `node_modules`, and the Hardhat commands and tasks (compile, clean, flatten) become available.

### Standalone files

If the Hyperion file is not part of a project or the project cannot be determined, a best effort is made to resolve imports based on relative paths and `node_modules` resolution.

## Monorepo Support

Monorepos are supported and can be opened as workspace folders. On opening a monorepo, it will be scanned to find all Hardhat projects.

The _project type_ and _project config file_ that are being used when validating a Hyperion file are shown in the Hyperion section of the _Status Bar_.


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
