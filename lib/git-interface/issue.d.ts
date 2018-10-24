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
  constructor() {opts = {baseUrl: "https://api.github.com",}}
  // Functions

  // Turn into Constructor for Implementations
  //createIssue(title: string, body: string, milestone: number, labels: string[],
  //    assignees: string[]): boolean;

  abstract addAssignees(assignees: string[]): Promise<boolean>;

  abstract getAvailableAssignees(per_page: number, page: number): Promise<Array<User>>;

  abstract checkAssignability(assignee: string): Promise<boolean>;

  abstract removeAssignees(assignees: string[]): Promise<boolean>;

  abstract createComment(body: string): Promise<boolean>;

  abstract editComment(comment_id: string, body: string): Promise<boolean>;

  abstract getComment(comment_id: string, per_page: number, page: number): Promise<GitComment>;

  abstract getAllComments(
    since: string,
    per_page: number,
    page: number
  ): Promise<Array<GitComment>>;

  abstract deleteComment(comment_id: string): Promise<boolean>;

  abstract createLabel(name: string, color: string, description: string): Promise<boolean>;

  abstract updateLabel(
    current_name: string,
    new_name: string,
    new_color: string,
    new_description: string
  ): Promise<boolean>;

  abstract replaceAllLabels(labels: string[]): Promise<boolean>;

  abstract removeLabel(name: string): Promise<boolean>;

  abstract removeAllLabels(): Promise<boolean>;

  abstract getAllLabels(per_page: number, page: number): Promise<Array<Label>>;

  abstract getLabel(name: string): Promise<Label>;

  abstract addLabels(labels: string[]): Promise<boolean>;

  abstract deleteLabel(name: string): Promise<boolean>;

  abstract createMilestone(
    title: string,
    state: string,
    description: string,
    due_on: string
  ): Promise<boolean>;

  abstract updateMilestone(
    milestone_id: number,
    title: string,
    state: string,
    description: string,
    due_on: string
  ): Promise<boolean>;

  abstract getMilestone(milestone_id: number): Promise<Milestone>;

  abstract getMilestoneLabels(
    milestone_id: number,
    per_page: number,
    page: number
  ): Promise<Array<any>>;

  abstract deleteMilestone(milestone_id: number): Promise<boolean>;

  //editIssue(id: number, title: string, body: string, state: string, milestone: number,
  //    labels: string[], assignees: string[]): boolean;

  abstract lock(lock_reason: string): Promise<boolean>;

  abstract unlock(): Promise<boolean>;

  // Properties
  public id: number;
  public url: string;
  public repository_url: string;
  // The URL should end with "{/name}". That needs to be replaced with the
  // name of the label for the URL to work.
  public labels_url: string;
  public comments_url: string;
  public events_url: string;
  public html_url: string;
  public inumber: number;
  public state: IssueState;
  public title: string;
  public body: string;
  public user: User;
  public labels: Array<Label>;
  public assignees: Array<User>;
  public milestone: Milestone;
  public locked: boolean;
  public active_lock_reason: string;
  public num_comments: number;
  public corresponding_pr: PRCorrespondingWithIssue;
  public created_at: string;
  public closed_at: string; // Should be null by default
  public updated_at: string;
  // Repo Info
  public org: string;
  public repo: string;

  protected opts: Github.Options;
}
