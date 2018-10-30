import { getGitHubIssue } from "./github_issue";

export function test_getComment(): void {
  const org = "utk-cs";
  const repo = "team-minsky";
  const result = getGitHubIssue(org, repo, 51);
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
