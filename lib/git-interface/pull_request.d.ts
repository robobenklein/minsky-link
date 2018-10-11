import { Issue } from "./issue";
import { User } from "./user";
import {
  GitComment,
  GitPRComment,
  GitReplyComment,
  GitReviewComment
} from "./comment";

export class Branch {
  public label: string;
  public ref: string;
  public sha: string;
  public user: User;
  public repo: string;
}

export interface PullRequest extends Issue {
  // Functions

  // Functions from API that need to be wrapped in a constructor:
  //   * create
  //   * createFromIssue
  //   * get

  checkMerged(): boolean;

  createComment(
    body: string,
    commit_id: string,
    path: string,
    diff_position: number
  ): boolean;

  createCommentReply(body: string, in_reply_to: number): boolean;

  // More parameters need to be added
  createReview(commit_id: string, body: string, rev_event: string): boolean;

  createReviewRequest(reviewers: string[], team_reviewers: string[]): boolean;

  getReview(review_id: string): any;

  getReviewComments(
    review_id: string,
    per_page: number,
    page: number
  ): Array<any>;

  getReviewRequests(per_page: number, page: number): Array<any>;

  getAllReviews(per_page: number, page: number): Array<any>;

  submitReview(review_id: string, body: string, rev_event: string): boolean;

  dismissReview(review_id: string, message: string): boolean;

  deletePendingRevew(review_id: string): boolean;

  deleteReviewRequest(reviewers: string[], team_reviewers: string[]): boolean;

  getAllCommits(per_page: number, page: number): Array<any>;

  getAllFiles(per_page: number, page: number): Array<any>;

  merge(
    commit_title: string,
    commit_message: string,
    sha: string,
    merge_method: string
  ): boolean;

  update(
    title: string,
    body: string,
    state: string,
    base: string,
    maintainer_can_modify: boolean
  ): boolean;

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
  maintainer_can_modify: bool;
}
