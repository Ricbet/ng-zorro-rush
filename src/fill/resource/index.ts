import * as vscode from "vscode";
import * as os from "os";
import { getZorroVersion } from "./version";
import { makesureDirExist, debugTypeName, TMP_PATH } from "../../utils";
import { ZipManager } from "./zip";
import { logger } from "../../logger";

export class Resource {
    private zorroVersions: string[] | undefined = undefined;
    private zipManager: ZipManager = new ZipManager();

    constructor() {
        /**
         * 在用户 tmp 创建临时目录，存放不同版本的 zorro
         */
        makesureDirExist([debugTypeName /* version[] */], os.tmpdir());
    }

    public async getAllZorroVersions(): Promise<string[]> {
        if (!this.zorroVersions) {
            this.zorroVersions = await getZorroVersion();
        }
        return this.zorroVersions;
    }

    public async acquireTarForZorro(version: string): Promise<void> {
        const text = `WWaiting to download version ${version} of zorro ... `;

        logger.appendLine(text);

        return vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Window,
                title: text,
            },
            async () => {
                await this.zipManager.acquireTarForZorro(version);
                return Promise.resolve();
            }
        );
    }
}
