import * as vscode from "vscode";

export const extensionName = "NG-ZORRO Rush";
export const debugTypeName = "ng-zorro-rush";

export const sleep = async (time: number) => new Promise(res => setTimeout(() => res(), time));

export const getWorkspaceRootPath = (): string => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    return workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.path : "";
};