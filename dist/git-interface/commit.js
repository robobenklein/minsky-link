"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
// Basic class for storing the Parent field of the return type for getCommits (Pull Requests).
// It is used instead of casting because "as" casting between two objects is generally
// considered harmful.
class CommitParent {
    constructor(ghparents) {
        this.url = ghparents.url;
        this.sha = ghparents.sha;
    }
}
exports.CommitParent = CommitParent;
class Commit {
    constructor(url = "", sha = "", html_url = "", comments_url = "", commit_url = "", commit_author_name = "", commit_author_email = "", commit_author_date = "", commit_committer_name = "", commit_committer_email = "", commit_committer_date = "", commit_message = "", commit_tree_url = "", commit_tree_sha = "", commit_comment_count = 0, commit_verified = false, commit_verification_reason = "", author = new user_1.User(), committer = new user_1.User(), parents = new Array()) {
        this.url = url;
        this.sha = sha;
        this.html_url = html_url;
        this.comments_url = comments_url;
        this.author = author;
        this.committer = committer;
        this.parents = parents;
        var cauthor = {
            name: commit_author_name,
            email: commit_author_email,
            date: commit_author_date
        };
        var ccommitter = {
            name: commit_committer_name,
            email: commit_committer_email,
            date: commit_committer_date
        };
        var ctree = {
            url: commit_tree_url,
            sha: commit_tree_sha
        };
        var cver = {
            verified: commit_verified,
            reason: commit_verification_reason
        };
        this.commit = {
            url: commit_url,
            author: cauthor,
            committer: ccommitter,
            message: commit_message,
            tree: ctree,
            comment_count: commit_comment_count,
            verification: cver
        };
    }
}
exports.Commit = Commit;
//# sourceMappingURL=commit.js.map