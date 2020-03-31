import * as vscode from 'vscode';
import { extractTextForDocument, isRegForNZ } from '../utils';
import { ExtensionCli } from './cli';

export class HoverProvider implements vscode.HoverProvider {

    constructor(private cli: ExtensionCli) { }

    public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {

        const range = document.getWordRangeAtPosition(position);
        if (!range) return;

        const extRange = extractTextForDocument(document, range);

        if (isRegForNZ(extRange)) {
            console.log(extRange)
        }

        return
    }

}