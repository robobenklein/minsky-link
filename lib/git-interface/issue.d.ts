import { GitComment } from "./comment";
import { Label } from "./label";
import { Milestone } from "./milestone";
import { User } from "./user";

export class PRCorrespondingWithIssue {
  url: string;
  html_url: string;
  diff_url: string;
  patch_url: string;

  constructor(url = "", html_url = "", diff_url = "", patch_url = "") {
    this.url = url;
    this.html_url = html_url;
    this.diff_url = diff_url;
    this.patch_url = patch_url;
  }
}

export enum IssueState {
  Open = "open",
  Closed = "closed",
  All = "all"
}

export abstract class Issue {
  // Functions

  // Turn into Constructor for Implementations
  //createIssue(title: string, body: string, milestone: number, labels: string[],
  //    assignees: string[]): boolean;

  abstract addAssignees(assignees: string[]): boolean;

  abstract getAvailableAssignees(per_page: number, page: number): Array<User>;

  abstract checkAssignability(assignee: string): boolean;

  abstract removeAssignees(assignees: string[]): boolean;

  abstract createComment(body: string): boolean;

  abstract editComment(comment_id: string, body: string): boolean;

  abstract getComment(comment_id: string, per_page: number, page: number): GitComment;

  abstract getAllComments(
    since: string,
    per_page: number,
    page: number
  ): Array<GitComment>;

  abstract deleteComment(comment_id: string): boolean;

  abstract createLabel(name: string, color: string, description: string): boolean;

  abstract updateLabel(
    current_name: string,
    new_name: string,
    new_color: string,
    new_description: string
  ): boolean;

  abstract replaceAllLabels(labels: string[]): boolean;

  abstract removeLabel(name: string): boolean;

  abstract removeAllLabels(): boolean;

  abstract getAllLabels(per_page: number, page: number): Array<Label>;

  abstract getLabel(name: string): Label;

  abstract addLabels(labels: string[]): boolean;

  abstract deleteLabel(name: string): boolean;

  abstract createMilestone(
    title: string,
    state: string,
    description: string,
    due_on: string
  ): boolean;

  abstract updateMilestone(
    milestone_id: number,
    title: string,
    state: string,
    description: string,
    due_on: string
  ): boolean;

  abstract getMilestone(milestone_id: number): Milestone;

  abstract getMilestoneLabels(
    milestone_id: number,
    per_page: number,
    page: number
  ): Array<any>;

  abstract deleteMilestone(milestone_id: number): boolean;

  //editIssue(id: number, title: string, body: string, state: string, milestone: number,
  //    labels: string[], assignees: string[]): boolean;

  abstract lock(lock_reason: string): boolean;

  abstract unlock(): boolean;

  // Properties
  protected id: number;
  protected url: string;
  protected repository_url: string;
  // The URL should end with "{/name}". That needs to be replaced with the
  // name of the label for the URL to work.
  protected labels_url: string;
  protected comments_url: string;
  protected events_url: string;
  protected html_url: string;
  protected inumber: number;
  protected state: IssueState;
  protected title: string;
  protected body: string;
  protected user: User;
  protected labels: Array<Label>;
  protected assignees: Array<User>;
  protected milestone: Milestone;
  protected locked: boolean;
  protected active_lock_reason: string;
  protected num_comments: number;
  protected corresponding_pr: PRCorrespondingWithIssue;
  protected created_at: string;
  protected closed_at: string; // Should be null by default
  protected updated_at: string;
}
