export class Label {
  // Parameters
  public id: number;
  public url: string;
  public name: string;
  public color: string;
  public description: string;
  public ldefault: boolean;
  // Repo Info
  public org: string;
  public repo: string;
  // Constructor
  constructor(
    c_id: number,
    c_url: string,
    c_name: string,
    c_color: string,
    org: string,
    repo: string,
    c_description = "",
    c_default = true
  ) {
    this.name = c_name;
    this.id = c_id;
    this.color = c_color;
    this.description = c_description;
    this.url = c_url;
    this.ldefault = c_default;
    this.org = org;
    this.repo = repo;
  }
}
