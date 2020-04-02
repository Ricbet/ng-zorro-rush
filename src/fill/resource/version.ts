import * as fs from 'fs';
import * as path from 'path';
import * as glob from "glob";
import * as semver from "semver";
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
        const parse = await readPackJson(path);
        versions.push(parse ? parse : "")
    }

    return Array.from(new Set(versions)).filter(Boolean).map(e => semver.minVersion(e)?.version!)
}

export const readPackJson = async (path: string): Promise<string | undefined> => {
    return new Promise(res => {
        const readJson = fs.readFileSync(path, { encoding: "utf8" })
        try {
            const parse = JSON.parse(readJson);
            const dependencies = parse.dependencies;
            res(dependencies["ng-zorro-antd"])
        } catch (error) {
            logger.appendLine(`read package.json error: > ${error.toString()}`)
            res(undefined)
        }
    })
}