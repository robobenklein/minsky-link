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

export interface Issue {
  // Properties
  id: number;
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  inumber: number;
  state: IssueState;
  title: string;
  body: string;
  user: User;
  labels: Label[];
  assignees: User[];
  milestone: Milestone;
  locked: boolean;
  active_lock_reason: string;
  num_comments: number;
  corresponding_pr: PRCorrespondingWithIssue;
  created_at: string;
  closed_at: string; // Should be null by default
  updated_at: string;
  closed_by: User;
  // Repo Info
  org: string;
  repo: string;

  opts: Github.Options;

  // Functions

  // Turn into Constructor for Implementations
  // createIssue(title: string, body: string, milestone: number, labels: string[],
  //    assignees: string[]): boolean;

  addAssignees(assignees: string[]): Promise<boolean>;

  getAvailableAssignees(per_page: number, page: number): Promise<User[]>;

  checkAssignability(assignee: string): Promise<boolean>;

  removeAssignees(assignees: string[]): Promise<boolean>;

  createComment(body: string): Promise<GitComment>;

  editComment(comment_id: number, body: string): Promise<GitComment>;

  getComment(
    comment_id: number,
    per_page: number,
    page: number
  ): Promise<GitComment>;

  getAllComments(
    since: string,
    per_page: number,
    page: number
  ): Promise<GitComment[]>;

  deleteComment(comment_id: number): Promise<boolean>;

  createLabel(
    name: string,
    color: string,
    description?: string
  ): Promise<Label>;

  updateLabel(
    current_name: string,
    new_name?: string,
    new_color?: string,
    new_description?: string
  ): Promise<Label>;

  replaceAllLabels(labels: string[]): Promise<Label[]>;

  removeLabel(name: string): Promise<boolean>;

  removeAllLabels(): Promise<boolean>;

  getAllLabels(per_page: number, page: number): Promise<Label[]>;

  getLabel(name: string): Promise<Label>;

  addLabels(labels: string[]): Promise<Label[]>;

  deleteLabel(name: string): Promise<boolean>;

  createMilestone(
    title: string,
    description?: string,
    due_on?: string,
    state?: M_State
  ): Promise<Milestone>;

  updateMilestone(
    milestone_id: number,
    title?: string,
    description?: string,
    due_on?: string,
    state?: M_State
  ): Promise<Milestone>;

  getMilestone(milestone_id: number): Promise<Milestone>;

  getMilestoneLabels(
    milestone_id: number,
    per_page: number,
    page: number
  ): Promise<Label[]>;

  deleteMilestone(milestone_id: number): Promise<boolean>;

  // editIssue(id: number, title: string, body: string, state: string, milestone: number,
  //    labels: string[], assignees: string[]): boolean;

  lock(lock_reason: LockReason): Promise<boolean>;

  unlock(): Promise<boolean>;
}
