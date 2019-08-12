# coc-fs-lists

This is in very early development and isn't usable yet!

File system lists sources for [coc.nvim](https://github.com/neoclide/coc.nvim/)

Features:
- [ ] `directories`
	- [x] `add` create file in directory
	- [x] `rename`
	- [x] `delete`
	- [x] `subdirs` view subdirectories in CocList
	- [ ] `fs` view files in directory and subdirectories
- [ ] `fs` (because files is taken by coc-lists)
	- [ ] `open`
	- [ ] `preview`
	- [ ] `quickfix`
	- [ ] `tabe`
	- [ ] `drop`
	- [ ] `vsplit`
	- [ ] `split`
	- [ ] `rename`
	- [ ] `delete`

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
