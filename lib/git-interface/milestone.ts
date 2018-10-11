import { User } from "./user";

export enum M_State {
  Open = "open",
  Closed = "closed"
}

export class Milestone {
  // Members
  public url: string;
  public html_url: string;
  public labels_url: string;
  public id: number;
  public mnumber: number;
  public mtitle: string;
  public state: M_State;
  public description: string;
  public creator: User;
  public open_issues: number;
  public closed_issues: number;
  public created_at: string;
  public closed_at: string;
  public due_on: string;

  constructor(
    url: string,
    html_url: string,
    labels_url: string,
    id: number,
    cnumber: number,
    title: string,
    state = M_State.Open,
    description = "",
    creator = new User(),
    open_issues = 0,
    closed_issues = 0,
    created_at = "",
    closed_at = "",
    due_on = ""
  ) {
    this.url = url;
    this.html_url = html_url;
    this.labels_url = labels_url;
    this.id = id;
    this.mnumber = cnumber;
    this.mtitle = title;
    this.state = state;
    this.description = description;
    this.creator = creator;
    this.open_issues = open_issues;
    this.closed_issues = closed_issues;
    this.created_at = created_at;
    this.closed_at = closed_at;
    this.due_on = due_on;
  }
}
