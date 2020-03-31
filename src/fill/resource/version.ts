import * as versionCompare from "tiny-version-compare";
import * as fs from 'fs';
import * as util from 'util';
import * as cp from 'child_process';
import { getWorkspaceRootPath } from "../../utils";

export const getZorroVersion = async (): Promise<string[]> => {
    const currentWorkspace = getWorkspaceRootPath();

    const ignores = ["node_modules"]

    if (!currentWorkspace) return [];

    // 查找所有 package.json 文件
    const resOut = await util.promisify(cp.exec)(`find . -name "package.json" ${ignores.reduce((pre: string, cur: string) => `${pre} ! -path "*/${cur}/*"`, "")}`, { cwd: currentWorkspace })

    if (resOut) {
        const str = resOut.stdout.toString();
        return str.split("\n").filter(Boolean)
    } else {
        return []
    }
}