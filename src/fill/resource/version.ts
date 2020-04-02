import * as fs from 'fs';
import * as path from 'path';
import * as glob from "glob";
import { getWorkspaceRootPath } from "../../utils";
import { logger } from "../../logger";

const currentWorkspace = getWorkspaceRootPath();

export const findAllPackageJson = async (): Promise<string[]> => {

    if (!currentWorkspace) return [];

    return glob.sync("**/package.json", { cwd: currentWorkspace, nosort: true, nodir: true, ignore: "**/node_modules/**" })
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