import { GitHubOauth } from "../github/oauth"
import * as os from "os";
import * as fs from "fs";

export function test_oauth(): void
{
    const opts = { baseUrl: "https://api.github.com" }
    var oauth = new GitHubOauth(opts);
    const prom = oauth.request_authorization();
    prom.then((res) => {
        if (res === true)
        {
            oauth.print_token();
            const fpath = os.homedir() + "/.minsky_github_oauth_token.json";
            console.log("Output file exists?:", fs.existsSync(fpath));
            oauth.validate();
        }
        else
        {
            console.log("Promise resolved to false")
        }
    })
}
