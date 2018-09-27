export class GitComment
{
    public owner: string;
    public repo: string;
    public issue_id: number;
    public id: string;
    public body: string;

    constructor(c_owner: string, c_repo: string, c_issid: number, c_id="", c_body: string)
    {
        this.owner = c_owner;
        this.repo = c_repo;
        this.issue_id = c_issid;
        this.id = c_id;
        this.body = c_body;
    }
}

export class GitPRComment extends GitComment
{
    public path: string;
    public diff_position: number;

    constructor(c_owner: string, c_repo: string, c_prid: number, c_id="", 
        c_body: string, c_path="", c_dposition=NaN)
    {
        super(c_owner, c_repo, c_prid, c_id, c_body);
        this.path = c_path;
        this.diff_position = c_dposition;
    }
}
