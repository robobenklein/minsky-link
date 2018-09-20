export class Label
{
    // Parameters
    public owner: string;
    public repo: string;
    public name: string;
    public color: string;
    public description: string;
    // Constructor
    constructor(c_owner: string, c_repo: string, c_name: string, 
        c_color: string, c_description="")
    {
        this.owner = c_owner; this.repo = c_repo; this.name = c_name; 
        this.color = c_color; this.description = c_description;
    }
}
