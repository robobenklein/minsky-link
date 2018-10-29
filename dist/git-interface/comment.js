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
    constructor(c_body, org, repo, id = 0, url = "", html_url = "", user = new user_1.User(), created_at = "", updated_at = "", c_path = "", c_dposition = NaN) {
        super(c_body, org, repo, id, url, html_url, user, created_at, updated_at);
        this.path = c_path;
        this.diff_position = c_dposition;
    }
}
exports.GitPRComment = GitPRComment;
class GitReplyComment extends GitPRComment {
    constructor(c_body, org, repo, id = 0, url = "", html_url = "", user = new user_1.User(), created_at = "", updated_at = "", c_path = "", c_dposition = NaN, c_irt = NaN) {
        super(c_body, org, repo, id, url, html_url, user, created_at, updated_at, c_path, c_dposition);
        this.in_reply_to_id = c_irt;
    }
}
exports.GitReplyComment = GitReplyComment;
class GitReviewComment extends GitReplyComment {
    constructor(c_revid, c_body, org, repo, id = 0, url = "", html_url = "", user = new user_1.User(), created_at = "", updated_at = "", c_path = "", c_dposition = NaN, c_irt = NaN, diff_hunk = "", position = 0, original_position = 0, original_commit_id = "") {
        super(c_body, org, repo, id, url, html_url, user, created_at, updated_at, c_path, c_dposition, c_irt);
        this.review_id = c_revid;
        this.diff_hunk = diff_hunk;
        this.position = position;
        this.original_position = original_position;
        this.original_commit_id = original_commit_id;
    }
}
exports.GitReviewComment = GitReviewComment;
//# sourceMappingURL=comment.js.map