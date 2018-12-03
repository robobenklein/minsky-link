import { BrowserWindow } from "electron";
import { octokitRequest } from "@octokit/request";
import * as Github from "@octokit/rest";

export type TokenType = {
    access_token: string;
    scope: string[];
    token_type: string;
};

export class GitHubOauth
{
    private token: TokenType;
    private windowwidth: number;
    private windowheight: number;
    private node_integration: boolean;
    private wind: BrowserWindow;
    private opts: Github.Options;
    public got_token: boolean;
    readonly options = {
        client_id: "client_id",
        client_secret: "client_secret",
        scopes: ["Add scopes later"]
    };

    constructor(opts: Github.Options, width=800, height=800, node_integration=false)
    {
        // Set token to default value
        this.opts = opts;
        this.got_token = false;
        this.token = {access_token: "", scope: [""], token_type: ""};
        this.windowwidth = width;
        this.windowheight = height;
        this.node_integration = node_integration;
    }

    private handle_oauth_callback(url: string): void
    {
        const rawcode = /code=([^&]*)/.exec(url) || null;
        const returncode = (rawcode && rawcode.length > 1) ? rawcode[1] : null;
        const error = /\?error=(.+)$/.exec(url);
        if (returncode || error)
        {
            this.wind.destroy();
        }
        if (returncode)
        {
            this.get_token(returncode);
        }
        else if (error)
        {
            alert("Error occurred in authorization. Please try again");
        }
    }

    private get_token(returncode: string): void
    {
        const header = {
            client_id: this.options.client_id,
            client_secret: this.options.client_secret,
            code: returncode,
            accept: "application/json"
        };
        const prom = octokitRequest("POST https://github.com/login/oauth/access_token", {
            headers: header
        });
        prom.then((headers: Object, code: number, data: any) => {
            console.log("Passed headers = ", header);
            console.log("Returned headers = ", headers);
            console.log("Response Status code = ", code);
            if (typeof data === "object")
            {
                this.token.access_token = data.access_token;
                this.token.scope = data.scope.split(",");
                this.token.token_type = data.token_type;
            }
            else if (typeof data === "string")
            {
                const token_start = 13;
                const token_end = data.indexOf("&", token_start);
                this.token.access_token = data.slice(token_start, token_end);
                this.token.scope = this.options.scopes;
                this.token.token_type = data.slice(token_end+12);
            }
            this.got_token = true;
            // XML not supported
        });
        prom.catch((err: Error) => {
            console.log("Error: could not get a token.\n  Message:", err.message);
        });
    }

    public request_authorization(): void
    {
        this.wind = new BrowserWindow({
            width: this.windowwidth,
            height: this.windowheight,
            show: false,
            "node-integration": this.node_integration
        });
        const githubURL = "https://github.com/login/oauth/authorize?";
        var authURL = githubURL + "client_id=" + this.options.client_id + 
                      "&scope=" + this.options.scopes;
        this.wind.loadURL(authURL);
        this.wind.show();
        this.wind.webContents.on("will-navigate", (event: any, url: string) => { 
            console.log("Event is", event);
            this.handle_oauth_callback(url); 
        });
        this.wind.webContents.on("did-get-redirect-request", 
            (event: any, oldUrl: string, newUrl: string) => { 
                console.log("Event is", event);
                console.log("Old URL is", oldUrl);
                this.handle_oauth_callback(newUrl); 
        });
        this.wind.on("close", () => {
            this.wind = null;
        }, false);
    }

    public authenticate(): void
    {
        const gh: Github = new Github(this.opts);
        gh.authenticate({type: "oauth", token: this.token.access_token});
    }

    // public check_if_already_authorized(): boolean
    // private read_token_from_file(): void
    // private write_token_to_file(): void
}
