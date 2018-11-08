import { Issue } from "./issue";
import { User } from "./user";
import { GitPRComment, GitReplyComment, GitReviewComment } from "./comment";

export interface Branch {
  label: string;
  ref: string;
  sha: string;
  user: User;
  repo: string;
}

export interface PullRequest extends Issue {
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

  checkMerged(): Promise<boolean>;

  createPRComment(
    body: string,
    commit_id: string,
    path: string,
    diff_position: number
  ): Promise<GitPRComment>;

  createCommentReply(
    body: string,
    in_reply_to: number
  ): Promise<GitReplyComment>;

  // More parameters need to be added
  createReview(
    commit_id: string,
    body: string,
    rev_event: string
  ): Promise<GitReviewComment>;

  createReviewRequest(
    reviewers: string[],
    team_reviewers: string[]
  ): Promise<boolean>;

  getReview(review_id: string): Promise<any>;

  getReviewComments(
    review_id: string,
    per_page: number,
    page: number
  ): Promise<any[]>;

  getReviewRequests(per_page: number, page: number): Promise<any[]>;

  getAllReviews(per_page: number, page: number): Promise<any[]>;

  submitReview(
    review_id: string,
    body: string,
    rev_event: string
  ): Promise<boolean>;

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
