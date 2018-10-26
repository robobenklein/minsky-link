//import {
//  PRCorrespondingWithIssue,
//  IssueState,
//  LockReason,
//  Issue
//} from "../git-interface/issue";
//import { GitComment } from "../git-interface/comment";
//import { Label } from "../git-interface/label";
//import { M_State, Milestone } from "../git-interface/milestone";
//import { User } from "../git-interface/user";

import { PRCorrespondingWithIssue, IssueState, LockReason, Issue, GitComment, Label, M_State, Milestone, User } from "minsky-link";

import * as Github from "../../node_modules/@octokit/rest/index";

export class GitHubIssue extends Issue {
  constructor(
    org: string,
    repo: string,
    id: number,
    title = "",
    url = "",
    repository_url = "",
    labels_url = "",
    comments_url = "",
    events_url = "",
    html_url = "",
    inumber = 0,
    state = IssueState.Open,
    body = "",
    user = new User(),
    labels = new Array<Label>(),
    assignees = new Array<User>(),
    milestone = new Milestone(),
    locked = false,
    active_lock_reason = "",
    num_comments = 0,
    corresponding_pr = new PRCorrespondingWithIssue(),
    created_at = "",
    closed_at = "",
    updated_at = ""
  ) {
    super();
    this.org = org;
    this.repo = repo;
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

  public async addAssignees(assignees: string[]): Promise<boolean> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.addAssigneesToIssue({
      owner: this.org,
      repo: this.repo,
      number: this.id,
      assignees
    });
    return new Promise<boolean>(resolve =>
      resolve(result.status >= 200 && result.status < 205)
    );
  }

