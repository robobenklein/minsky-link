import { GitHubIssue } from "./github_issue"

export function test_getComment(): void
{
    const org = "utk-cs";
    const repo = "team-minsky";
    const id = 51;
    const issue = new GitHubIssue(org, repo, id);
    const result = issue.getComment(369276120);
    result.then((resolve) => {
        console.log("Comment ID (Should be 369276120): ", resolve.id);
        console.log("Comment URL: ", resolve.url);
        console.log("Comment HTML URL: ", resolve.html_url);
        console.log("Comment Body: ", resolve.body);
        console.log("Comment Created At: ", resolve.created_at);
        console.log("Comment Updated At: ", resolve.updated_at);
    });
    result.catch((err) => {console.log("Error was raised:", err.message)});
}
