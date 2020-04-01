<<<<<<< HEAD
=======
import * as vscode from "vscode";
import * as fs from "fs";
import * as os from "os";
import * as path from 'path';
>>>>>>> DocModel
import { Resource } from "./resource";
import { TMP_PATH } from "../utils";
import { logger } from "../logger";
import { DocModel } from "./resource/doc";

export class ExtensionCli {
    private resource: Resource = new Resource();

    constructor() {}

    public async runtime(): Promise<void> {}

    public async preInstall(): Promise<void> {
        const alls = await this.resource.getAllZorroVersions();
        logger.appendLine(`Tmp path: > ${TMP_PATH}`);
        logger.appendLine(`All versions: > ${alls}`);
        for (const v of alls) {
            await this.resource.acquireTarForZorro(v);
        };
    }
}
