// @ts-ignore
import * as clone from "git-clone";
import * as os from "os";
import { getZorroVersion } from "./version";
import { makesureDirExist, debugTypeName } from "../../utils";

export class Resource {
    private zorroVersions: string[] | undefined = undefined;

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
}
