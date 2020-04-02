import * as semver from "semver";
import * as fs from "fs";
import * as path from "path";
import { Resource } from "./resource";
import { TMP_PATH } from "../utils";
import { logger } from "../logger";
import { readPackJson } from "./resource/version";
import { MarkdownString } from "vscode";

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
        }
    }

    /**
     * 根据文件路径获取最近的版本
     * 譬如文件位于 A 目录下，A 有自己的 zorro 版本，返回 A 所在的版本号
     */
    public async findEasyPackJsonVersion(p: string): Promise<string | null> {
        const parse = path.parse(p);

        const fill = (d: string) => `${d}/package.json`;
        const isHasPackj = (p: string): boolean => fs.existsSync(fill(p));

        let dir = parse.dir;

        while (!isHasPackj(dir)) dir = path.resolve(dir, "..");

        const version = await readPackJson(fill(dir));

        return (Boolean(version) && semver.minVersion(version!)?.version) || null;
    }

    public async getComponentDocWithVersion(v: string, c: string): Promise<MarkdownString> {
        return new Promise(async sendText => {
            const docModel = await this.resource.getDocModel(v);
            if (!docModel) {
                sendText(new MarkdownString());
                return;
            }

            const compDoc = await docModel.getComponentDoc(c);
            sendText(compDoc);
        });
    }
}
