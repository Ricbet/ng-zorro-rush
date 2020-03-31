import * as vscode from "vscode";
import * as fs from "fs";
import { Resource } from "./resource";

export class ExtensionCli {

    private resource: Resource = new Resource();

    constructor() { }

    public async runtime(): Promise<void> {
        const alls = await this.resource.getAllZorroVersions();
        console.log(alls, "alls")
        alls.forEach(e => {
            this.resource.gitCloneForVersion(e);
        })
    }

}