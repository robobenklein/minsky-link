export class GitFile {
  public sha: string;
  public filename: string;
  public filestatus: string;
  public num_additions: number;
  public num_deletions: number;
  public num_changes: number;
  public blob_url: string;
  public raw_url: string;
  public contents_url: string;
  public patch: string;

  constructor(
    sha = "",
    filename = "",
    filestatus = "",
    num_additions = 0,
    num_deletions = 0,
    num_changes = 0,
    blob_url = "",
    raw_url = "",
    contents_url = "",
    patch = ""
  ) {
    this.sha = sha;
    this.filename = filename;
    this.filestatus = filestatus;
    this.num_additions = num_additions;
    this.num_deletions = num_deletions;
    this.num_changes = num_changes;
    this.blob_url = blob_url;
    this.raw_url = raw_url;
    this.contents_url = contents_url;
    this.patch = patch;
  }
}
