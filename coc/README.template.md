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

[include '../docs/features.md']

## Format document

Running `:call CocActionAsync('format')` will trigger document formatting.

## Language server logs

If you encounter an issue with the plugin, you can inspect the server logs by running `:CocCommand workspace.showOutput`. This can help troubleshooting the problem.

## Restarting the server

Sometimes, e.g. when installing node dependencies or switching branches, the language server may not pick up all the file system changes. If you are facing an issue, try running `:CocRestart`, which will in turn restart the hyperion language server.

## Contributing

Contributions are always welcome! Feel free to [open any issue](https://github.com/theqrl/hardhat-vscode/issues) or send a pull request.
