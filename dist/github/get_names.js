"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("atom");
function getRepoNames() {
    const editor = atom.workspace.getActivePaneItem();
    if (editor == undefined) {
        return ["", ""];
    }
    const file = editor.buffer.file;
    if (file == undefined) {
        return ["", ""];
    }
    const fname = file.path;
    const repos = atom.project.getRepositories();
    var currrepo;
    for (const repo of repos) {
        if (repo.getReferences(fname) != undefined) {
            currrepo = repo;
            break;
        }
    }
    const url = currrepo.getOriginURL();
    const ind = url.indexOf(":");
    const slash = url.indexOf("/", ind);
    const dotgit = url.indexOf(".git", slash);
    const org = url.substring(ind + 1, slash);
    const repo = url.substring(slash + 1, dotgit);
    return [org, repo];
}
exports.getRepoNames = getRepoNames;
//# sourceMappingURL=get_names.js.map