import * as fs from "fs";
import * as path from "path";
import { MarkdownString } from "vscode";

export enum EI18n {
    EN = "en-US",
    ZH = "zh-CN",
}

/**
 * 描述版本里的文档信息
 * 一个版本一个实例
 */
export class DocModel {
    /**
     * key 为组件名称，不以 nz- 开头
     * value 为 doc 路径
     */
    private sourceMap: Map<
        string,
        {
            path: string;
        }
    > = new Map();

    private i18nType: EI18n = EI18n.ZH;

    constructor(private readonly version: string, private readonly cwdPath: string) {
        this.handleComponentWithDocPath();
    }

    public setI18n(t: EI18n): this {
        this.i18nType = t;
        return this;
    }

    /**
     * 序列化组件名称与文档路径
     */
    private handleComponentWithDocPath(): void {
        const readAlldir = fs.readdirSync(this.cwdPath);
        const findFolder = readAlldir.filter(f => fs.lstatSync(path.join(this.cwdPath, f)).isDirectory());

        findFolder.forEach(dir => {
            this.sourceMap.set(dir, {
                path: path.join(this.cwdPath, dir, "doc", `index.${this.i18nType}.md`),
            });
        });
    }
}
