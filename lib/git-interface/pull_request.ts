import { Issue } from "./issue";
import { User, Team } from "./user";
import { GitPRComment } from "./comment";
import { Review } from "./review";
import { Commit } from "./commit";
import { GitFile } from "./file";

export interface Branch {
  label: string;
  ref: string;
  sha: string;
  user: User;
  repo: string;
  repo_url: string;
}

export type MergeData = {
    sha: string;
    merged: boolean;
    message: string;
};

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

  createReviewComment(
    body: string,
    commit_id: string,
    path: string,
    diff_position: number
  ): Promise<GitPRComment>;

  createReviewCommentReply(
    body: string,
    in_reply_to: number
  ): Promise<GitPRComment>;

  // More parameters need to be added
  createReview(
    commit_id?: string,
    body?: string,
    rev_event?: string
  ): Promise<Review>;

  createReviewRequest(
    reviewers?: string[],
    team_reviewers?: string[]
  ): Promise<[User[], Team[]]>;

  getReview(review_id: number): Promise<Review>;

  getReviewComments(
    review_id: number,
    per_page: number,
    page: number
  ): Promise<GitPRComment[]>;

  getReviewRequests(per_page: number, page: number): Promise<[User[], Team[]]>;

  getAllReviews(per_page: number, page: number): Promise<Review[]>;

  submitReview(
    review_id: number,
    rev_event: string,
    body?: string
  ): Promise<Review>;

  dismissReview(review_id: number, message: string): Promise<Review>;

  deletePendingRevew(review_id: number): Promise<Review>;

  deleteReviewRequest(
    reviewers?: string[],
    team_reviewers?: string[]
  ): Promise<boolean>;

  getAllCommits(per_page: number, page: number): Promise<Commit[]>;

  getAllFiles(per_page: number, page: number): Promise<GitFile[]>;

  merge(
    commit_title?: string,
    commit_message?: string,
    sha?: string,
    merge_method?: "merge" | "squash" | "rebase"
  ): Promise<MergeData>;

  update(
    title?: string,
    body?: string,
    state?: "open" | "closed",
    base?: string,
    maintainer_can_modify?: boolean
  ): Promise<boolean>;
}
