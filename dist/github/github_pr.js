"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const issue_1 = require("../git-interface/issue");
const user_1 = require("../git-interface/user");
const label_1 = require("../git-interface/label");
const milestone_1 = require("../git-interface/milestone");
const comment_1 = require("../git-interface/comment");
const review_1 = require("../git-interface/review");
const github_issue_1 = require("./github_issue");
const commit_1 = require("../git-interface/commit");
const file_1 = require("../git-interface/file");
const Github = require("@octokit/rest");
class GitHubPR extends github_issue_1.GitHubIssue {
    constructor(org, repo, prnumber, head, base, title = "", url = "", repository_url = "", labels_url = "", comments_url = "", events_url = "", html_url = "", id = 0, state = issue_1.IssueState.Open, body = "", user = new user_1.User(), labels = new Array(), assignees = new Array(), milestone = new milestone_1.Milestone(), locked = false, active_lock_reason = "", created_at = "", closed_at = "", updated_at = "", closed_by = new user_1.User(), diff_url = "", patch_url = "", issue_url = "", commits_url = "", review_comments_url = "", review_comment_url = "", statuses_url = "", merged_at = "", merge_commit_sha = "", merged = false, mergable = false, merged_by = new user_1.User(), num_comments = 0, num_commits = 0, num_additions = 0, num_deletions = 0, num_changed_files = 0, maintainer_can_modify = false) {
        super(org, repo, prnumber, title, url, repository_url, labels_url, comments_url, events_url, html_url, id, state, body, user, labels, assignees, milestone, locked, active_lock_reason, num_comments, new issue_1.PRCorrespondingWithIssue(), created_at, closed_at, updated_at, closed_by);
        this.diff_url = diff_url;
        this.patch_url = patch_url;
        this.issue_url = issue_url;
        this.commits_url = commits_url;
        this.review_comments_url = review_comments_url;
        this.review_comment_url = review_comment_url;
        this.statuses_url = statuses_url;
        this.merged_at = merged_at;
        this.head = head;
        this.base = base;
        this.merge_commit_sha = merge_commit_sha;
        this.merged = merged;
        this.mergable = mergable;
        this.merged_by = merged_by;
        this.num_comments = num_comments;
        this.num_commits = num_commits;
        this.num_additions = num_additions;
        this.num_deletions = num_deletions;
        this.num_changed_files = num_changed_files;
        this.maintainer_can_modify = maintainer_can_modify;
    }
    async checkMerged() {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.checkMerged({
            owner: this.org,
            repo: this.repo,
            number: this.inumber
        });
        return new Promise(resolve => resolve(result.status == 204));
    }
    async createReviewComment(body, commit_id, path, diff_position) {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.createComment({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            body,
            commit_id,
            path,
            position: diff_position
        });
        return new Promise((resolve, reject) => {
            if (result.status == 201) {
                const data = result.data;
                const us = new user_1.User(data.user.login, data.user.id, data.user.avatar_url, data.user.gravatar_id, data.user.url, data.user.html_url, data.user.events_url, data.user.received_events_url, data.user.type, data.user.site_admin);
                const com = new comment_1.GitPRComment(data.body, this.org, this.repo, data.id, data.url, data.html_url, us, data.created_at, data.updated_at, data.pull_request_review_id, data.diff_hunk, data.path, data.position, data.original_position, data.commit_id, data.original_commit_id, data.in_reply_to_id, data.pull_request_url);
                resolve(com);
            }
            else {
                reject(new Error("HTML Request Failed."));
            }
        });
    }
    async createReviewCommentReply(body, in_reply_to) {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.createCommentReply({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            body,
            in_reply_to
        });
        return new Promise((resolve, reject) => {
            if (result.status == 201) {
                const data = result.data;
                const us = new user_1.User(data.user.login, data.user.id, data.user.avatar_url, data.user.gravatar_id, data.user.url, data.user.html_url, data.user.events_url, data.user.received_events_url, data.user.type, data.user.site_admin);
                const com = new comment_1.GitPRComment(data.body, this.org, this.repo, data.id, data.url, data.html_url, us, data.created_at, data.updated_at, data.pull_request_review_id, data.diff_hunk, data.path, data.position, data.original_position, data.commit_id, data.original_commit_id, data.in_reply_to_id, data.pull_request_url);
                resolve(com);
            }
            else {
                reject(new Error("HTML Request Failed."));
            }
        });
    }
    // More parameters need to be added
    async createReview(commit_id, body, rev_event, comments) {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.createReview({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            commit_id,
            body,
            event: rev_event,
            comments
        });
        return new Promise((resolve, reject) => {
            if (result.status == 200) {
                const data = result.data;
                const us = new user_1.User(data.user.login, data.user.id, data.user.avatar_url, data.user.gravatar_id, data.user.url, data.user.html_url, data.user.events_url, data.user.received_events_url, data.user.type, data.user.site_admin);
                const state = data.state == "APPROVED"
                    ? review_1.Pr_State.Appr
                    : data.state == "PENDING"
                        ? review_1.Pr_State.Pend
                        : data.state == "CHANGES_REQUESTED"
                            ? review_1.Pr_State.Change
                            : review_1.Pr_State.Dismiss;
                const rev = new review_1.Review(data.id, us, data.body, data.commit_id, data._links.html.href, data._links.pull_request.href, this.org, this.repo, state);
                resolve(rev);
            }
            else {
                reject(new Error("HTML Request Failed."));
            }
        });
    }
    async createReviewRequest(reviewers, team_reviewers) {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.createReviewRequest({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            reviewers,
            team_reviewers
        });
        const data = result.data;
        if (result.status == 201) {
            this.id = data.id;
            this.url = data.url;
            this.html_url = data.html_url;
            this.diff_url = data.diff_url;
            this.patch_url = data.patch_url;
            this.issue_url = data.issue_url;
            this.commits_url = data.commits_url;
            this.review_comments_url = data.review_comments_url;
            this.review_comment_url = data.review_comment_url;
            this.comments_url = data.comments_url;
            this.statuses_url = data.statuses_url;
            this.inumber = data.number;
            this.state =
                data.state == "open"
                    ? issue_1.IssueState.Open
                    : data.state == "closed"
                        ? issue_1.IssueState.Closed
                        : issue_1.IssueState.All;
            this.title = data.title;
            this.body = data.body;
            // Empties the labels array
            this.labels.splice(0, this.labels.length);
            for (const labdat of data.labels) {
                const lab = new label_1.Label(labdat.id, labdat.url, labdat.name, labdat.color, this.org, this.repo, labdat.description, labdat.default);
                this.labels.push(lab);
            }
            const mstate = data.milestone.state == "open" ? milestone_1.M_State.Open : milestone_1.M_State.Closed;
            const mcreator = new user_1.User(data.milestone.creator.login, data.milestone.creator.id, data.milestone.creator.avatar_url, data.milestone.creator.gravatar_id, data.milestone.creator.url, data.milestone.creator.html_url, data.milestone.creator.events_url, data.milestone.creator.received_events_url, data.milestone.creator.type, data.milestone.creator.site_admin);
            this.milestone = new milestone_1.Milestone(this.org, this.repo, data.milestone.url, data.milestone.html_url, data.milestone.labels_url, data.milestone.id, data.milestone.number, data.milestone.title, mstate, data.milestone.description, mcreator, data.milestone.open_issues, data.milestone.closed_issues, data.milestone.created_at, data.milestone.closed_at, data.milestone.due_on);
            this.locked = data.locked;
            this.active_lock_reason = data.active_lock_reason;
            this.created_at = data.created_at;
            this.closed_at = data.closed_at;
            this.updated_at = data.updated_at;
            this.merged_at = data.merged_at;
            const headUser = new user_1.User(data.head.user.login, data.head.user.id, data.head.user.avatar_url, data.head.user.gravatar_id, data.head.user.url, data.head.user.html_url, data.head.user.events_url, data.head.user.received_events_url, data.head.user.type, data.head.user.site_admin);
            this.head = {
                label: data.head.label,
                ref: data.head.ref,
                sha: data.head.sha,
                user: headUser,
                repo: data.head.repo.name,
                repo_url: data.head.repo.html_url
            };
            const baseUser = new user_1.User(data.base.user.login, data.base.user.id, data.base.user.avatar_url, data.base.user.gravatar_id, data.base.user.url, data.base.user.html_url, data.base.user.events_url, data.base.user.received_events_url, data.base.user.type, data.base.user.site_admin);
            this.base = {
                label: data.base.label,
                ref: data.base.ref,
                sha: data.base.sha,
                user: baseUser,
                repo: data.base.repo.name,
                repo_url: data.base.repo.html_url
            };
        }
        return new Promise((resolve, reject) => {
            if (result.status == 201) {
                var reviewers = new Array();
                for (const req of data.requested_reviewers) {
                    const rev = new user_1.User(req.login, req.id, req.avatar_url, req.gravatar_id, req.url, req.html_url, req.events_url, req.received_events_url, req.type, req.site_admin);
                    reviewers.push(rev);
                }
                var teams = new Array();
                for (const ret of data.requested_teams) {
                    const tea = new user_1.Team(ret.id, ret.url, ret.name, ret.slug, ret.description, ret.privacy, ret.permission, ret.members_url, ret.repositories_url);
                    teams.push(tea);
                }
                resolve([reviewers, teams]);
            }
            else {
                reject(new Error("HTML Request Failed."));
            }
        });
    }
    async getReview(review_id) {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.getReview({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            review_id
        });
        return new Promise((resolve, reject) => {
            if (result.status == 200) {
                const data = result.data;
                const us = new user_1.User(data.user.login, data.user.id, data.user.avatar_url, data.user.gravatar_id, data.user.url, data.user.html_url, data.user.events_url, data.user.received_events_url, data.user.type, data.user.site_admin);
                const rstate = data.state == "APPROVED"
                    ? review_1.Pr_State.Appr
                    : data.state == "PENDING"
                        ? review_1.Pr_State.Pend
                        : data.state == "CHANGES_REQUESTED"
                            ? review_1.Pr_State.Change
                            : review_1.Pr_State.Dismiss;
                const rev = new review_1.Review(data.id, us, data.body, data.commit_id, data.html_url, data.pull_request_url, this.org, this.repo, rstate);
                resolve(rev);
            }
            else {
                reject(new Error("HTML Request Failed."));
            }
        });
    }
    async getReviewComments(review_id, per_page = 30, page = 1) {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.getReviewComments({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            review_id,
            per_page,
            page
        });
        return new Promise((resolve, reject) => {
            if (result.status == 200) {
                var comments = new Array();
                for (const com of result.data) {
                    const us = new user_1.User(com.user.login, com.user.id, com.user.avatar_url, com.user.gravatar_id, com.user.url, com.user.html_url, com.user.events_url, com.user.received_events_url, com.user.type, com.user.site_admin);
                    const prcom = new comment_1.GitPRComment(com.body, this.org, this.repo, com.id, com.url, com.html_url, us, com.created_at, com.updated_at, com.pull_request_review_id, com.diff_hunk, com.path, com.position, com.original_position, com.commit_id, com.original_commit_id, com.in_reply_to_id, com.pull_request_url);
                    comments.push(prcom);
                }
                resolve(comments);
            }
            else {
                reject(new Error("HTML Request Failed."));
            }
        });
    }
    async getReviewRequests(per_page = 30, page = 1) {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.getReviewRequests({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            per_page,
            page
        });
        return new Promise((resolve, reject) => {
            if (result.status == 200) {
                const data = result.data;
                var reviewers = new Array();
                for (const req of data.users) {
                    const rev = new user_1.User(req.login, req.id, req.avatar_url, req.gravatar_id, req.url, req.html_url, req.events_url, req.received_events_url, req.type, req.site_admin);
                    reviewers.push(rev);
                }
                var teams = new Array();
                for (const ret of data.teams) {
                    const tea = new user_1.Team(ret.id, ret.url, ret.name, ret.slug, ret.description, ret.privacy, ret.permission, ret.members_url, ret.repositories_url);
                    teams.push(tea);
                }
                resolve([reviewers, teams]);
            }
            else {
                reject(new Error("HTML Request Failed."));
            }
        });
    }
    async getAllReviews(per_page = 30, page = 1) {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.getReviews({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            per_page,
            page
        });
        return new Promise((resolve, reject) => {
            if (result.status == 200) {
                var revs = Array();
                const data = result.data;
                for (const d of data) {
                    const us = new user_1.User(d.user.login, d.user.id, d.user.avatar_url, d.user.gravatar_id, d.user.url, d.user.html_url, d.user.events_url, d.user.received_events_url, d.user.type, d.user.site_admin);
                    const rstate = d.state == "APPROVED"
                        ? review_1.Pr_State.Appr
                        : d.state == "PENDING"
                            ? review_1.Pr_State.Pend
                            : d.state == "CHANGES_REQUESTED"
                                ? review_1.Pr_State.Change
                                : review_1.Pr_State.Dismiss;
                    const rev = new review_1.Review(d.id, us, d.body, d.commit_id, d.html_url, d.pull_request_url, this.org, this.repo, rstate);
                    revs.push(rev);
                }
                resolve(revs);
            }
            else {
                reject(new Error("HTML Request Failed."));
            }
        });
    }
    async submitReview(review_id, rev_event, body) {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.submitReview({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            review_id,
            body,
            event: rev_event
        });
        return new Promise((resolve, reject) => {
            if (result.status == 200) {
                const data = result.data;
                const us = new user_1.User(data.user.login, data.user.id, data.user.avatar_url, data.user.gravatar_id, data.user.url, data.user.html_url, data.user.events_url, data.user.received_events_url, data.user.type, data.user.site_admin);
                const rstate = data.state == "APPROVED"
                    ? review_1.Pr_State.Appr
                    : data.state == "PENDING"
                        ? review_1.Pr_State.Pend
                        : data.state == "CHANGES_REQUESTED"
                            ? review_1.Pr_State.Change
                            : review_1.Pr_State.Dismiss;
                const rev = new review_1.Review(data.id, us, data.body, data.commit_id, data.html_url, data.pull_request_url, this.org, this.repo, rstate);
                resolve(rev);
            }
            else {
                reject(new Error("HTML Request Failed."));
            }
        });
    }
    async dismissReview(review_id, message) {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.dismissReview({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            review_id,
            message
        });
        return new Promise((resolve, reject) => {
            if (result.status == 200) {
                const data = result.data;
                const us = new user_1.User(data.user.login, data.user.id, data.user.avatar_url, data.user.gravatar_id, data.user.url, data.user.html_url, data.user.events_url, data.user.received_events_url, data.user.type, data.user.site_admin);
                const rstate = data.state == "APPROVED"
                    ? review_1.Pr_State.Appr
                    : data.state == "PENDING"
                        ? review_1.Pr_State.Pend
                        : data.state == "CHANGES_REQUESTED"
                            ? review_1.Pr_State.Change
                            : review_1.Pr_State.Dismiss;
                if (rstate != review_1.Pr_State.Dismiss) {
                    console.log("Odd data returned from GitHub API. dismissReview should produce a DISMISSED PR state.");
                }
                const rev = new review_1.Review(data.id, us, data.body, data.commit_id, data.html_url, data.pull_request_url, this.org, this.repo, rstate);
                resolve(rev);
            }
            else {
                reject(new Error("HTML Request Failed."));
            }
        });
    }
    async deletePendingRevew(review_id) {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.deletePendingReview({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            review_id
        });
        return new Promise((resolve, reject) => {
            if (result.status == 200) {
                const data = result.data;
                const us = new user_1.User(data.user.login, data.user.id, data.user.avatar_url, data.user.gravatar_id, data.user.url, data.user.html_url, data.user.events_url, data.user.received_events_url, data.user.type, data.user.site_admin);
                const rstate = data.state == "APPROVED"
                    ? review_1.Pr_State.Appr
                    : data.state == "PENDING"
                        ? review_1.Pr_State.Pend
                        : data.state == "CHANGES_REQUESTED"
                            ? review_1.Pr_State.Change
                            : review_1.Pr_State.Dismiss;
                if (rstate != review_1.Pr_State.Dismiss) {
                    console.log("Odd data returned from GitHub API. dismissReview should produce a DISMISSED PR state.");
                }
                const rev = new review_1.Review(data.id, us, data.body, data.commit_id, data.html_url, data.pull_request_url, this.org, this.repo, rstate);
                resolve(rev);
            }
            else {
                reject(new Error("HTML Request Failed."));
            }
        });
    }
    async deleteReviewRequest(reviewers, team_reviewers) {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.deleteReviewRequest({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            reviewers,
            team_reviewers
        });
        return new Promise(resolve => { resolve(result.status == 200); });
    }
    async getAllCommits(per_page = 30, page = 1) {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.getCommits({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            per_page,
            page
        });
        return new Promise((resolve, reject) => {
            if (result.status == 200) {
                const data = result.data;
                var commits = new Array();
                for (const com of data) {
                    var pars = new Array();
                    for (const p of com.parents) {
                        pars.push(new commit_1.CommitParent(p));
                    }
                    var author = new user_1.User(com.author.login, com.author.id, com.author.avatar_url, com.author.gravatar_id, com.author.url, com.author.html_url, com.author.events_url, com.author.received_events_url, com.author.type, com.author.site_admin);
                    var committer = new user_1.User(com.committer.login, com.committer.id, com.committer.avatar_url, com.committer.gravatar_id, com.committer.url, com.committer.html_url, com.committer.events_url, com.committer.received_events_url, com.committer.type, com.committer.site_admin);
                    commits.push(new commit_1.Commit(com.url, com.sha, com.html_url, com.comments_url, com.commit.url, com.commit.author.name, com.commit.author.email, com.commit.author.date, com.commit.committer.name, com.commit.committer.email, com.commit.committer.date, com.commit.message, com.commit.tree.url, com.commit.tree.sha, com.commit.comment_count, com.commit.verification.verified, com.commit.verification.reason, author, committer, pars));
                }
                resolve(commits);
            }
            else {
                reject(new Error("HTML Request Failed."));
            }
        });
    }
    async getAllFiles(per_page = 30, page = 1) {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.getFiles({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            per_page,
            page
        });
        return new Promise((resolve, reject) => {
            if (result.status == 200) {
                const data = result.data;
                var files = new Array();
                for (const f of data) {
                    files.push(new file_1.GitFile(f.sha, f.filename, f.status, f.additions, f.deletions, f.changes, f.blob_url, f.raw_url, f.contents_url, f.patch));
                }
                resolve(files);
            }
            else {
                reject(new Error("HTML Request Failed."));
            }
        });
    }
    async merge(commit_title, commit_message, sha, merge_method) {
        var method;
        if (merge_method === undefined) {
            method = "merge";
        }
        else {
            method = merge_method;
        }
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.merge({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            commit_title,
            commit_message,
            sha,
            merge_method: method
        });
        return new Promise((resolve, reject) => {
            if (result.status == 200) {
                var data = {
                    sha: result.data.sha,
                    merged: result.data.merged,
                    message: result.data.message
                };
                resolve(data);
            }
            else {
                reject(new Error("HTML Request Failed."));
            }
        });
    }
    async update(title, body, state, base, maintainer_can_modify) {
        const gh = new Github(this.opts);
        const result = await gh.pullRequests.update({
            owner: this.org,
            repo: this.repo,
            number: this.inumber,
            title, body, state, base, maintainer_can_modify
        });
        return new Promise(resolve => {
            const data = result.data;
            this.id = data.id;
            this.url = data.url;
            this.html_url = data.html_url;
            this.diff_url = data.diff_url;
            this.patch_url = data.patch_url;
            this.issue_url = data.issue_url;
            this.commits_url = data.commits_url;
            this.review_comments_url = data.review_comments_url;
            this.review_comment_url = data.review_comment_url;
            this.comments_url = data.comments_url;
            this.statuses_url = data.statuses_url;
            this.inumber = data.number;
            this.state =
                data.state == "open"
                    ? issue_1.IssueState.Open
                    : data.state == "closed"
                        ? issue_1.IssueState.Closed
                        : issue_1.IssueState.All;
            this.title = data.title;
            this.body = data.body;
            // Empties the labels array
            this.labels.splice(0, this.labels.length);
            for (const labdat of data.labels) {
                const lab = new label_1.Label(labdat.id, labdat.url, labdat.name, labdat.color, this.org, this.repo, labdat.description, labdat.default);
                this.labels.push(lab);
            }
            const mstate = data.milestone.state == "open" ? milestone_1.M_State.Open : milestone_1.M_State.Closed;
            const mcreator = new user_1.User(data.milestone.creator.login, data.milestone.creator.id, data.milestone.creator.avatar_url, data.milestone.creator.gravatar_id, data.milestone.creator.url, data.milestone.creator.html_url, data.milestone.creator.events_url, data.milestone.creator.received_events_url, data.milestone.creator.type, data.milestone.creator.site_admin);
            this.milestone = new milestone_1.Milestone(this.org, this.repo, data.milestone.url, data.milestone.html_url, data.milestone.labels_url, data.milestone.id, data.milestone.number, data.milestone.title, mstate, data.milestone.description, mcreator, data.milestone.open_issues, data.milestone.closed_issues, data.milestone.created_at, data.milestone.closed_at, data.milestone.due_on);
            this.locked = data.locked;
            this.active_lock_reason = data.active_lock_reason;
            this.created_at = data.created_at;
            this.closed_at = data.closed_at;
            this.updated_at = data.updated_at;
            this.merged_at = data.merged_at;
            const headUser = new user_1.User(data.head.user.login, data.head.user.id, data.head.user.avatar_url, data.head.user.gravatar_id, data.head.user.url, data.head.user.html_url, data.head.user.events_url, data.head.user.received_events_url, data.head.user.type, data.head.user.site_admin);
            this.head = {
                label: data.head.label,
                ref: data.head.ref,
                sha: data.head.sha,
                user: headUser,
                repo: data.head.repo.name,
                repo_url: data.head.repo.html_url
            };
            const baseUser = new user_1.User(data.base.user.login, data.base.user.id, data.base.user.avatar_url, data.base.user.gravatar_id, data.base.user.url, data.base.user.html_url, data.base.user.events_url, data.base.user.received_events_url, data.base.user.type, data.base.user.site_admin);
            this.base = {
                label: data.base.label,
                ref: data.base.ref,
                sha: data.base.sha,
                user: baseUser,
                repo: data.base.repo.name,
                repo_url: data.base.repo.html_url
            };
            resolve(result.status == 200);
        });
    }
}
exports.GitHubPR = GitHubPR;
//# sourceMappingURL=github_pr.js.map