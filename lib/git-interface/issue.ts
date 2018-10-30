import { GitComment } from "./comment";
import { Label } from "./label";
import { M_State, Milestone } from "./milestone";
import { User } from "./user";

import * as Github from "@octokit/rest";

export class PRCorrespondingWithIssue {
  public url: string;
  public html_url: string;
  public diff_url: string;
  public patch_url: string;

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

export enum LockReason {
  OffTopic = "off-topic",
  TooHeated = "too heated",
  Resolved = "resolved",
  Spam = "spam"
}

export abstract class Issue {
  // Properties
  public id!: number;
  public url!: string;
  public repository_url!: string;
  // The URL should end with "{/name}". That needs to be replaced with the
  // name of the label for the URL to work.
  public labels_url!: string;
  public comments_url!: string;
  public events_url!: string;
  public html_url!: string;
  public inumber!: number;
  public state!: IssueState;
  public title!: string;
  public body!: string;
  public user!: User;
  public labels!: Label[];
  public assignees!: User[];
  public milestone!: Milestone;
  public locked!: boolean;
  public active_lock_reason!: string;
  public num_comments!: number;
  public corresponding_pr!: PRCorrespondingWithIssue;
  public created_at!: string;
  public closed_at!: string; // Should be null by default
  public updated_at!: string;
  public closed_by!: User;
  // Repo Info
  public org!: string;
  public repo!: string;

  protected opts: Github.Options;

  constructor() {
    this.opts = { baseUrl: "https://api.github.com" };
  }
  // Functions

  // Turn into Constructor for Implementations
  // createIssue(title: string, body: string, milestone: number, labels: string[],
  //    assignees: string[]): boolean;

  public abstract addAssignees(assignees: string[]): Promise<boolean>;

  public abstract getAvailableAssignees(
    per_page: number,
    page: number
  ): Promise<User[]>;

  public abstract checkAssignability(assignee: string): Promise<boolean>;

  public abstract removeAssignees(assignees: string[]): Promise<boolean>;

  public abstract createComment(body: string): Promise<GitComment>;

  public abstract editComment(
    comment_id: number,
    body: string
  ): Promise<GitComment>;

  public abstract getComment(
    comment_id: number,
    per_page: number,
    page: number
  ): Promise<GitComment>;

  public abstract getAllComments(
    since?: string,
    per_page?: number,
    page?: number
  ): Promise<GitComment[]>;

  public abstract deleteComment(comment_id: number): Promise<boolean>;

  public abstract createLabel(
    name: string,
    color: string,
    description?: string
  ): Promise<Label>;

  public abstract updateLabel(
    current_name: string,
    new_name?: string,
    new_color?: string,
    new_description?: string
  ): Promise<Label>;

  public abstract replaceAllLabels(labels: string[]): Promise<Label[]>;

  public abstract removeLabel(name: string): Promise<boolean>;

  public abstract removeAllLabels(): Promise<boolean>;

  public abstract getAllLabels(
    per_page: number,
    page: number
  ): Promise<Label[]>;

  public abstract getLabel(name: string): Promise<Label>;

  public abstract addLabels(labels: string[]): Promise<Label[]>;

  public abstract deleteLabel(name: string): Promise<boolean>;

  public abstract createMilestone(
    title: string,
    description?: string,
    due_on?: string,
    state?: M_State
  ): Promise<Milestone>;

  public abstract updateMilestone(
    milestone_id: number,
    title?: string,
    description?: string,
    due_on?: string,
    state?: M_State
  ): Promise<Milestone>;

  public abstract getMilestone(milestone_id: number): Promise<Milestone>;

  public abstract getMilestoneLabels(
    milestone_id: number,
    per_page: number,
    page: number
  ): Promise<Label[]>;

  public abstract deleteMilestone(milestone_id: number): Promise<boolean>;

  // editIssue(id: number, title: string, body: string, state: string, milestone: number,
  //    labels: string[], assignees: string[]): boolean;

  public abstract lock(lock_reason: LockReason): Promise<boolean>;

  public abstract unlock(): Promise<boolean>;
}
