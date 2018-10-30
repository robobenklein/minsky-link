import "atom";
import * as github_get_names from "../github/get_names";
import * as github_issue from "../github/github_issue";

//@ts-ignore
import * as etch from "etch";

export class MinskyEtchPane {
  reposlug: string[];
  issue_number: number;
  htmlcontainer: HTMLElement;

  promise_for_github_issue: Promise<github_issue.GitHubIssue>;

  //@ts-ignore
  constructor(props, children) {
    this.reposlug = github_get_names.getRepoNames();
    this.issue_number = props["issue_number"];
    this.promise_for_github_issue = github_issue.getGitHubIssue(
      this.reposlug[0],
      this.reposlug[1],
      this.issue_number
    );
    this.htmlcontainer = document.createElement("div");
    this.htmlcontainer.innerHTML = "Loading Issue information...";

    this.promise_for_github_issue.then(github_issue_result => {
      this.htmlcontainer.innerHTML =
        "\
      <style>p {\
        font-size: var(--editor-font-size);\
      }</style>";
      this.htmlcontainer.innerHTML +=
        '<h2><a href="' +
        github_issue_result.html_url +
        '">' +
        github_issue_result.title +
        "</a></h2>";
      this.htmlcontainer.innerHTML +=
        "<h6>Created: " + github_issue_result.created_at + "</h6>";
      var tmp_new_labels = "<h4>Labels: ";
      for (var some_label of github_issue_result.labels) {
        tmp_new_labels +=
          '<span style="    background-color: #' +
          some_label.color +
          ';\
    padding: 1px 5px;\
    border-radius: 3px;">' +
          some_label.name +
          "</span>, ";
      }
      tmp_new_labels += "</h4>";
      this.htmlcontainer.innerHTML += tmp_new_labels;
      this.htmlcontainer.innerHTML +=
        "<h3>User <a href=" +
        github_issue_result.user.html_url +
        "><b>" +
        github_issue_result.user.login +
        "</b></a> wrote: </h3>";
      this.htmlcontainer.innerHTML += github_issue_result.body;

      var promise_for_github_issue_comments = github_issue_result.getAllComments();
      promise_for_github_issue_comments.then(github_issue_comments_result => {
        for (var github_issue_comment_result of github_issue_comments_result) {
          this.htmlcontainer.appendChild(
            document.createElement(github_issue_comment_result.body)
          );
        }
      });
    });

    this.promise_for_github_issue.catch(github_issue_result => {
      this.htmlcontainer.innerHTML = "<h2>Failed to get issue info!</h2>";
      this.htmlcontainer.appendChild(
        (document.createElement("div").innerHTML = github_issue_result.message)
      );
    });

    etch.initialize(this);
  }

  getTitle(): String {
    return "Minsky Link #" + this.issue_number;
  }

  render() {
    return this.htmlcontainer;
  }

  //@ts-ignore
  update(props, children) {
    return etch.update(this);
  }

  async destroy() {
    await etch.destroy(this);
  }
}

export class MinskyEtchPaneView {
  element: HTMLElement;
  uri: String | null;

  internal_etch_renderer: MinskyEtchPane;

  // @ts-ignore
  constructor(serializedState?: any, uri?: String) {
    this.element = document.createElement("div");
    this.uri = uri || "minsky://minsky-link/0";
    this.element.innerHTML = "Hello Minsky!<br>My URI is " + uri;
    var issue_number = parseInt(
      this.uri.split("/")[this.uri.split("/").length - 1]
    );
    console.log("Creating new Etch Renderer for issue #" + issue_number);
    this.internal_etch_renderer = new MinskyEtchPane(
      {
        issue_number: issue_number
      },
      []
    );
  }

  getTitle() {
    return this.internal_etch_renderer.getTitle();
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
  console.log('Opener checking URI "' + uri + '"');
  if (uri.startsWith("minsky://")) {
    return new MinskyEtchPaneView(null, uri);
  }
});
