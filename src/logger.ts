import * as vscode from "vscode";
import { extensionName } from "./utils";

export const logger = vscode.window.createOutputChannel(extensionName);
