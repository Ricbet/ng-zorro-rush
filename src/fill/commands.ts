import * as vscode from "vscode";

class CommandsManager {
    constructor(private context: vscode.ExtensionContext) { }

    private registerCommandFactory(cmd: string): Function {
        return (fn: (...args: any[]) => any) => {
            this.context.subscriptions.push(vscode.commands.registerCommand(cmd, fn));
        };
    }
}

export default CommandsManager;
