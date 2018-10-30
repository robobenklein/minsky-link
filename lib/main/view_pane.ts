
import "atom";
import * as github_get_names from "../github/get_names"
import * as github_issue from "../github/github_issue"

//@ts-ignore
import * as etch from "etch";

export class MinskyEtchPane {

  reposlug: string[];
  issue_number: number;
  htmlcontainer: HTMLElement;

  promise_for_github_issue: Promise<github_issue.GitHubIssue>;

  //@ts-ignore
  constructor (props, children) {
    this.reposlug = github_get_names.getRepoNames()
    this.issue_number = props["issue_number"];
    this.promise_for_github_issue = github_issue.getGitHubIssue(this.reposlug[0], this.reposlug[1], this.issue_number);
    this.htmlcontainer = document.createElement("div");
    this.htmlcontainer.innerHTML = "Loading Issue information...";

    this.promise_for_github_issue.then(github_issue_result => {
      this.htmlcontainer.innerHTML = "";
      this.htmlcontainer.innerHTML += "<p>User <b>" + github_issue_result.user.login + "</b> wrote: </p>";
      this.htmlcontainer.innerHTML += github_issue_result.body;

      var promise_for_github_issue_comments = github_issue_result.getAllComments("");
      promise_for_github_issue_comments.then(github_issue_comments_result => {
        for (var github_issue_comment_result of github_issue_comments_result ) {
          this.htmlcontainer.appendChild(
            document.createElement(github_issue_comment_result.body)
          );
        }
      });
    });

    this.promise_for_github_issue.catch(github_issue_result => {
      this.htmlcontainer.innerHTML = "Failed to get issue info!";
      this.htmlcontainer.appendChild(document.createElement('div').innerHTML = github_issue_result.message)
    });

    etch.initialize(this);
  }

  getTitle (): String {
    return "Minsky Link Viewer!";
  }

  render () {
    return this.htmlcontainer;
  }

  //@ts-ignore
  update (props, children) {
    return etch.update(this);
  }

  async destroy () {
    await etch.destroy(this);
  }
}

export class MinskyEtchPaneView {

  element: HTMLElement;
  uri: String | null;

  internal_etch_renderer: MinskyEtchPane;

  // @ts-ignore
  constructor(serializedState ? : any, uri ? : String) {
    this.element = document.createElement('div');
    this.uri = uri || "minsky://minsky-link/0";
    this.element.innerHTML = "Hello Minsky!<br>My URI is " + uri;
    var issue_number = parseInt(this.uri.split('/')[this.uri.split('/').length - 1]);
    console.log("Creating new Etch Renderer for issue #" + issue_number);
    this.internal_etch_renderer = new MinskyEtchPane({
      issue_number: issue_number
    }, []);
  }

  getTitle() {
    return "Minsky Link Something";
  }

  getURI() {
    return this.uri;
  }

  serialize() {
    return {
      deserializer: "minsky-link/MinskyEtchPaneView"
    };
  }
  destroy() {
    this.element.remove();
  }
  getElement() {
    return this.internal_etch_renderer.render();
  }
}

atom.workspace.addOpener(uri => {
  console.log("Opener checking URI \"" + uri + "\"");
  if (uri.startsWith("minsky://")) {
    return new MinskyEtchPaneView(null, uri);
  }
});
