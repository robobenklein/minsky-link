export class User
{
    public login: string;
    public id: number;
    public avatar_url: string;
    public gravatar_id: string;
    public url: string;
    public html_url: string;
    public events_url: string;
    public received_events_url: string;
    public utype: string;
    public site_admin: boolean;

    constructor(login="", id=-1, avatar_url="", gravatar_id="", url="",
                html_url="", events_url="", received_events_url="", utype="",
                site_admin=false)
    {
        this.login = login;
        this.id = id;
        this.avatar_url = avatar_url;
        this.gravatar_id = gravatar_id;
        this.url = url;
        this.html_url = html_url;
        this.events_url = events_url;
        this.received_events_url = received_events_url;
        this.utype = utype;
        this.site_admin = site_admin;
    }
}
