"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const github_issue_1 = require("./github_issue");
function test_getComment() {
    const org = "utk-cs";
    const repo = "team-minsky";
    const result = github_issue_1.getGitHubIssue(org, repo, 51);
    //const result = issue.getAllComments("2018-10-11T00:00:00Z");
    //const result = issue.getComment(429101082);
    result.then(res => {
        const comresult = res.getAllComments();
        comresult.then(cres => {
            for (const comment of cres) {
                console.log(comment.body);
            }
        });
    });
}
exports.test_getComment = test_getComment;
//# sourceMappingURL=test.js.map