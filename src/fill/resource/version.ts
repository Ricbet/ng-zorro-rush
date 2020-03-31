import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as cp from 'child_process';
import { getWorkspaceRootPath } from "../../utils";
import { logger } from "../../logger";

const currentWorkspace = getWorkspaceRootPath();

export const findAllPackageJson = async (): Promise<string[]> => {
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

export const getZorroVersion = async (): Promise<string[]> => {
    const allPackage = await findAllPackageJson();
    const resolvePath = allPackage.map(e => path.join(currentWorkspace, e));

    const versions: string[] = [];

    for (const path of resolvePath) {
        const readJson = fs.readFileSync(path, { encoding: "utf8" })
        try {
            const parse = JSON.parse(readJson);
            const dependencies = parse.dependencies;
            versions.push(dependencies["ng-zorro-antd"])
        } catch (error) {
            logger.appendLine(`read package.json error: > ${error.toString()}`)
        }
    }

    return Array.from(new Set(versions)).map(e => e.replace("^", "")).filter(Boolean)
}