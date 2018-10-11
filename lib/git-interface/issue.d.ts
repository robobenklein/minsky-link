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

export interface Issue {
  // Functions

  // Turn into Constructor for Implementations
  //createIssue(title: string, body: string, milestone: number, labels: string[],
  //    assignees: string[]): boolean;

  addAssignees(assignees: string[]): boolean;

  getAvailableAssignees(per_page: number, page: number): Array<User>;

  checkAssignability(assignee: string): boolean;

  removeAssignees(assignees: string[]): boolean;

  createComment(body: string): boolean;

  editComment(comment_id: string, body: string): boolean;

  getComment(comment_id: string, per_page: number, page: number): GitComment;

  getAllComments(
    since: string,
    per_page: number,
    page: number
  ): Array<GitComment>;

  deleteComment(comment_id: string): boolean;

  createLabel(name: string, color: string, description: string): boolean;

  updateLabel(
    current_name: string,
    new_name: string,
    new_color: string,
    new_description: string
  ): boolean;

  replaceAllLabels(labels: string[]): boolean;

  removeLabel(name: string): boolean;

  removeAllLabels(): boolean;

  getAllLabels(per_page: number, page: number): Array<Label>;

  getLabel(name: string): Label;

  addLabels(labels: string[]): boolean;

  deleteLabel(name: string): boolean;

  createMilestone(
    title: string,
    state: string,
    description: string,
    due_on: string
  ): boolean;

  updateMilestone(
    milestone_id: number,
    title: string,
    state: string,
    description: string,
    due_on: string
  ): boolean;

  getMilestone(milestone_id: number): Milestone;

  getMilestoneLabels(
    milestone_id: number,
    per_page: number,
    page: number
  ): Array<any>;

  deleteMilestone(milestone_id: number): boolean;

  //editIssue(id: number, title: string, body: string, state: string, milestone: number,
  //    labels: string[], assignees: string[]): boolean;

  lock(lock_reason: string): boolean;

  unlock(): boolean;

  // Properties
  id: number;
  url: string;
  repository_url: string;
  // The URL should end with "{/name}". That needs to be replaced with the
  // name of the label for the URL to work.
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  inumber: number;
  state: IssueState;
  title: string;
  body: string;
  user: User;
  labels: Array<Label>;
  assignees: Array<User>;
  milestone: Milestone;
  locked: boolean;
  active_lock_reason: string;
  num_comments: number;
  corresponding_pr: PRCorrespondingWithIssue;
  created_at: string;
  closed_at: string; // Should be null by default
  updated_at: string;
}
