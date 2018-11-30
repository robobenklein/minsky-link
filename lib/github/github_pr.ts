import {
  PRCorrespondingWithIssue,
  IssueState,
  LockReason,
  Issue
} from "../git-interface/issue";
import { User, Team } from "../git-interface/user";
import { Label } from "../git-interface/label";
import { Milestone, M_State } from "../git-interface/milestone";
import { GitPRComment } from "../git-interface/comment";
import {
  Review,
  ReviewComments,
  Pr_Event,
  Pr_State
} from "../git-interface/review";
import { Branch, PullRequest } from "../git-interface/pull_request";
import { GitHubIssue } from "./github_issue";

import * as Github from "@octokit/rest";

/*export interface Branch {
  label: string;
  ref: string;
  sha: string;
  user: User;
  repo: string;
}*/

export class GitHubPR extends GitHubIssue implements PullRequest {
  // Properties

  // The following properties are inherited from the Issue interface, but
  // should not be used with Pull/Merge Requests:
  //   * repository_url
  //   * events_url
  //   * labels_url
  //   * corresponding_pr

  diff_url: string;
  patch_url: string;
  issue_url: string;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  statuses_url: string;
  merged_at: string;
  head: Branch;
  base: Branch;
  merge_commit_sha: string;
  merged: boolean;
  mergable: boolean;
  merged_by: User;
  num_comments: number;
  num_commits: number;
  num_additions: number;
  num_deletions: number;
  num_changed_files: number;
  maintainer_can_modify: boolean;

