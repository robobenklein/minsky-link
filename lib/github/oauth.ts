import * as os from "os";
import * as fs from "fs";
//@ts-ignore
import * as electron from "electron";
//import { BrowserWindow } from "electron";
//import * as octokitRequest from "@octokit/request";
import * as request from "request";
import * as Github from "@octokit/rest";

type TokenType = {
    access_token: string;
    scope: string[];
    token_type: string;
};

export class GitHubOauth
{
    private token: TokenType;
    private windowwidth: number;
    private windowheight: number;
    //private node_integration: boolean;
    private wind: electron.remote.BrowserWindow;
    private opts: Github.Options;
    private rand: string;
    public validated: -1 | 0 | 1;
    public got_token: boolean;
    //@ts-ignore
    public token_promise: Promise<boolean>;
    //@ts-ignore
    public valid_promise: Promise<boolean>;
    readonly options = {
        client_id: "64d64dd2f6e739cd0121",
        client_secret: "205d1c3992920ce068cbbdadccfb19ec91c4193d",
        scopes: ["repo", "read:org", "user:email"]
    };

    constructor(opts: Github.Options, width=800, height=800)//, node_integration=false)
    {
        // Set token to default value
        this.opts = opts;
        this.validated = -1;
        this.got_token = false;
        this.rand = "";
        this.token = {access_token: "", scope: [""], token_type: ""} as TokenType;
        this.windowwidth = width;
        this.windowheight = height;
        //@ts-ignore
        this.token_promise = new Promise<boolean>((resolve, reject) => {});
        //@ts-ignore
        this.valid_promise = new Promise<boolean>((resolve, reject) => {});
        //this.node_integration = node_integration;
    }

    private handle_oauth_callback(url: string): void
    {
        console.log("URL:", url)
        const rawcode = /code=([^&]*)/.exec(url) || null;
        console.log("Rawcode:", rawcode);
        const returncode = (rawcode && rawcode.length > 1) ? rawcode[1] : null;
        console.log("Return Code 1:", returncode);
        const error = /\?error=(.+)$/.exec(url);
        console.log("Cback Error:", error);
        if (returncode)
        {
            this.get_token(returncode);
        }
        else if (error)
        {
            alert("Error occurred in authorization. Please try again");
        }
        if (returncode || error)
        {
            console.log("Destroy Window");
            this.wind.destroy();
        }
    }

    private set_token(error: any, response: any, body: any): void
    {
        console.log("error:", error);
        console.log("body:", body);
        console.log("response:", response);
        if (response.statusCode >= 400)
        {
            throw new Error("HTML Error:" + response.statusCode + response.statusMessage);
        }
        var token_start = 13;
        const token_end = body.indexOf("&", token_start);
        this.token.access_token = body.slice(token_start, token_end);
        this.token.scope = this.options.scopes;
        token_start = body.lastIndexOf("=")
        this.token.token_type = body.slice(token_start+1);
        this.got_token = true;
        console.log("got_token is", this.got_token);
        this.write_token_to_file();
        this.token_promise = Promise.resolve(this.got_token);
        // XML not supported
    }

    private get_token(returncode: string): void
    {
        console.log("Return Code is", returncode);
        console.log("Client ID:", this.options.client_id);
        console.log("Client Secret:", this.options.client_secret);
        request.post({
                uri: "https://github.com/login/oauth/access_token?" +
                     "accept=application/json" + 
                     "&client_id=" + this.options.client_id + "&client_secret=" + this.options.client_secret
                     + "&code=" + returncode + "&state=" + this.rand
            },
            (error: any, response: any, body: any) => this.set_token(error, response, body)     
        )
        return;
    }

    public request_authorization(): Promise<boolean>
    {
        if ( this.read_token_from_file() === true )
        {
            this.token_promise = Promise.resolve(true);
            return this.token_promise;
        }
        this.wind = new electron.remote.BrowserWindow({
            width: this.windowwidth,
            height: this.windowheight,
            show: false
        });
        this.rand = Math.random().toString(36).slice(2);
        const githubURL = "https://github.com/login/oauth/authorize?";
        var authURL = githubURL + "client_id=" + this.options.client_id + 
                      "&scope=" + this.options.scopes + "&state=" + this.rand;
        console.log(authURL);
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
        return this.token_promise;
    }

    public authenticate(): void
    {
        const gh: Github = new Github(this.opts);
        gh.authenticate({type: "oauth", token: this.token.access_token});
    }

    private set_validated(error: any, response: any, body: any): void
    {
        console.log("Error:", error);
        console.log("Response:", response);
        console.log("Body:", body);
        if (response.statusCode === 200)
        {
            this.validated = 1;
        }
        else if (response.statusCode === 404)
        {
            this.validated = 0;
        }
        else
        {
            throw new Error("An error occurred during validation.\n  Code:" + response.statusCode +response.statusMessage);
        }
        this.valid_promise = Promise.resolve(this.validated === 1)
    }

    public validate(): Promise<boolean>
    {
        console.log("Validation: Access Token:", this.token.access_token);
        request.get({
                uri: "https://api.github.com/applications/" + this.options.client_id +
                     "/tokens/" + this.token.access_token,
                headers: {
                    'User-Agent': "team-minsky"
                }
            },
            (error: any, response: any, body: any) => this.set_validated(error, response, body)     
        )
        console.log("Handling validation");
        return this.valid_promise;
    }
    
    private read_token_from_file(): boolean
    {
        var fpath: string = os.homedir();
        if (os.platform() === "win32")
        {
            fpath += "\\.minsky_github_oauth_token.json";
        }
        else
        {
            fpath += "/.minsky_github_oauth_token.json";
        }
        if (!fs.existsSync(fpath))
        {
            return false;
        }
        const contents = fs.readFileSync(fpath, "utf8");
        this.token = JSON.parse(contents) as TokenType;
        return (this.token.access_token !== "");
    }
    
    private write_token_to_file(): void
    {
        var fpath: string = os.homedir();
        if (os.platform() === "win32")
        {
            fpath += "\\.minsky_github_oauth_token.json";
        }
        else
        {
            fpath += "/.minsky_github_oauth_token.json";
        }
        if (fs.existsSync(fpath))
        {
            const contents = JSON.parse(fs.readFileSync(fpath, "utf8")) as TokenType;
            if (contents.access_token === this.token.access_token)
            {
                return;
            }
        }
        const data = JSON.stringify(this.token);
        fs.writeFileSync(fpath, data, {mode: 0o660, flag: "w"});
    }

    public print_token(): void
    {
        console.log("Access Token:", this.token.access_token);
        console.log("Scopes:", this.token.scope);
        console.log("Token Type:", this.token.token_type);
    }
}
