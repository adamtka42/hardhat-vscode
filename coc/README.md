# coc-hyperion

Hyperion language server extension for coc.nvim, leveraging the language server used in the Hyperion VS Code extension for [QRL](https://www.theqrl.org/) Zond smart contracts.

## Install

In your vim/neovim, run this command:

```sh
:CocInstall @theqrl/coc-hyperion
```

## Filetype detection

Vim does not know the `.hyp` extension out of the box. Add this to your `init.vim`/`.vimrc` so Hyperion files get the right filetype:

```vim
autocmd BufRead,BufNewFile *.hyp setfiletype hyperion
```

## Configure

In your coc-settings.json, the following settings are supported:

- `"@theqrl/coc-hyperion.telemetry": true|false`
- `"@theqrl/coc-hyperion.formatter": "prettier"|"none"`

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


## Format document

Running `:call CocActionAsync('format')` will trigger document formatting.

## Language server logs

If you encounter an issue with the plugin, you can inspect the server logs by running `:CocCommand workspace.showOutput`. This can help troubleshooting the problem.

## Restarting the server

Sometimes, e.g. when installing node dependencies or switching branches, the language server may not pick up all the file system changes. If you are facing an issue, try running `:CocRestart`, which will in turn restart the hyperion language server.

## Contributing

Contributions are always welcome! Feel free to [open any issue](https://github.com/theqrl/hardhat-vscode/issues) or send a pull request.