  constructor(
    org: string,
    repo: string,
    prnumber: number,
    head: Branch,
    base: Branch,
    title = "",
    url = "",
    repository_url = "",
    labels_url = "",
    comments_url = "",
    events_url = "",
    html_url = "",
    id = 0,
    state = IssueState.Open,
    body = "",
    user = new User(),
    labels = new Array<Label>(),
    assignees = new Array<User>(),
    milestone = new Milestone(),
    locked = false,
    active_lock_reason = "",
    created_at = "",
    closed_at = "",
    updated_at = "",
    closed_by = new User(),
    diff_url = "",
    patch_url = "",
    issue_url = "",
    commits_url = "",
    review_comments_url = "",
    review_comment_url = "",
    statuses_url = "",
    merged_at = "",
    merge_commit_sha = "",
    merged = false,
    mergable = false,
    merged_by = new User(),
    num_comments = 0,
    num_commits = 0,
    num_additions = 0,
    num_deletions = 0,
    num_changed_files = 0,
    maintainer_can_modify = false
  ) {
    super(
      org,
      repo,
      prnumber,
      title,
      url,
      repository_url,
      labels_url,
      comments_url,
      events_url,
      html_url,
      id,
      state,
      body,
      user,
      labels,
      assignees,
      milestone,
      locked,
      active_lock_reason,
      num_comments,
      new PRCorrespondingWithIssue(),
      created_at,
      closed_at,
      updated_at,
      closed_by
    );
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

  public async checkMerged(): Promise<boolean> {
    const gh: Github = new Github(this.opts);
    const result = await gh.pullRequests.checkMerged({
      owner: this.org,
      repo: this.repo,
      number: this.inumber
    });
    return new Promise<boolean>(resolve => resolve(result.status == 204));
  }

  public async createReviewComment(
    body: string,
    commit_id: string,
    path: string,
    diff_position: number
  ): Promise<GitPRComment> {
    const gh: Github = new Github(this.opts);
    const result = await gh.pullRequests.createComment({
      owner: this.org,
      repo: this.repo,
      number: this.inumber,
      body,
      commit_id,
      path,
      position: diff_position
    });
    return new Promise<GitPRComment>((resolve, reject) => {
      if (result.status == 201) {
        const data = result.data;
        const us = new User(
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
        const com = new GitPRComment(
          data.body,
          this.org,
          this.repo,
          data.id,
          data.url,
          data.html_url,
          us,
          data.created_at,
          data.updated_at,
          data.pull_request_review_id,
          data.diff_hunk,
          data.path,
          data.position,
          data.original_position,
          data.commit_id,
          data.original_commit_id,
          data.in_reply_to_id,
          data.pull_request_url
        );
        resolve(com);
      } else {
        reject(new Error("HTML Request Failed."));
      }
    });
  }

  public async createReviewCommentReply(
    body: string,
    in_reply_to: number
  ): Promise<GitPRComment> {
    const gh: Github = new Github(this.opts);
    const result = await gh.pullRequests.createCommentReply({
      owner: this.org,
      repo: this.repo,
      number: this.inumber,
      body,
      in_reply_to
    });
    return new Promise<GitPRComment>((resolve, reject) => {
      if (result.status == 201) {
        const data = result.data;
        const us = new User(
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
        const com = new GitPRComment(
          data.body,
          this.org,
          this.repo,
          data.id,
          data.url,
          data.html_url,
          us,
          data.created_at,
          data.updated_at,
          data.pull_request_review_id,
          data.diff_hunk,
          data.path,
          data.position,
          data.original_position,
          data.commit_id,
          data.original_commit_id,
          data.in_reply_to_id,
          data.pull_request_url
        );
        resolve(com);
      } else {
        reject(new Error("HTML Request Failed."));
      }
    });
  }

  // More parameters need to be added
  public async createReview(
    commit_id?: string,
    body?: string,
    rev_event?: Pr_Event,
    comments?: ReviewComments[]
  ): Promise<Review> {
    const gh: Github = new Github(this.opts);
    const result = await gh.pullRequests.createReview({
      owner: this.org,
      repo: this.repo,
      number: this.inumber,
      commit_id,
      body,
      event: rev_event,
      comments
    });
    return new Promise<Review>((resolve, reject) => {
      if (result.status == 200) {
        const data = result.data;
        const us = new User(
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
        const state =
          data.state == "APPROVED"
            ? Pr_State.Appr
            : data.state == "PENDING"
              ? Pr_State.Pend
              : data.state == "CHANGES_REQUESTED"
                ? Pr_State.Change
                : Pr_State.Dissmiss;
        const rev = new Review(
          data.id,
          us,
          data.body,
          data.commit_id,
          data._links.html.href,
          data._links.pull_request.href,
          this.org,
          this.repo,
          state
        );
        resolve(rev);
      } else {
        reject(new Error("HTML Request Failed."));
      }
    });
  }

  public async createReviewRequest(
    reviewers?: string[],
    team_reviewers?: string[]
  ): Promise<[User[], Team[]]> {
    const gh: Github = new Github(this.opts);
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
          ? IssueState.Open
          : data.state == "closed"
            ? IssueState.Closed
            : IssueState.All;
      this.title = data.title;
      this.body = data.body;
      // Empties the labels array
      this.labels.splice(0, this.labels.length);
      for (const labdat of data.labels) {
        const lab = new Label(
          labdat.id,
          labdat.url,
          labdat.name,
          labdat.color,
          this.org,
          this.repo,
          labdat.description,
          labdat.default
        );
        this.labels.push(lab);
      }
      const mstate =
        data.milestone.state == "open" ? M_State.Open : M_State.Closed;
      const mcreator = new User(
        data.milestone.creator.login,
        data.milestone.creator.id,
        data.milestone.creator.avatar_url,
        data.milestone.creator.gravatar_id,
        data.milestone.creator.url,
        data.milestone.creator.html_url,
        data.milestone.creator.events_url,
        data.milestone.creator.received_events_url,
        data.milestone.creator.type,
        data.milestone.creator.site_admin
      );
      this.milestone = new Milestone(
        this.org,
        this.repo,
        data.milestone.url,
        data.milestone.html_url,
        data.milestone.labels_url,
        data.milestone.id,
        data.milestone.number,
        data.milestone.title,
        mstate,
        data.milestone.description,
        mcreator,
        data.milestone.open_issues,
        data.milestone.closed_issues,
        data.milestone.created_at,
        data.milestone.closed_at,
        data.milestone.due_on
      );
      this.locked = data.locked;
      this.active_lock_reason = data.active_lock_reason;
      this.created_at = data.created_at;
      this.closed_at = data.closed_at;
      this.updated_at = data.updated_at;
      this.merged_at = data.merged_at;
      const headUser = new User(
        data.head.user.login,
        data.head.user.id,
        data.head.user.avatar_url,
        data.head.user.gravatar_id,
        data.head.user.url,
        data.head.user.html_url,
        data.head.user.events_url,
        data.head.user.received_events_url,
        data.head.user.type,
        data.head.user.site_admin
      );
      this.head = {
        label: data.head.label,
        ref: data.head.ref,
        sha: data.head.sha,
        user: headUser,
        repo: data.head.repo.name,
        repo_url: data.head.repo.html_url
      } as Branch;
      const baseUser = new User(
        data.base.user.login,
        data.base.user.id,
        data.base.user.avatar_url,
        data.base.user.gravatar_id,
        data.base.user.url,
        data.base.user.html_url,
        data.base.user.events_url,
        data.base.user.received_events_url,
        data.base.user.type,
        data.base.user.site_admin
      );
      this.base = {
        label: data.base.label,
        ref: data.base.ref,
        sha: data.base.sha,
        user: baseUser,
        repo: data.base.repo.name,
        repo_url: data.base.repo.html_url
      } as Branch;
    }
    return new Promise<[User[], Team[]]>((resolve, reject) => {
      if (result.status == 201) {
        var reviewers = new Array<User>();
        for (const req of data.requested_reviewers) {
          const rev = new User(
            req.login,
            req.id,
            req.avatar_url,
            req.gravatar_id,
            req.url,
            req.html_url,
            req.events_url,
            req.received_events_url,
            req.type,
            req.site_admin
          );
          reviewers.push(rev);
        }
        var teams = new Array<Team>();
        for (const ret of data.requested_teams) {
          const tea = new Team(
            ret.id,
            ret.url,
            ret.name,
            ret.slug,
            ret.description,
            ret.privacy,
            ret.permission,
            ret.members_url,
            ret.repositories_url
          );
          teams.push(tea);
        }
        resolve([reviewers, teams]);
      } else {
        reject(new Error("HTML Request Failed."));
      }
    });
  }

  public async getReview(review_id: number): Promise<Review> {
    const gh: Github = new Github(this.opts);
    const result = await gh.pullRequests.getReview({
      owner: this.org,
      repo: this.repo,
      number: this.inumber,
      review_id
    });
    return new Promise<Review>((resolve, reject) => {
      if (result.status == 200) {
        const data = result.data;
        const us = new User(
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
        const rstate =
          data.state == "APPROVED"
            ? Pr_State.Appr
            : data.state == "PENDING"
              ? Pr_State.Pend
              : data.state == "CHANGES_REQUESTED"
                ? Pr_State.Change
                : Pr_State.Dissmiss;
        const rev = new Review(
          data.id,
          us,
          data.body,
          data.commit_id,
          data.html_url,
          data.pull_request_url,
          this.org,
          this.repo,
          rstate
        );
        resolve(rev);
      } else {
        reject(new Error("HTML Request Failed."));
      }
    });
  }

  public async getReviewComments(
    review_id: number,
    per_page = 30,
    page = 1
  ): Promise<GitPRComment[]> {
    const gh: Github = new Github(this.opts);
    const result = await gh.pullRequests.getReviewComments({
      owner: this.org,
      repo: this.repo,
      number: this.inumber,
      review_id,
      per_page,
      page
    });
    return new Promise<GitPRComment[]>((resolve, reject) => {
      if (result.status == 200) {
        var comments = new Array<GitPRComment>();
        for (const com of result.data) {
          const us = new User(
            com.user.login,
            com.user.id,
            com.user.avatar_url,
            com.user.gravatar_id,
            com.user.url,
            com.user.html_url,
            com.user.events_url,
            com.user.received_events_url,
            com.user.type,
            com.user.site_admin
          );
          const prcom = new GitPRComment(
            com.body,
            this.org,
            this.repo,
            com.id,
            com.url,
            com.html_url,
            us,
            com.created_at,
            com.updated_at,
            com.pull_request_review_id,
            com.diff_hunk,
            com.path,
            com.position,
            com.original_position,
            com.commit_id,
            com.original_commit_id,
            com.in_reply_to_id,
            com.pull_request_url
          );
          comments.push(prcom);
        }
        resolve(comments);
      } else {
        reject(new Error("HTML Request Failed."));
      }
    });
  }

  public async getReviewRequests(per_page=30, page=1): Promise<[User[], Team[]]>
  {
    const gh: Github = new Github(this.opts);
    const result = await gh.pullRequests.getReviewRequests({
      owner: this.org,
      repo: this.repo,
      number: this.inumber,
      per_page,
      page
    });
    return new Promise<[User[], Team[]]>((resolve, reject) => {
      if (result.status == 200) {
        const data = result.data;
        var reviewers = new Array<User>();
        for (const req of data.users) {
          const rev = new User(
            req.login,
            req.id,
            req.avatar_url,
            req.gravatar_id,
            req.url,
            req.html_url,
            req.events_url,
            req.received_events_url,
            req.type,
            req.site_admin
          );
          reviewers.push(rev);
        }
        var teams = new Array<Team>();
        for (const ret of data.teams) {
          const tea = new Team(
            ret.id,
            ret.url,
            ret.name,
            ret.slug,
            ret.description,
            ret.privacy,
            ret.permission,
            ret.members_url,
            ret.repositories_url
          );
          teams.push(tea);
        }
        resolve([reviewers, teams]);
      } else {
        reject(new Error("HTML Request Failed."));
      }
    });
  }

  public async getAllReviews(per_page=30, page=1): Promise<Review[]>
  {
    const gh: Github = new Github(this.opts);
    const result = await gh.pullRequests.getReviews({
      owner: this.org,
      repo: this.repo,
      number: this.inumber,
      per_page, 
      page
    });
    return new Promise<Review[]>((resolve, reject) => {
      if (result.status == 200) {
        var revs = Array<Review>();
        const data = result.data;
        for (const d of data)
        {
            const us = new User(
              d.user.login,
              d.user.id,
              d.user.avatar_url,
              d.user.gravatar_id,
              d.user.url,
              d.user.html_url,
              d.user.events_url,
              d.user.received_events_url,
              d.user.type,
              d.user.site_admin
            );
            const rstate =
              d.state == "APPROVED"
                ? Pr_State.Appr
                : d.state == "PENDING"
                  ? Pr_State.Pend
                  : d.state == "CHANGES_REQUESTED"
                    ? Pr_State.Change
                    : Pr_State.Dissmiss;
            const rev = new Review(
              d.id,
              us,
              d.body,
              d.commit_id,
              d.html_url,
              d.pull_request_url,
              this.org,
              this.repo,
              rstate
            );
            revs.push(rev);
        }
        resolve(revs);
      } else {
        reject(new Error("HTML Request Failed."));
      }
    });
  }

  public async submitReview(
    review_id: number,
    rev_event: Pr_Event,
    body?: string
  ): Promise<Review>
  {
    const gh: Github = new Github(this.opts);
    const result = await gh.pullRequests.submitReview({
      owner: this.org,
      repo: this.repo,
      number: this.inumber,
      review_id,
      body,
      event: rev_event
    });
    return new Promise<Review>((resolve, reject) => {
      if (result.status == 200) {
        const data = result.data;
        const us = new User(
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
        const rstate =
          data.state == "APPROVED"
            ? Pr_State.Appr
            : data.state == "PENDING"
              ? Pr_State.Pend
              : data.state == "CHANGES_REQUESTED"
                ? Pr_State.Change
                : Pr_State.Dissmiss;
        const rev = new Review(
          data.id,
          us,
          data.body,
          data.commit_id,
          data.html_url,
          data.pull_request_url,
          this.org,
          this.repo,
          rstate
        );
        resolve(rev);
      } else {
        reject(new Error("HTML Request Failed."));
      }
    });
  }

  dismissReview(review_id: string, message: string): Promise<boolean>;

  deletePendingRevew(review_id: string): Promise<boolean>;

  deleteReviewRequest(
    reviewers: string[],
    team_reviewers: string[]
  ): Promise<boolean>;

  getAllCommits(per_page: number, page: number): Promise<any[]>;

  getAllFiles(per_page: number, page: number): Promise<any[]>;

  merge(
    commit_title: string,
    commit_message: string,
    sha: string,
    merge_method: string
  ): Promise<boolean>;

  update(
    title: string,
    body: string,
    state: string,
    base: string,
    maintainer_can_modify: boolean
  ): Promise<boolean>;
}