  public async getAvailableAssignees(per_page = 30, page = 1): Promise<User[]> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.getAssignees({
      owner: this.org,
      repo: this.repo,
      per_page,
      page
    });
    return new Promise<User[]>((resolve, reject) => {
      if (result.status >= 200 && result.status < 205) {
        const data = result.data;
        const final_data = new Array<User>();
        for (const us of data) {
          const fus = new User(
            us.login,
            us.id,
            us.avatar_url,
            us.gravatar_id,
            us.url,
            us.html_url,
            us.events_url,
            us.received_events_url,
            us.type,
            us.site_admin
          );
          final_data.push(fus);
        }
        resolve(final_data);
      } else {
        reject(new Error("HTML Request failed."));
      }
    });
  }

  public async checkAssignability(assignee: string): Promise<boolean> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.checkAssignee({
      owner: this.org,
      repo: this.repo,
      assignee
    });
    return new Promise<boolean>(resolve => {
      resolve(result.status === 204);
    });
  }

  public async removeAssignees(assignees: string[]): Promise<boolean> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.removeAssigneesFromIssue({
      owner: this.org,
      repo: this.repo,
      number: this.id,
      assignees
    });
    return new Promise<boolean>(resolve => {
      resolve(result.status === 200);
    });
  }

  public async createComment(body: string): Promise<GitComment> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.createComment({
      owner: this.org,
      repo: this.repo,
      number: this.id,
      body
    });
    return new Promise<GitComment>((resolve, reject) => {
      if (result.status >= 200 && result.status < 205) {
        const data = result.data;
        const us: User = new User(
          data.user.login,
          data.user.id,
          data.user.avatar_url,
          data.user.gravatar_id,
          data.user.url,
          data.user.html_url,
          data.user.events_url,
          data.user.received_events_url,
          data.user.type,
          data.user.site_admin
        );
        const comment = new GitComment(
          data.body,
          this.org,
          this.repo,
          data.id,
          data.url,
          data.html_url,
          us,
          data.created_at,
          data.updated_at
        );
        resolve(comment);
      } else {
        reject(new Error("HTML Request Failed"));
      }
    });
  }

  public async editComment(
    comment_id: number,
    body: string
  ): Promise<GitComment> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.editComment({
      owner: this.org,
      repo: this.repo,
      comment_id: comment_id.toString(),
      body
    });
    return new Promise<GitComment>((resolve, reject) => {
      if (result.status >= 200 && result.status < 205) {
        const data = result.data;
        const us: User = new User(
          data.user.login,
          data.user.id,
          data.user.avatar_url,
          data.user.gravatar_id,
          data.user.url,
          data.user.html_url,
          data.user.events_url,
          data.user.received_events_url,
          data.user.type,
          data.user.site_admin
        );
        const comment = new GitComment(
          data.body,
          this.org,
          this.repo,
          data.id,
          data.url,
          data.html_url,
          us,
          data.created_at,
          data.updated_at
        );
        resolve(comment);
      } else {
        reject(new Error("HTML Request Failed"));
      }
    });
  }

  public async getComment(
    comment_id: number,
    per_page = 30,
    page = 1
  ): Promise<GitComment> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.getComment({
      owner: this.org,
      repo: this.repo,
      comment_id: comment_id.toString(),
      per_page,
      page
    });
    return new Promise<GitComment>((resolve, reject) => {
      if (result.status >= 200 && result.status < 205) {
        const data = result.data;
        const us: User = new User(
          data.user.login,
          data.user.id,
          data.user.avatar_url,
          data.user.gravatar_id,
          data.user.url,
          data.user.html_url,
          data.user.events_url,
          data.user.received_events_url,
          data.user.type,
          data.user.site_admin
        );
        const comment = new GitComment(
          data.body,
          this.org,
          this.repo,
          data.id,
          data.url,
          data.html_url,
          us,
          data.created_at,
          data.updated_at
        );
        resolve(comment);
      } else {
        reject(new Error("HTML Request Failed"));
      }
    });
  }

  public async getAllComments(
    since: string,
    per_page = 30,
    page = 1
  ): Promise<GitComment[]> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.getComments({
      owner: this.org,
      repo: this.repo,
      number: this.id,
      since,
      per_page,
      page
    });
    return new Promise<GitComment[]>((resolve, reject) => {
      if (result.status >= 200 && result.status < 205) {
        const data = result.data;
        const comments = new Array<GitComment>();
        for (const resp of data) {
          const us: User = new User(
            resp.user.login,
            resp.user.id,
            resp.user.avatar_url,
            resp.user.gravatar_id,
            resp.user.url,
            resp.user.html_url,
            resp.user.events_url,
            resp.user.received_events_url,
            resp.user.type,
            resp.user.site_admin
          );
          const comment = new GitComment(
            resp.body,
            this.org,
            this.repo,
            resp.id,
            resp.url,
            resp.html_url,
            us,
            resp.created_at,
            resp.updated_at
          );
          comments.push(comment);
        }
        resolve(comments);
      } else {
        reject(new Error("HTML Request Failed"));
      }
    });
  }

  public async deleteComment(comment_id: number): Promise<boolean> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.deleteComment({
      owner: this.org,
      repo: this.repo,
      comment_id: comment_id.toString()
    });
    return new Promise<boolean>(resolve => {
      resolve(result.status === 204);
    });
  }

  public async createLabel(
    name: string,
    color: string,
    description?: string
  ): Promise<Label> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.createLabel({
      owner: this.org,
      repo: this.repo,
      name,
      color,
      description
    });
    return new Promise<Label>((resolve, reject) => {
      if (result.status >= 200 && result.status < 205) {
        const data = result.data;
        const lab = new Label(
          data.id,
          data.url,
          data.name,
          data.color,
          this.org,
          this.repo,
          data.description,
          data.default
        );
        resolve(lab);
      } else {
        reject(new Error("HTML Request Failed"));
      }
    });
  }

  public async updateLabel(
    current_name: string,
    new_name?: string,
    new_color?: string,
    new_description?: string
  ): Promise<Label> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.updateLabel({
      owner: this.org,
      repo: this.repo,
      current_name,
      name: new_name,
      color: new_color,
      description: new_description
    });
    return new Promise<Label>((resolve, reject) => {
      if (result.status >= 200 && result.status < 205) {
        const data = result.data;
        const lab = new Label(
          data.id,
          data.url,
          data.name,
          data.color,
          this.org,
          this.repo,
          data.description,
          data.default
        );
        resolve(lab);
      } else {
        reject(new Error("HTML Request Failed"));
      }
    });
  }

  public async replaceAllLabels(labels: string[]): Promise<Label[]> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.replaceAllLabels({
      owner: this.org,
      repo: this.repo,
      number: this.id,
      labels
    });
    return new Promise<Label[]>((resolve, reject) => {
      if (result.status >= 200 && result.status < 205) {
        const data = result.data;
        const labs = new Array<Label>();
        for (const l of data) {
          const lab = new Label(
            l.id,
            l.url,
            l.name,
            l.color,
            this.org,
            this.repo,
            l.description,
            l.default
          );
          labs.push(lab);
        }
        resolve(labs);
      } else {
        reject(new Error("HTML Request Failed"));
      }
    });
  }

  public async removeLabel(name: string): Promise<boolean> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.removeLabel({
      owner: this.org,
      repo: this.repo,
      number: this.id,
      name
    });
    return new Promise<boolean>(resolve => {
      resolve(result.status === 200);
    });
  }

  public async removeAllLabels(): Promise<boolean> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.removeAllLabels({
      owner: this.org,
      repo: this.repo,
      number: this.id
    });
    return new Promise<boolean>(resolve => {
      resolve(result.status === 204);
    });
  }

  public async getAllLabels(per_page = 30, page = 1): Promise<Label[]> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.getLabels({
      owner: this.org,
      repo: this.repo,
      per_page,
      page
    });
    return new Promise<Label[]>((resolve, reject) => {
      if (result.status >= 200 && result.status < 205) {
        const data = result.data;
        const labs = new Array<Label>();
        for (const l of data) {
          const lab = new Label(
            l.id,
            l.url,
            l.name,
            l.color,
            this.org,
            this.repo,
            l.description,
            l.default
          );
          labs.push(lab);
        }
        resolve(labs);
      } else {
        reject(new Error("HTML Request Failed"));
      }
    });
  }

  public async getLabel(name: string): Promise<Label> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.getLabel({
      owner: this.org,
      repo: this.repo,
      name
    });
    return new Promise<Label>((resolve, reject) => {
      if (result.status >= 200 && result.status < 205) {
        const data = result.data;
        const lab = new Label(
          data.id,
          data.url,
          data.name,
          data.color,
          this.org,
          this.repo,
          data.description,
          data.default
        );
        resolve(lab);
      } else {
        reject(new Error("HTML Request Failed"));
      }
    });
  }

  public async addLabels(labels: string[]): Promise<Label[]> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.addLabels({
      owner: this.org,
      repo: this.repo,
      number: this.id,
      labels
    });
    return new Promise<Label[]>((resolve, reject) => {
      if (result.status >= 200 && result.status < 205) {
        const data = result.data;
        const labs = new Array<Label>();
        for (const l of data) {
          const lab = new Label(
            l.id,
            l.url,
            l.name,
            l.color,
            this.org,
            this.repo,
            l.description,
            l.default
          );
          labs.push(lab);
        }
        resolve(labs);
      } else {
        reject(new Error("HTML Request Failed"));
      }
    });
  }

  public async deleteLabel(name: string): Promise<boolean> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.deleteLabel({
      owner: this.org,
      repo: this.repo,
      name
    });
    return new Promise<boolean>(resolve => {
      resolve(result.status === 204);
    });
  }

  public async createMilestone(
    title: string,
    description?: string,
    due_on?: string,
    state = M_State.Open
  ): Promise<Milestone> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.createMilestone({
      owner: this.org,
      repo: this.repo,
      title,
      state,
      description,
      due_on
    });
    return new Promise<Milestone>((resolve, reject) => {
      if (result.status === 201) {
        const data = result.data;
        const us = new User(
          data.creator.login,
          data.creator.id,
          data.creator.avatar_url,
          data.creator.gravatar_id,
          data.creator.url,
          data.creator.html_url,
          data.creator.events_url,
          data.creator.received_events_url,
          data.creator.type,
          data.creator.site_admin
        );
        const mstate = data.state === "open" ? M_State.Open : M_State.Closed;
        const mile = new Milestone(
          this.org,
          this.repo,
          data.url,
          data.html_url,
          data.labels_url,
          data.id,
          data.number,
          data.title,
          mstate,
          data.description,
          us,
          data.open_issues,
          data.closed_issues,
          data.created_at,
          data.closed_at,
          data.due_on
        );
        resolve(mile);
      } else {
        reject(new Error("HTML Request Failed"));
      }
    });
  }

  public async updateMilestone(
    milestone_id: number,
    title?: string,
    description?: string,
    due_on?: string,
    state = M_State.Open
  ): Promise<Milestone> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.updateMilestone({
      owner: this.org,
      repo: this.repo,
      number: milestone_id,
      title,
      state,
      description,
      due_on
    });
    return new Promise<Milestone>((resolve, reject) => {
      if (result.status === 200) {
        const data = result.data;
        const us = new User(
          data.creator.login,
          data.creator.id,
          data.creator.avatar_url,
          data.creator.gravatar_id,
          data.creator.url,
          data.creator.html_url,
          data.creator.events_url,
          data.creator.received_events_url,
          data.creator.type,
          data.creator.site_admin
        );
        const mstate = data.state === "open" ? M_State.Open : M_State.Closed;
        const mile = new Milestone(
          this.org,
          this.repo,
          data.url,
          data.html_url,
          data.labels_url,
          data.id,
          data.number,
          data.title,
          mstate,
          data.description,
          us,
          data.open_issues,
          data.closed_issues,
          data.created_at,
          data.closed_at,
          data.due_on
        );
        resolve(mile);
      } else {
        reject(new Error("HTML Request Failed"));
      }
    });
  }

  public async getMilestone(milestone_id: number): Promise<Milestone> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.getMilestone({
      owner: this.org,
      repo: this.repo,
      number: milestone_id
    });
    return new Promise<Milestone>((resolve, reject) => {
      if (result.status === 200) {
        const data = result.data;
        const us = new User(
          data.creator.login,
          data.creator.id,
          data.creator.avatar_url,
          data.creator.gravatar_id,
          data.creator.url,
          data.creator.html_url,
          data.creator.events_url,
          data.creator.received_events_url,
          data.creator.type,
          data.creator.site_admin
        );
        const mstate = data.state === "open" ? M_State.Open : M_State.Closed;
        const mile = new Milestone(
          this.org,
          this.repo,
          data.url,
          data.html_url,
          data.labels_url,
          data.id,
          data.number,
          data.title,
          mstate,
          data.description,
          us,
          data.open_issues,
          data.closed_issues,
          data.created_at,
          data.closed_at,
          data.due_on
        );
        resolve(mile);
      } else {
        reject(new Error("HTML Request Failed"));
      }
    });
  }

  public async getMilestoneLabels(
    milestone_id: number,
    per_page = 30,
    page = 1
  ): Promise<Label[]> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.getMilestoneLabels({
      owner: this.org,
      repo: this.repo,
      number: milestone_id,
      per_page,
      page
    });
    return new Promise<Label[]>((resolve, reject) => {
      if (result.status === 200) {
        const data = result.data;
        const labs = new Array<Label>();
        for (const l of data) {
          const lab = new Label(
            l.id,
            l.url,
            l.name,
            l.color,
            this.org,
            this.repo,
            l.description,
            l.default
          );
          labs.push(lab);
        }
        resolve(labs);
      } else {
        reject(new Error("HTML Request Failed"));
      }
    });
  }

  public async deleteMilestone(milestone_id: number): Promise<boolean> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.deleteMilestone({
      owner: this.org,
      repo: this.repo,
      number: milestone_id
    });
    return new Promise<boolean>(resolve => {
      resolve(result.status === 204);
    });
  }

  public async lock(lock_reason = LockReason.Resolved): Promise<boolean> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.lock({
      owner: this.org,
      repo: this.repo,
      number: this.id,
      lock_reason
    });
    return new Promise<boolean>(resolve => {
      resolve(result.status === 204);
    });
  }

  public async unlock(): Promise<boolean> {
    const gh: Github = new Github(this.opts);
    const result = await gh.issues.unlock({
      owner: this.org,
      repo: this.repo,
      number: this.id
    });
    return new Promise<boolean>(resolve => {
      resolve(result.status === 204);
    });
  }
}
