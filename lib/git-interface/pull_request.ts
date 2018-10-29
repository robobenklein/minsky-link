import { Issue } from "./issue";
import { User } from "./user";
import {
  GitPRComment,
  GitReplyComment,
  GitReviewComment
} from "./comment";

export interface Branch {
  label: string;
  ref: string;
  sha: string;
  user: User;
  repo: string;
}

export abstract class PullRequest extends Issue {
  // Functions

  // Functions from API that need to be wrapped in a constructor:
  //   * create
  //   * createFromIssue
  //   * get
  constructor() {
    super();
  }

  abstract checkMerged(): Promise<boolean>;

  abstract createPRComment(
    body: string,
    commit_id: string,
    path: string,
    diff_position: number
  ): Promise<GitPRComment>;

  abstract createCommentReply(body: string, in_reply_to: number): Promise<GitReplyComment>;

  // More parameters need to be added
  abstract createReview(commit_id: string, body: string, rev_event: string): Promise<GitReviewComment>;

  abstract createReviewRequest(reviewers: string[], team_reviewers: string[]): Promise<boolean>;

  abstract getReview(review_id: string): Promise<any>;

  abstract getReviewComments(
    review_id: string,
    per_page: number,
    page: number
  ): Promise<Array<any>>;

  abstract getReviewRequests(per_page: number, page: number): Promise<Array<any>>;

  abstract getAllReviews(per_page: number, page: number): Promise<Array<any>>;

  abstract submitReview(review_id: string, body: string, rev_event: string): Promise<boolean>;

  abstract dismissReview(review_id: string, message: string): Promise<boolean>;

  abstract deletePendingRevew(review_id: string): Promise<boolean>;

  abstract deleteReviewRequest(reviewers: string[], team_reviewers: string[]): Promise<boolean>;

  abstract getAllCommits(per_page: number, page: number): Promise<Array<any>>;

  abstract getAllFiles(per_page: number, page: number): Promise<Array<any>>;

  abstract merge(
    commit_title: string,
    commit_message: string,
    sha: string,
    merge_method: string
  ): Promise<boolean>;

  abstract update(
    title: string,
    body: string,
    state: string,
    base: string,
    maintainer_can_modify: boolean
  ): Promise<boolean>;

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
}
