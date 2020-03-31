import { ExtensionContext } from 'vscode';
import LanguagesManager from './fill/languages';
import { ExtensionCli } from './fill/cli';

export function activate(context: ExtensionContext) {
    const cli: ExtensionCli = new ExtensionCli();
    const languagesManager: LanguagesManager = new LanguagesManager(context, cli);

    languagesManager.registerLanguagesHoverProvider()
}

export function deactivate() { }
