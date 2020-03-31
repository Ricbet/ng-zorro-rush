import * as vscode from "vscode";
import * as path from "path";
import * as fse from "fs-extra";

export const extensionName = "NG-ZORRO Rush";
export const debugTypeName = "ng-zorro-rush";

export const sleep = async (time: number) => new Promise(res => setTimeout(() => res(), time));

export const getWorkspaceRootPath = (): string => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    return workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.path : "";
};

export const makesureDirExist = (paths: string[], absolutePath: string) => {
    let base = "";
    for (const p of paths) {
        base += `${p}/`;
        if (!fse.existsSync(path.join(absolutePath, base))) {
            fse.mkdirSync(path.join(absolutePath, base));
        }
    }
};

export const extractTextForDocument = (document: vscode.TextDocument, range: vscode.Range): string => {
    return document.lineAt(range.start.line).text.slice(range.start.character, range.end.character)
}

export const isRegForNZ = (s: string): boolean => new RegExp(/^(nz-)/g).test(s);