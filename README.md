# coc-fs-lists

This is in very early development and isn't usable yet!

File system lists sources for [coc.nvim](https://github.com/neoclide/coc.nvim/)

Features:
- [x] `directories` View project directories
	- [x] `add` create file in directory
	- [x] `rename`
	- [x] `delete`
	- [x] `subdirs` view subdirectories in CocList
	- [x] `fs` view files in directory and subdirectories
- [x] `fs` View project files (because files is taken by coc-lists)
	- [x] `open`
	- [x] `preview`
	- [x] `quickfix`
	- [x] `tabe`
	- [x] `drop`
	- [x] `vsplit`
	- [x] `split`
	- [x] `rename`
	- [x] `delete`

## Install

```
:CocInstall coc-fs-lists
```

But don't install it yet

## Usage

See [using coc list](https://github.com/neoclide/coc.nvim/wiki/Using-coc-list).

## Config

- `list.source.directory.command` Directory command
- `list.source.directory.args` Args passed to directory command
- `list.source.fs.command` Fs command
- `list.source.fs.args` Fs args
