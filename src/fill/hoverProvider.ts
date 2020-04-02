import * as vscode from 'vscode';
import * as fs from 'fs';
import { extractTextForDocument, isRegForNZ, extractNZCharacter } from '../utils';
import { ExtensionCli } from './cli';

export class HoverProvider implements vscode.HoverProvider {

    constructor(private cli: ExtensionCli) { }

    public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        return new Promise(async sendHover => {
            const range = document.getWordRangeAtPosition(position);
            if (!range) return;
    
            const extRange = extractTextForDocument(document, range);
    
            if (isRegForNZ(extRange)) {
                const version = await this.cli.findEasyPackJsonVersion(document.uri.fsPath);

                if (!version) {
                    sendHover();
                    return;
                }

                const comp = extractNZCharacter(extRange);
                const doc = await this.cli.getComponentDocWithVersion(version, comp);
                console.log(doc, comp, version)
                sendHover(new vscode.Hover(doc))
                return;
            }
            
            sendHover()
        })
    }

}