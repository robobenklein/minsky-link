"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
class GitComment {
    constructor(c_body, org, repo, id = 0, url = "", html_url = "", user = new user_1.User(), created_at = "", updated_at = "") {
        this.id = id;
        this.org = org;
        this.repo = repo;
        this.body = c_body;
        this.user = user;
        this.url = url;
        this.html_url = html_url;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
exports.GitComment = GitComment;
class GitPRComment extends GitComment {
    constructor(c_body, org, repo, id = 0, url = "", html_url = "", user = new user_1.User(), created_at = "", updated_at = "", review_id = 0, diff_hunk = "", path = "", diff_position = 0, original_position = 0, commit_id = "", original_commit_id = "", in_reply_to_id = 0, pull_request_url = "") {
        super(c_body, org, repo, id, url, html_url, user, created_at, updated_at);
        this.review_id = review_id;
        this.diff_hunk = diff_hunk;
        this.path = path;
        this.position = diff_position;
        this.original_position = original_position;
        this.commit_id = commit_id;
        this.original_commit_id = original_commit_id;
        this.in_reply_to_id = in_reply_to_id;
        this.pull_request_url = pull_request_url;
    }
}
exports.GitPRComment = GitPRComment;
//# sourceMappingURL=comment.js.map