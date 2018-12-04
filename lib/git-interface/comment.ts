import { User } from "./user";

export class GitComment {
  public id: number;
  public url: string;
  public html_url: string;
  public body: string;
  public user: User;
  public created_at: string;
  public updated_at: string;
  // Repo Info
  public org: string;
  public repo: string;

  constructor(
    c_body: string,
    org: string,
    repo: string,
    id = 0,
    url = "",
    html_url = "",
    user = new User(),
    created_at = "",
    updated_at = ""
  ) {
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

export class GitPRComment extends GitComment {
  public review_id: number;
  public diff_hunk: string;
  public path: string; // path to file that necessitates the comment
  public position: number;
  public original_position: number;
  public commit_id: string;
  public original_commit_id: string;
  public in_reply_to_id: number;
  public pull_request_url: string;

  constructor(
    c_body: string,
    org: string,
    repo: string,
    id = 0,
    url = "",
    html_url = "",
    user = new User(),
    created_at = "",
    updated_at = "",
    review_id = 0,
    diff_hunk = "",
    path = "",
    diff_position = 0,
    original_position = 0,
    commit_id = "",
    original_commit_id = "",
    in_reply_to_id = 0,
    pull_request_url = ""
  ) {
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
