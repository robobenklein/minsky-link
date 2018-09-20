export class Milestone
{
    // Members
    public owner: string;
    public repo: string;
    public mtitle: string;
    public state: string;
    public description: string;
    public due_on: string;

    constructor(owner: string, repo: string, title: string, state="open",
        description="", due_on="")
    {
        this.owner = owner; this.repo = repo; this.mtitle = title;
        this.state = state; this.description = description; this.due_on = due_on;
    }
}
