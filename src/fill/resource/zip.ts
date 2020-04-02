import * as request from "request";
import * as path from "path";
import * as fs from "fs";
import * as fse from "fs-extra";
import * as compressing from "compressing";
import * as mkdirp from "mkdirp";
import { TMP_PATH } from "../../utils";
import { logger } from "../../logger";

/**
 * 利用 compressing 下载对应版本的 zorro 里的 releases 里的 tar.gz 压缩包，解压在 tmp 目录
 * 不建议直接 git clone , 忒慢
 * 也不建议 cp.exec 执行命令，不同系统不兼容
 */
export class ZipManager {
    constructor() {}

    private getZorroUrl = (v: string) => {
        return `https://github.com/NG-ZORRO/ng-zorro-antd/archive/${v}.tar.gz`;
    };

    private isExistsLibForVersion(version: string): boolean {
        return fs.existsSync(path.join(TMP_PATH, version));
    }

    /**
     * 执行解压操作
     */
    private async tarZxvfUnzip(version: string, tarPath: string): Promise<void> {
        return new Promise(tarFinish => {
            const versionPath = path.join(TMP_PATH, version);

            const handleError = (err: Error) => logger.appendLine(`${err.message}`);

            new compressing.tgz.UncompressStream({ source: tarPath })
                .on("error", handleError)
                .on("finish", () => {
                    logger.appendLine(`Uncompress ${version} success !`);
                    tarFinish();
                })
                .on("entry", (header: compressing.streamHeader, stream: any, next: () => void) => {
                    stream.on("end", next);

                    const pathParse = path.parse(header.name);

                    /**
                     * 弱水三千只取一瓢
                     * 人话就是，只需要 components 目录
                     */
                    if (!pathParse.dir.includes("components")) {
                        stream.resume();
                        return;
                    }

                    if (header.type === "file") {
                        stream.pipe(fs.createWriteStream(path.join(versionPath, header.name)));
                    } else {
                        mkdirp(path.join(versionPath, header.name))
                            .then()
                            .catch((err: Error) => {
                                if (err) return handleError(err);
                            })
                            .finally(() => {
                                stream.resume();
                            });
                    }
                });
        });
    }

    public async acquireTarForZorro(version: string): Promise<boolean> {
        return new Promise(resolveInner => {
            const tmpTarFetchDir = path.join(TMP_PATH, "zorro.tar.gz");

            if (this.isExistsLibForVersion(version)) {
                logger.appendLine(`${version} exist!`);
                resolveInner(false)
                return;
            }

            const doStream = fse.createWriteStream(tmpTarFetchDir);
            const url = this.getZorroUrl(version);
            const upshot = request.get(url);

            upshot.pause();
            upshot.on("response", (resp: request.Response) => {
                if (resp.statusCode !== 200) {
                    logger.appendLine(`${url} error`);
                    upshot.destroy();
                    fs.unlinkSync(tmpTarFetchDir);
                    resolveInner(false);
                    return;
                }
                upshot.pipe(doStream);
                upshot.resume();
            });

            doStream.addListener("finish", async () => {
                logger.appendLine(`Download doc for ${url} success !`);
                logger.appendLine(`Waiting uncompress zorro !`);
                await this.tarZxvfUnzip(version, tmpTarFetchDir);
                fs.unlinkSync(tmpTarFetchDir);
                resolveInner(true);
            });
        });
    }
}
