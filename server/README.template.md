# Hyperion Language Server

A language server for the [Hyperion](https://github.com/theqrl/hyperion) programming language — the smart contract language of the [QRL](https://www.theqrl.org/) Zond network — used in the `Hyperion` VS Code extension and the `@theqrl/coc-hyperion` coc.nvim extension.

Based on [hardhat-vscode](https://github.com/NomicFoundation/hardhat-vscode) by the Nomic Foundation, ported to Hyperion for the QRL/Zond ecosystem.

## Install

The language server can be installed via npm:

```sh
npm install @theqrl/hyperion-language-server -g

```

To run the server standalone:

```sh
hyperion-language-server --stdio
```

### coc.nvim

For coc the extension for this language server (found [here](https://www.npmjs.com/package/@theqrl/coc-hyperion)) can be installed through the coc vim command:

```vim
:CocInstall @theqrl/coc-hyperion
```

### neovim lsp

To run the language server directly through the neovim lsp (assuming [neovim/nvim-lspconfig](https://github.com/neovim/nvim-lspconfig))

```sh
local lspconfig = require 'lspconfig'
local configs = require 'lspconfig.configs'

configs.hyperion = {
  default_config = {
    cmd = {'hyperion-language-server', '--stdio'},
    filetypes = { 'hyperion' },
    root_dir = lspconfig.util.find_git_ancestor,
    single_file_support = true,
  },
}

lspconfig.hyperion.setup {}
```

[include '../docs/features.md']

## Contributing

Contributions are always welcome! Feel free to [open any issue](https://github.com/theqrl/hardhat-vscode/issues) or send a pull request.

Go to [CONTRIBUTING.md](https://github.com/theqrl/hardhat-vscode/blob/main/CONTRIBUTING.md) to learn about how to set up a development environment.

## Feedback, help and news

Found a bug or have a feature request? [Open an issue](https://github.com/theqrl/hardhat-vscode/issues).

For QRL/Zond news and support, visit [theqrl.org](https://www.theqrl.org/).
