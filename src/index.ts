import {ExtensionContext, workspace, listManager} from "coc.nvim";
import DirList from "./directories";
import FsList from "./fs";

export async function activate(context: ExtensionContext): Promise<void> {
	let {subscriptions} = context;
	let {nvim} = workspace;

	subscriptions.push(listManager.registerList(new DirList(nvim)));

	subscriptions.push(listManager.registerList(new FsList(nvim)));
};
