export enum Pr_Event
{
    Approve = "APPROVE",
    RequestChange = "REQUEST_CHANGES",
    MakeComment = "COMMENT",
    Pending = "",
}

export class Review
{
    public owner: string;
    public repo: string;
    public pr_id: number;
    public body: string;
    public pr_event: Pr_Event;

    constructor(r_owner: string, r_repo: string, r_id: number, 
        r_body="", r_event=Pr_Event.Pending)
    {
        this.owner = r_owner;
        this.repo = r_repo;
        this.pr_id = r_id;
        this.body = r_body;
        this.pr_event = r_event;
    }
}
