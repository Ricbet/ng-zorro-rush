// @ts-ignore
import * as clone from 'git-clone';
import { getZorroVersion } from './version';
import { makesureDirExist } from '../../utils';

const tmpPath = "/tmp"

export class Resource {
    private zorroVersions: string[] | undefined = undefined;

    constructor() {
        /**
         * 在用户 tmp 创建临时目录，存放不同版本的 zorro
         */
        makesureDirExist(["nz-zorro-rush" /* version[] */], tmpPath)
    }

    public async getAllZorroVersions(): Promise<string[]> {
        if (this.zorroVersions) {
            return this.zorroVersions
        } else {
            this.zorroVersions = await getZorroVersion()
            return this.zorroVersions
        }
    }


    public gitCloneForVersion(version: string): Promise<void> {
        return new Promise(res => {
            console.log(version, "verison")
        })
    }

}