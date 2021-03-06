import { User } from "./user";

export enum Pr_Event {
  Approve = "APPROVE",
  RequestChange = "REQUEST_CHANGES",
  MakeComment = "COMMENT"
}

export enum Pr_State {
  Appr = "APPROVED",
  Pend = "PENDING",
  Change = "CHANGES_REQUESTED",
  Dismiss = "DISMISSED"
}

export type ReviewComments = {
  path: string;
  position: number;
  body: string;
};

export class Review {
  public pr_id: number;
  public user: User;
  public body: string;
  public commit_id: string;
  public state: Pr_State;
  public html_url: string;
  public pull_request_url: string;
  // Repo Info
  public org: string;
  public repo: string;

  constructor(
    pr_id: number,
    user: User,
    body: string,
    commit_id: string,
    html_url: string,
    pr_url: string,
    org: string,
    repo: string,
    state = Pr_State.Pend
  ) {
    this.pr_id = pr_id;
    this.user = user;
    this.body = body;
    this.commit_id = commit_id;
    this.html_url = html_url;
    this.pull_request_url = pr_url;
    this.state = state;
    this.org = org;
    this.repo = repo;
  }
}
