import {ExtensionContext, workspace, listManager} from "coc.nvim";
import DirList from "./directories";

export async function activate(context: ExtensionContext): Promise<void> {
	let {subscriptions} = context;
	let {nvim} = workspace;

	subscriptions.push(listManager.registerList(new DirList(nvim)));
};
