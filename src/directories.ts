import {BasicList, ListContext, ListItem, Neovim, workspace, Uri} from "coc.nvim";
import {spawn} from "child_process";
import {createInterface} from "readline";
import * as path from "path";
import * as fs from "fs";
import mkdirp from "mkdirp";
import rimraf from "rimraf";

function stat(path: string): Promise<fs.Stats> {
	return new Promise((resolve, _reject) => fs.stat(path, (err, stats) => {
		if (err) return resolve(null);
		resolve(stats);
	}));
}

export default class DirList extends BasicList {
	public defaultAction = "add"
	public description = "list of workspace directories"
	public name = "directories"
	public options = [
		{
			name: "-D, -directory DIRECTORY",
			description: "Only search subdirectories of a directory",
			hasValue: true,
		},
	]

	constructor(nvim: Neovim) {
		super(nvim);

		this.addAction("add", async item => {
			let filename = await workspace.requestInput(`File name (${item.label}/)`);
			let relpath = path.join(item.label, filename);
			let filepath = path.join(workspace.rootPath, relpath);
			let dir = path.dirname(filepath);
      let dirstat = await stat(dir);
      if (!dirstat || !dirstat.isDirectory()) {
				await new Promise((resolve, reject) => {
					mkdirp(dir, (err: any) => {
						if (err) return reject(err);
						resolve();
					});
				});
      }
			let uri = Uri.file(filepath).toString();
			await workspace.createFile(relpath, {overwrite: false, ignoreIfExists: true});
			await workspace.jumpTo(uri);
		}, {reload: false, persist: false});

		this.addAction("rename", async item => {
			let oldpath = path.join(workspace.rootPath, item.label);
			let newpath = await workspace.requestInput("New name", oldpath);
			await new Promise((resolve, reject) => {
				fs.rename(oldpath, newpath, err => {
					if (err) return reject(err);
					resolve();
				});
			});
		}, {reload: true, persist: true});

		this.addAction("delete", async item => {
			let dirpath = path.join(workspace.rootPath, item.label);
			let isEmpty = await new Promise((resolve, reject) => {
				fs.readdir(dirpath, (err, files) => {
					if (err) return reject(err);
					resolve(!files.length);
				});
			});
			if (!isEmpty) {
				let shouldContinue = await workspace.callAsync<string>("input", [`Directory ${item.label} isn't empty, delete anyway? [y/N]:`]);
				if (shouldContinue !== "y" && shouldContinue !== "Y") {
					return;
				}
			}
			await new Promise((resolve, reject) => {
				rimraf(dirpath, err => {
					if (err) return reject(err);
					resolve();
				});
			});
			await workspace.showMessage("Deleted");
		}, {reload: true, persist: true});
	}

	private getCommand(): {cmd: string, args: string[]} {
		let config = workspace.getConfiguration("list.source.directories");
		let cmd = config.get<string>("command", "");
		let args = config.get<string[]>("args", []);
		if (!cmd) {
			return {cmd: "find", args: args.length ? args : [".", "-type", "d"]};
		}
		return {cmd, args};
	}

	public async loadItems(context: ListContext): Promise<ListItem[]> {
		const options = this.parseArguments(context.args);
		let cwd: string;
		if (typeof options.directory === "string") {
			cwd = options.directory;
		} else {
			cwd = await workspace.rootPath;
		}
		return new Promise((resolve, reject) => {
			let {cmd, args} = this.getCommand();
			let process = spawn(cmd, args, {cwd});
			let rl = createInterface(process.stdout);
			let lines = [{label: ""}];
			process.on("error", e => {
				reject(e.message);
			});
			rl.on("line", line => {
				lines.push({
					label: line,
				});
			});
			rl.on("close", () => {
				resolve(lines);
			});
		});
	}
}
