"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_1 = require("../github/oauth");
const github_issue_1 = require("../github/github_issue");
const os = require("os");
const fs = require("fs");
function test_oauth() {
    const opts = { baseUrl: "https://api.github.com" };
    var oauth = new oauth_1.GitHubOauth(opts);
    const prom = oauth.request_authorization();
    prom.then(res => {
        if (res === true) {
            oauth.print_token();
            const fpath = os.homedir() + "/.minsky_github_oauth_token.json";
            console.log("Output file exists?:", fs.existsSync(fpath));
            //oauth.authenticate();
            const ghprom = github_issue_1.getGitHubIssue("utk-cs", "team-minsky", 56);
            ghprom.then(gh => {
                gh.setOauth(oauth);
                const gcomm = gh.createComment("Hello World! I am a comment");
                gcomm.then(comment => {
                    console.log("Produced comment " + comment.body + "\n  URL = " + comment.url);
                });
                gcomm.catch(err => {
                    throw err;
                });
            });
            ghprom.catch(err => {
                throw err;
            });
            //oauth.validate();
        }
        else {
            console.log("Promise resolved to false");
        }
    });
}
exports.test_oauth = test_oauth;
//# sourceMappingURL=test.js.map