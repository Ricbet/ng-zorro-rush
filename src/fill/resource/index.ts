import * as vscode from "vscode";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import { getZorroVersion } from "./version";
import { makesureDirExist, debugTypeName, TMP_PATH } from "../../utils";
import { ZipManager } from "./zip";
import { logger } from "../../logger";
import { DocModel } from "./doc";

export class Resource {
    private zorroVersions: string[] | undefined = undefined;
    private zipManager: ZipManager = new ZipManager();

    /**
     * key 为版本号
     */
    private docsMap: Map<string, DocModel> = new Map();

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

    public getDocModel(v: string): DocModel | undefined {
        return this.docsMap.has(v) ? this.docsMap.get(v) : undefined
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

                if (this.docsMap.get(version)) return;

                const componentsParentPath = path.join(TMP_PATH, version, `ng-zorro-antd-${version}`, "components");

                if (fs.existsSync(componentsParentPath)) {
                    this.docsMap.set(version, new DocModel(version, componentsParentPath));
                }
                
                return Promise.resolve();
            }
        );
    }
}
