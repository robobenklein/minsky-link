import { User } from "./user";

export class GitComment {
  public id: number;
  public comment_id: string;
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
    comment_id = "",
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
    this.comment_id = comment_id;
    this.url = url;
    this.html_url = html_url;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export class GitPRComment extends GitComment {
  public path: string; // path to file that necessitates the comment
  public diff_position: number;

  constructor(
    c_body: string,
    org: string,
    repo: string,
    id = 0,
    comment_id = "",
    url = "",
    html_url = "",
    user = new User(),
    created_at = "",
    updated_at = "",
    c_path = "",
    c_dposition = NaN
  ) {
    super(c_body, org, repo, id, comment_id, url, html_url, user, created_at, updated_at);
    this.path = c_path;
    this.diff_position = c_dposition;
  }
}

export class GitReplyComment extends GitPRComment {
  public in_reply_to_id: number;

  constructor(
    c_body: string,
    org: string,
    repo: string,
    id = 0,
    comment_id = "",
    url = "",
    html_url = "",
    user = new User(),
    created_at = "",
    updated_at = "",
    c_path = "",
    c_dposition = NaN,
    c_irt = NaN
  ) {
    super(
      c_body,
      org,
      repo,
      id,
      comment_id,
      url,
      html_url,
      user,
      created_at,
      updated_at,
      c_path,
      c_dposition
    );
    this.in_reply_to_id = c_irt;
  }
}

export class GitReviewComment extends GitReplyComment {
  public review_id: string;
  public diff_hunk: string;
  public position: number;
  public original_position: number;
  public original_commit_id: string;

  constructor(
    c_revid: string,
    c_body: string,
    org: string,
    repo: string,
    id = 0,
    comment_id = "",
    url = "",
    html_url = "",
    user = new User(),
    created_at = "",
    updated_at = "",
    c_path = "",
    c_dposition = NaN,
    c_irt = NaN,
    diff_hunk = "",
    position = 0,
    original_position = 0,
    original_commit_id = ""
  ) {
    super(
      c_body,
      org,
      repo,
      id,
      comment_id,
      url,
      html_url,
      user,
      created_at,
      updated_at,
      c_path,
      c_dposition,
      c_irt
    );
    this.review_id = c_revid;
    this.diff_hunk = diff_hunk;
    this.position = position;
    this.original_position = original_position;
    this.original_commit_id = original_commit_id;
  }
}
