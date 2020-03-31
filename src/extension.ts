import { ExtensionContext } from 'vscode';
import LanguagesManager from './fill/languages';
import { ExtensionCli } from './fill/cli';
import { getZorroVersion } from './fill/resource/version';

export async function activate(context: ExtensionContext) {
    const cli: ExtensionCli = new ExtensionCli();
    const languagesManager: LanguagesManager = new LanguagesManager(context, cli);

    languagesManager.registerLanguagesHoverProvider()

    cli.runtime()

}

export function deactivate() { }
