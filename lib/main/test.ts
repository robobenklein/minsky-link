import { GitHubOauth } from "../github/oauth";
import { getGitHubIssue } from "../github/github_issue";
import * as os from "os";
import * as fs from "fs";

export function test_oauth(): void {
  const opts = { baseUrl: "https://api.github.com" };
  var oauth = new GitHubOauth(opts);
  const prom = oauth.request_authorization();
  prom.then(res => {
    if (res === true) {
      oauth.print_token();
      const fpath = os.homedir() + "/.minsky_github_oauth_token.json";
      console.log("Output file exists?:", fs.existsSync(fpath));
      //oauth.authenticate();
      const ghprom = getGitHubIssue("utk-cs", "team-minsky", 56);
      ghprom.then(gh => {
        gh.setOauth(oauth);
        const gcomm = gh.createComment("Hello World! I am a comment");
        gcomm.then(comment => {
          console.log(
            "Produced comment " + comment.body + "\n  URL = " + comment.url
          );
        });
        gcomm.catch(err => {
          throw err;
        });
      });
      ghprom.catch(err => {
        throw err;
      });
      //oauth.validate();
    } else {
      console.log("Promise resolved to false");
    }
  });
}
