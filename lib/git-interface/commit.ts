import { User } from "./user";
import * as gh from "@octokit/rest";

export interface Commit_Person
{
    name: string;
    email: string;
    date: string;
}

type Internal_User = {
    name: string;
    email: string;
    date: string;
};

type Internal_Tree = {
    url: string;
    sha: string;
};

type Internal_Varification = {
    verified: boolean;
    reason: string;
    // The returned data also contains two extra fields: signature and payload.
    // However, both of these are guaranteed to be null when returned from the
    // REST API, so they're not included.
};

type Internal_Commit = {
    url: string;
    author: Internal_User;
    committer: Internal_User;
    message: string;
    tree: Internal_Tree;
    comment_count: number;
    verification: Internal_Varification;
};

// Basic class for storing the Parent field of the return type for getCommits (Pull Requests).
// It is used instead of casting because "as" casting between two objects is generally 
// considered harmful.
export class CommitParent
{
    public url: string;
    public sha: string;

    constructor(ghparents: gh.PullRequestsGetCommitsResponseItemParentsItem)
    {
        this.url = ghparents.url;
        this.sha = ghparents.sha;
    }
}

export class Commit
{
    public url: string;
    public sha: string;
    public html_url: string;
    public comments_url: string;
    public commit: Internal_Commit;
    public author: User;
    public committer: User;
    public parents: Array<CommitParent>;

    constructor(url="", sha="", html_url="", comments_url="", commit_url="", commit_author_name="",
                commit_author_email="", commit_author_date="", commit_committer_name="", 
                commit_committer_email="", commit_committer_date="", commit_message="",
                commit_tree_url="", commit_tree_sha="", commit_comment_count=0, 
                commit_verified=false, commit_verification_reason="", author=new User(),
                committer=new User(), parents=new Array<CommitParent>())
    {
        this.url = url;
        this.sha = sha;
        this.html_url = html_url;
        this.comments_url = comments_url;
        this.author = author;
        this.committer = committer;
        this.parents = parents;
        var cauthor: Internal_User = {
            name: commit_author_name,
            email: commit_author_email,
            date: commit_author_date
        };
        var ccommitter: Internal_User = {
            name: commit_committer_name,
            email: commit_committer_email,
            date: commit_committer_date
        };
        var ctree: Internal_Tree = {
            url: commit_tree_url,
            sha: commit_tree_sha
        };
        var cver: Internal_Varification = {
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
