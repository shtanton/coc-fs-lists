// Most of this is stolen from coc-lists

import {BasicList, ListContext, ListTask, Neovim, workspace, Uri} from "coc.nvim";
import {spawn, ChildProcess} from "child_process";
import * as path from "path";
import {Location, Range} from "vscode-languageserver-protocol";
import * as readline from "readline";
import {EventEmitter} from "events";

class Task extends EventEmitter implements ListTask {
  private processes: ChildProcess[] = []

  public start(cmd: string, args: string[], cwd: string): void {
		let process = spawn(cmd, args, { cwd })
		this.processes.push(process)
		process.on('error', e => {
			this.emit('error', e.message)
		})
		const rl = readline.createInterface(process.stdout)
		const range = Range.create(0, 0, 0, 0)
		process.stderr.on('data', chunk => {
			console.error(chunk.toString('utf8')) // tslint:disable-line
		})

		rl.on('line', line => {
			let file = path.join(cwd, line)
			let location = Location.create(Uri.file(file).toString(), range)
			this.emit('data', {
				label: line,
				location
			})
		})
		rl.on('close', () => {
			this.emit('end')
		})
  }

  public dispose(): void {
    for (let process of this.processes) {
      if (!process.killed) {
        process.kill()
      }
    }
  }
}

export default class FsList extends BasicList {
	public defaultAction = "open"
	public description = "File list"
	public name = "fs"
	public options = [
		{
			name: "-D, -directory DIRECTORY",
			description: "Only search within a directory",
			hasValue: true,
		},
	]
	
	constructor(nvim: Neovim) {
		super(nvim);
		this.addLocationActions();
	}

	private getCommand(): {cmd: string, args: string[]} {
		let config = workspace.getConfiguration("list.source.fs");
		let cmd = config.get<string>("command", "");
		let args = config.get<string[]>("args", []);
		if (!cmd) {
			return {cmd: "find", args: args.length ? args : [".", "-type", "f"]};
		}
		return {cmd, args};
	}

	public async loadItems(context: ListContext): Promise<ListTask> {
		const options = this.parseArguments(context.args);
		let cwd: string;
		if (typeof options.directory === "string") {
			cwd = options.directory;
		} else {
			cwd = await workspace.rootPath;
		}
		let {cmd, args} = this.getCommand();
		let task = new Task();
		task.start(cmd, args, cwd);
		return task;
	}
}
