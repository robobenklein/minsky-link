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

export abstract class PullRequest extends Issue {
  // Properties

  // The following properties are inherited from the Issue interface, but
  // should not be used with Pull/Merge Requests:
  //   * repository_url
  //   * events_url
  //   * labels_url
  //   * corresponding_pr

  public diff_url!: string;
  public patch_url!: string;
  public issue_url!: string;
  public commits_url!: string;
  public review_comments_url!: string;
  public review_comment_url!: string;
  public statuses_url!: string;
  public merged_at!: string;
  public head!: Branch;
  public base!: Branch;
  public merge_commit_sha!: string;
  public merged!: boolean;
  public mergable!: boolean;
  public merged_by!: User;
  public num_comments!: number;
  public num_commits!: number;
  public num_additions!: number;
  public num_deletions!: number;
  public num_changed_files!: number;
  public maintainer_can_modify!: boolean;

  constructor() {
    super();
  }

  public abstract checkMerged(): Promise<boolean>;

  public abstract createPRComment(
    body: string,
    commit_id: string,
    path: string,
    diff_position: number
  ): Promise<GitPRComment>;

  public abstract createCommentReply(
    body: string,
    in_reply_to: number
  ): Promise<GitReplyComment>;

  // More parameters need to be added
  public abstract createReview(
    commit_id: string,
    body: string,
    rev_event: string
  ): Promise<GitReviewComment>;

  public abstract createReviewRequest(
    reviewers: string[],
    team_reviewers: string[]
  ): Promise<boolean>;

  public abstract getReview(review_id: string): Promise<any>;

  public abstract getReviewComments(
    review_id: string,
    per_page: number,
    page: number
  ): Promise<any[]>;

  public abstract getReviewRequests(
    per_page: number,
    page: number
  ): Promise<any[]>;

  public abstract getAllReviews(per_page: number, page: number): Promise<any[]>;

  public abstract submitReview(
    review_id: string,
    body: string,
    rev_event: string
  ): Promise<boolean>;

  public abstract dismissReview(
    review_id: string,
    message: string
  ): Promise<boolean>;

  public abstract deletePendingRevew(review_id: string): Promise<boolean>;

  public abstract deleteReviewRequest(
    reviewers: string[],
    team_reviewers: string[]
  ): Promise<boolean>;

  public abstract getAllCommits(per_page: number, page: number): Promise<any[]>;

  public abstract getAllFiles(per_page: number, page: number): Promise<any[]>;

  public abstract merge(
    commit_title: string,
    commit_message: string,
    sha: string,
    merge_method: string
  ): Promise<boolean>;

  public abstract update(
    title: string,
    body: string,
    state: string,
    base: string,
    maintainer_can_modify: boolean
  ): Promise<boolean>;
}
