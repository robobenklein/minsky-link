import { createGitHubIssue } from "./github_issue";

export function test_getComment(): void {
  const org = "utk-cs";
  const repo = "team-minsky";
  const result = createGitHubIssue(
    org,
    repo,
    "Test Issue 2",
    "This is another test issue created by my code.",
    14,
    ["testing", "typescript"],
    ["ilumsden", "robobenklein"]
  );
  //const result = issue.getAllComments("2018-10-11T00:00:00Z");
  //const result = issue.getComment(429101082);
  result.then(res => {
    console.log("Org: ", res.org);
    console.log("Repo: ", res.repo);
    console.log("ID: ", res.id);
    console.log("URL: ", res.url);
    console.log("Repo URL: ", res.repository_url);
    console.log("Labels URL: ", res.labels_url);
    console.log("Comments URL: ", res.comments_url);
    console.log("Events URL: ", res.events_url);
    console.log("HTML URL: ", res.html_url);
    console.log("Number: ", res.inumber);
    console.log("State: ", res.state);
    console.log("Title: ", res.title);
    console.log("Body: ", res.body);
    console.log("User:");
    if (res.user != undefined) {
      console.log("  - Login: ", res.user.login);
      console.log("  - ID: ", res.user.id);
      console.log("  - Avatar URL: ", res.user.avatar_url);
      console.log("  - Gravatar ID: ", res.user.gravatar_id);
      console.log("  - URL: ", res.user.url);
      console.log("  - HTML URL: ", res.user.html_url);
      console.log("  - Events URL: ", res.user.events_url);
      console.log("  - Receive Events URL: ", res.user.received_events_url);
      console.log("  - Type: ", res.user.utype);
      console.log("  - Site Admin?: ", res.user.site_admin);
    }
    console.log("Labels:");
    for (const lab of res.labels) {
      console.log("  * Label Name: ", lab.name);
      console.log("    - ID: ", lab.id);
      console.log("    - URL: ", lab.url);
      console.log("    - Color: ", lab.color);
      console.log("    - Description: ", lab.description);
      console.log("    - Default: ", lab.ldefault);
    }
    console.log("Assingees:");
    for (const ass of res.assignees) {
      console.log("  * Assignee Login: ", ass.login);
      console.log("    - ID: ", ass.id);
      console.log("    - Avatar URL: ", ass.avatar_url);
      console.log("    - Gravatar ID: ", ass.gravatar_id);
      console.log("    - URL: ", ass.url);
      console.log("    - HTML URL: ", ass.html_url);
      console.log("    - Events URL: ", ass.events_url);
      console.log("    - Receive Events URL: ", ass.received_events_url);
      console.log("    - Type: ", ass.utype);
      console.log("    - Site Admin?: ", ass.site_admin);
    }
    console.log("Milestone:");
    console.log("  - URL: ", res.milestone.url);
    console.log("  - HTML URL: ", res.milestone.html_url);
    console.log("  - Labels URL: ", res.milestone.labels_url);
    console.log("  - ID: ", res.milestone.id);
    console.log("  - Number: ", res.milestone.mnumber);
    console.log("  - Title: ", res.milestone.mtitle);
    console.log("  - State: ", res.milestone.state);
    console.log("  - Description: ", res.milestone.description);
    console.log("  - # Open Issues: ", res.milestone.open_issues);
    console.log("  - # Closed Issues: ", res.milestone.closed_issues);
    console.log("  - Created At: ", res.milestone.created_at);
    console.log("  - Closed At: ", res.milestone.closed_at);
    console.log("  - Due On: ", res.milestone.due_on);
    console.log("Locked: ", res.locked);
    console.log("Lock Reason: ", res.active_lock_reason);
    console.log("# Comments: ", res.num_comments);
    console.log("Corresponding PR:");
    console.log("  - URL: ", res.corresponding_pr.url);
    console.log("  - HTML URL: ", res.corresponding_pr.html_url);
    console.log("  - Diff URL: ", res.corresponding_pr.diff_url);
    console.log("  - Patch URL: ", res.corresponding_pr.patch_url);
    console.log("Created At: ", res.created_at);
    console.log("Closed At: ", res.closed_at);
    console.log("Updated At: ", res.updated_at);
    console.log("Closed By:");
    console.log("  - Login: ", res.closed_by.login);
    console.log("  - ID: ", res.closed_by.id);
    console.log("  - Avatar URL: ", res.closed_by.avatar_url);
    console.log("  - Gravatar ID: ", res.closed_by.gravatar_id);
    console.log("  - URL: ", res.closed_by.url);
    console.log("  - HTML URL: ", res.closed_by.html_url);
    console.log("  - Events URL: ", res.closed_by.events_url);
    console.log("  - Receive Events URL: ", res.closed_by.received_events_url);
    console.log("  - Type: ", res.closed_by.utype);
    console.log("  - Site Admin?: ", res.closed_by.site_admin);
  });
  result.catch(err => {
    console.log("Error was raised:", err.message);
  });
}
