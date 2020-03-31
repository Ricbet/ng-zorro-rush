import * as vscode from "vscode";
import { HoverProvider } from "./hoverProvider";
import { ExtensionCli } from "./cli";

const languagesFileSupport = ["html"];

class LanguagesManager {
    constructor(private context: vscode.ExtensionContext, private cli: ExtensionCli) { }

    public registerLanguagesHoverProvider(): void {
        this.context.subscriptions.push(vscode.languages.registerHoverProvider(languagesFileSupport, new HoverProvider(this.cli)))
    }
}

export default LanguagesManager;
