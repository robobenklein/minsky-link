"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GitFile {
    constructor(sha = "", filename = "", filestatus = "", num_additions = 0, num_deletions = 0, num_changes = 0, blob_url = "", raw_url = "", contents_url = "", patch = "") {
        this.sha = sha;
        this.filename = filename;
        this.filestatus = filestatus;
        this.num_additions = num_additions;
        this.num_deletions = num_deletions;
        this.num_changes = num_changes;
        this.blob_url = blob_url;
        this.raw_url = raw_url;
        this.contents_url = contents_url;
        this.patch = patch;
    }
}
exports.GitFile = GitFile;
//# sourceMappingURL=file.js.map