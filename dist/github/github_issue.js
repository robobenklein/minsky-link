"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const issue_1 = require("../git-interface/issue");
const comment_1 = require("../git-interface/comment");
const label_1 = require("../git-interface/label");
const milestone_1 = require("../git-interface/milestone");
const user_1 = require("../git-interface/user");
const Github = require("../../node_modules/@octokit/rest/index");
class GitHubIssue extends issue_1.Issue {
    constructor(id, title, url = "", repository_url = "", labels_url = "", comments_url = "", events_url = "", html_url = "", inumber = 0, state = issue_1.IssueState.Open, body = "", user = new user_1.User(), labels = new Array(), assignees = new Array(), milestone = new milestone_1.Milestone(), locked = false, active_lock_reason = "", num_comments = 0, corresponding_pr = new issue_1.PRCorrespondingWithIssue(), created_at = "", closed_at = "", updated_at = "") {
        super();
        this.id = id;
        this.title = title;
        this.url = url;
        this.repository_url = repository_url;
        this.labels_url = labels_url;
        this.comments_url = comments_url;
        this.events_url = events_url;
        this.html_url = html_url;
        this.inumber = inumber;
        this.state = state;
        this.body = body;
        this.user = user;
        this.labels = labels;
        this.assignees = assignees;
        this.milestone = milestone;
        this.locked = locked;
        this.active_lock_reason = active_lock_reason;
        this.num_comments = num_comments;
        (this.corresponding_pr = corresponding_pr), (this.created_at = created_at);
        this.closed_at = closed_at;
        this.updated_at = updated_at;
    }
    // All functions use async/await
    async addAssignees(assignees) {
        const gh = new Github(this.opts);
        const result = await gh.issues.addAssigneesToIssue({
            owner: this.org,
            repo: this.repo,
            number: this.id,
            assignees
        });
        return new Promise(resolve => resolve(result.status >= 200 && result.status < 205));
    }
    async getAvailableAssignees(per_page = 30, page = 1) {
        const gh = new Github(this.opts);
        const result = await gh.issues.getAssignees({
            owner: this.org,
            repo: this.repo,
            per_page,
            page
        });
        return new Promise((resolve, reject) => {
            if (result.status >= 200 && result.status < 205) {
                const data = result.data;
                const final_data = new Array();
                for (const us of data) {
                    const fus = new user_1.User(us.login, us.id, us.avatar_url, us.gravatar_id, us.url, us.html_url, us.events_url, us.received_events_url, us.type, us.site_admin);
                    final_data.push(fus);
                }
                resolve(final_data);
            }
            else {
                reject(new Error("HTML Request failed."));
            }
        });
    }
    async checkAssignability(assignee) {
        const gh = new Github(this.opts);
        const result = await gh.issues.checkAssignee({
            owner: this.org,
            repo: this.repo,
            assignee
        });
        return new Promise(resolve => {
            resolve(result.status === 204);
        });
    }
    async removeAssignees(assignees) {
        const gh = new Github(this.opts);
        const result = await gh.issues.removeAssigneesFromIssue({
            owner: this.org,
            repo: this.repo,
            number: this.id,
            assignees
        });
        return new Promise(resolve => {
            resolve(result.status === 200);
        });
    }
    async createComment(body) {
        const gh = new Github(this.opts);
        const result = await gh.issues.createComment({
            owner: this.org,
            repo: this.repo,
            number: this.id,
            body
        });
        return new Promise((resolve, reject) => {
            if (result.status >= 200 && result.status < 205) {
                const data = result.data;
                const us = new user_1.User(data.user.login, data.user.id, data.user.avatar_url, data.user.gravatar_id, data.user.url, data.user.html_url, data.user.events_url, data.user.received_events_url, data.user.type, data.user.site_admin);
                const comment = new comment_1.GitComment(data.body, this.org, this.repo, data.id, data.url, data.html_url, us, data.created_at, data.updated_at);
                resolve(comment);
            }
            else {
                reject(new Error("HTML Request Failed"));
            }
        });
    }
    async editComment(comment_id, body) {
        const gh = new Github(this.opts);
        const result = await gh.issues.editComment({
            owner: this.org,
            repo: this.repo,
            comment_id: comment_id.toString(),
            body
        });
        return new Promise((resolve, reject) => {
            if (result.status >= 200 && result.status < 205) {
                const data = result.data;
                const us = new user_1.User(data.user.login, data.user.id, data.user.avatar_url, data.user.gravatar_id, data.user.url, data.user.html_url, data.user.events_url, data.user.received_events_url, data.user.type, data.user.site_admin);
                const comment = new comment_1.GitComment(data.body, this.org, this.repo, data.id, data.url, data.html_url, us, data.created_at, data.updated_at);
                resolve(comment);
            }
            else {
                reject(new Error("HTML Request Failed"));
            }
        });
    }
    async getComment(comment_id, per_page = 30, page = 1) {
        const gh = new Github(this.opts);
        const result = await gh.issues.getComment({
            owner: this.org,
            repo: this.repo,
            comment_id: comment_id.toString(),
            per_page,
            page
        });
        return new Promise((resolve, reject) => {
            if (result.status >= 200 && result.status < 205) {
                const data = result.data;
                const us = new user_1.User(data.user.login, data.user.id, data.user.avatar_url, data.user.gravatar_id, data.user.url, data.user.html_url, data.user.events_url, data.user.received_events_url, data.user.type, data.user.site_admin);
                const comment = new comment_1.GitComment(data.body, this.org, this.repo, data.id, data.url, data.html_url, us, data.created_at, data.updated_at);
                resolve(comment);
            }
            else {
                reject(new Error("HTML Request Failed"));
            }
        });
    }
    async getAllComments(since, per_page = 30, page = 1) {
        const gh = new Github(this.opts);
        const result = await gh.issues.getComments({
            owner: this.org,
            repo: this.repo,
            number: this.id,
            since,
            per_page,
            page
        });
        return new Promise((resolve, reject) => {
            if (result.status >= 200 && result.status < 205) {
                const data = result.data;
                const comments = new Array();
                for (const resp of data) {
                    const us = new user_1.User(resp.user.login, resp.user.id, resp.user.avatar_url, resp.user.gravatar_id, resp.user.url, resp.user.html_url, resp.user.events_url, resp.user.received_events_url, resp.user.type, resp.user.site_admin);
                    const comment = new comment_1.GitComment(resp.body, this.org, this.repo, resp.id, resp.url, resp.html_url, us, resp.created_at, resp.updated_at);
                    comments.push(comment);
                }
                resolve(comments);
            }
            else {
                reject(new Error("HTML Request Failed"));
            }
        });
    }
    async deleteComment(comment_id) {
        const gh = new Github(this.opts);
        const result = await gh.issues.deleteComment({
            owner: this.org,
            repo: this.repo,
            comment_id: comment_id.toString()
        });
        return new Promise(resolve => {
            resolve(result.status === 204);
        });
    }
    async createLabel(name, color, description) {
        const gh = new Github(this.opts);
        const result = await gh.issues.createLabel({
            owner: this.org,
            repo: this.repo,
            name,
            color,
            description
        });
        return new Promise((resolve, reject) => {
            if (result.status >= 200 && result.status < 205) {
                const data = result.data;
                const lab = new label_1.Label(data.id, data.url, data.name, data.color, this.org, this.repo, data.description, data.default);
                resolve(lab);
            }
            else {
                reject(new Error("HTML Request Failed"));
            }
        });
    }
    async updateLabel(current_name, new_name, new_color, new_description) {
        const gh = new Github(this.opts);
        const result = await gh.issues.updateLabel({
            owner: this.org,
            repo: this.repo,
            current_name,
            name: new_name,
            color: new_color,
            description: new_description
        });
        return new Promise((resolve, reject) => {
            if (result.status >= 200 && result.status < 205) {
                const data = result.data;
                const lab = new label_1.Label(data.id, data.url, data.name, data.color, this.org, this.repo, data.description, data.default);
                resolve(lab);
            }
            else {
                reject(new Error("HTML Request Failed"));
            }
        });
    }
    async replaceAllLabels(labels) {
        const gh = new Github(this.opts);
        const result = await gh.issues.replaceAllLabels({
            owner: this.org,
            repo: this.repo,
            number: this.id,
            labels
        });
        return new Promise((resolve, reject) => {
            if (result.status >= 200 && result.status < 205) {
                const data = result.data;
                const labs = new Array();
                for (const l of data) {
                    const lab = new label_1.Label(l.id, l.url, l.name, l.color, this.org, this.repo, l.description, l.default);
                    labs.push(lab);
                }
                resolve(labs);
            }
            else {
                reject(new Error("HTML Request Failed"));
            }
        });
    }
    async removeLabel(name) {
        const gh = new Github(this.opts);
        const result = await gh.issues.removeLabel({
            owner: this.org,
            repo: this.repo,
            number: this.id,
            name
        });
        return new Promise(resolve => {
            resolve(result.status === 200);
        });
    }
    async removeAllLabels() {
        const gh = new Github(this.opts);
        const result = await gh.issues.removeAllLabels({
            owner: this.org,
            repo: this.repo,
            number: this.id
        });
        return new Promise(resolve => {
            resolve(result.status === 204);
        });
    }
    async getAllLabels(per_page = 30, page = 1) {
        const gh = new Github(this.opts);
        const result = await gh.issues.getLabels({
            owner: this.org,
            repo: this.repo,
            per_page,
            page
        });
        return new Promise((resolve, reject) => {
            if (result.status >= 200 && result.status < 205) {
                const data = result.data;
                const labs = new Array();
                for (const l of data) {
                    const lab = new label_1.Label(l.id, l.url, l.name, l.color, this.org, this.repo, l.description, l.default);
                    labs.push(lab);
                }
                resolve(labs);
            }
            else {
                reject(new Error("HTML Request Failed"));
            }
        });
    }
    async getLabel(name) {
        const gh = new Github(this.opts);
        const result = await gh.issues.getLabel({
            owner: this.org,
            repo: this.repo,
            name
        });
        return new Promise((resolve, reject) => {
            if (result.status >= 200 && result.status < 205) {
                const data = result.data;
                const lab = new label_1.Label(data.id, data.url, data.name, data.color, this.org, this.repo, data.description, data.default);
                resolve(lab);
            }
            else {
                reject(new Error("HTML Request Failed"));
            }
        });
    }
    async addLabels(labels) {
        const gh = new Github(this.opts);
        const result = await gh.issues.addLabels({
            owner: this.org,
            repo: this.repo,
            number: this.id,
            labels
        });
        return new Promise((resolve, reject) => {
            if (result.status >= 200 && result.status < 205) {
                const data = result.data;
                const labs = new Array();
                for (const l of data) {
                    const lab = new label_1.Label(l.id, l.url, l.name, l.color, this.org, this.repo, l.description, l.default);
                    labs.push(lab);
                }
                resolve(labs);
            }
            else {
                reject(new Error("HTML Request Failed"));
            }
        });
    }
    async deleteLabel(name) {
        const gh = new Github(this.opts);
        const result = await gh.issues.deleteLabel({
            owner: this.org,
            repo: this.repo,
            name
        });
        return new Promise(resolve => {
            resolve(result.status === 204);
        });
    }
    async createMilestone(title, description, due_on, state = milestone_1.M_State.Open) {
        const gh = new Github(this.opts);
        const result = await gh.issues.createMilestone({
            owner: this.org,
            repo: this.repo,
            title,
            state,
            description,
            due_on
        });
        return new Promise((resolve, reject) => {
            if (result.status === 201) {
                const data = result.data;
                const us = new user_1.User(data.creator.login, data.creator.id, data.creator.avatar_url, data.creator.gravatar_id, data.creator.url, data.creator.html_url, data.creator.events_url, data.creator.received_events_url, data.creator.type, data.creator.site_admin);
                const mstate = data.state === "open" ? milestone_1.M_State.Open : milestone_1.M_State.Closed;
                const mile = new milestone_1.Milestone(this.org, this.repo, data.url, data.html_url, data.labels_url, data.id, data.number, data.title, mstate, data.description, us, data.open_issues, data.closed_issues, data.created_at, data.closed_at, data.due_on);
                resolve(mile);
            }
            else {
                reject(new Error("HTML Request Failed"));
            }
        });
    }
    async updateMilestone(milestone_id, title, description, due_on, state = milestone_1.M_State.Open) {
        const gh = new Github(this.opts);
        const result = await gh.issues.updateMilestone({
            owner: this.org,
            repo: this.repo,
            number: milestone_id,
            title,
            state,
            description,
            due_on
        });
        return new Promise((resolve, reject) => {
            if (result.status === 200) {
                const data = result.data;
                const us = new user_1.User(data.creator.login, data.creator.id, data.creator.avatar_url, data.creator.gravatar_id, data.creator.url, data.creator.html_url, data.creator.events_url, data.creator.received_events_url, data.creator.type, data.creator.site_admin);
                const mstate = data.state === "open" ? milestone_1.M_State.Open : milestone_1.M_State.Closed;
                const mile = new milestone_1.Milestone(this.org, this.repo, data.url, data.html_url, data.labels_url, data.id, data.number, data.title, mstate, data.description, us, data.open_issues, data.closed_issues, data.created_at, data.closed_at, data.due_on);
                resolve(mile);
            }
            else {
                reject(new Error("HTML Request Failed"));
            }
        });
    }
    async getMilestone(milestone_id) {
        const gh = new Github(this.opts);
        const result = await gh.issues.getMilestone({
            owner: this.org,
            repo: this.repo,
            number: milestone_id
        });
        return new Promise((resolve, reject) => {
            if (result.status === 200) {
                const data = result.data;
                const us = new user_1.User(data.creator.login, data.creator.id, data.creator.avatar_url, data.creator.gravatar_id, data.creator.url, data.creator.html_url, data.creator.events_url, data.creator.received_events_url, data.creator.type, data.creator.site_admin);
                const mstate = data.state === "open" ? milestone_1.M_State.Open : milestone_1.M_State.Closed;
                const mile = new milestone_1.Milestone(this.org, this.repo, data.url, data.html_url, data.labels_url, data.id, data.number, data.title, mstate, data.description, us, data.open_issues, data.closed_issues, data.created_at, data.closed_at, data.due_on);
                resolve(mile);
            }
            else {
                reject(new Error("HTML Request Failed"));
            }
        });
    }
    async getMilestoneLabels(milestone_id, per_page = 30, page = 1) {
        const gh = new Github(this.opts);
        const result = await gh.issues.getMilestoneLabels({
            owner: this.org,
            repo: this.repo,
            number: milestone_id,
            per_page,
            page
        });
        return new Promise((resolve, reject) => {
            if (result.status === 200) {
                const data = result.data;
                const labs = new Array();
                for (const l of data) {
                    const lab = new label_1.Label(l.id, l.url, l.name, l.color, this.org, this.repo, l.description, l.default);
                    labs.push(lab);
                }
                resolve(labs);
            }
            else {
                reject(new Error("HTML Request Failed"));
            }
        });
    }
    async deleteMilestone(milestone_id) {
        const gh = new Github(this.opts);
        const result = await gh.issues.deleteMilestone({
            owner: this.org,
            repo: this.repo,
            number: milestone_id
        });
        return new Promise(resolve => {
            resolve(result.status === 204);
        });
    }
    async lock(lock_reason = issue_1.LockReason.Resolved) {
        const gh = new Github(this.opts);
        const result = await gh.issues.lock({
            owner: this.org,
            repo: this.repo,
            number: this.id,
            lock_reason
        });
        return new Promise(resolve => {
            resolve(result.status === 204);
        });
    }
    async unlock() {
        const gh = new Github(this.opts);
        const result = await gh.issues.unlock({
            owner: this.org,
            repo: this.repo,
            number: this.id
        });
        return new Promise(resolve => {
            resolve(result.status === 204);
        });
    }
}
exports.GitHubIssue = GitHubIssue;
//# sourceMappingURL=github_issue.js.map