"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const github_issue_1 = require("./github_issue");
function test_getComment() {
    const org = "utk-cs";
    const repo = "team-minsky";
    const id = 51;
    const issue = new github_issue_1.GitHubIssue(org, repo, id);
    const result = issue.getComment(369276120);
    result.then((resolve) => {
        console.log("Comment ID (Should be 369276120): ", resolve.id);
        console.log("Comment URL: ", resolve.url);
        console.log("Comment HTML URL: ", resolve.html_url);
        console.log("Comment Body: ", resolve.body);
        console.log("Comment Created At: ", resolve.created_at);
        console.log("Comment Updated At: ", resolve.updated_at);
    });
    result.catch((err) => { console.log("Error was raised:", err.message); });
}
exports.test_getComment = test_getComment;
//# sourceMappingURL=test.js.map