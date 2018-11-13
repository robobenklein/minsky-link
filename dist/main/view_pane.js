"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("atom");
const github_get_names = require("../github/get_names");
const github_issue = require("../github/github_issue");
//@ts-ignore
const etch = require("etch");
class MinskyEtchComment {
    constructor(props) {
        this.mycomment = props.GitCommentItem;
        this.human_readable = {
            created_at: new Date(this.mycomment.created_at).toString(),
        };
        etch.initialize(this);
    }
    render() {
        return `
      <div class="minsky-comment-item">
        <p>
          <a href="${this.mycomment.user.html_url}">
            <b>${this.mycomment.user.login}</b>
          </a> commented on ${this.human_readable.created_at}
        </p>
        <div class="minsky-comment-text">
          <p>${this.mycomment.body}</p>
        </div>
      </div>`;
    }
    //@ts-ignore
    update(props) {
        return etch.update(this);
    }
    async destroy() {
        await etch.destroy(this);
    }
}
class MinskyEtchPane {
    //@ts-ignore
    constructor(props, children) {
        this.reposlug = github_get_names.getRepoNames();
        this.issue_number = props["issue_number"];
        this.element = null;
        this.promise_for_github_issue = null;
        this.github_issue_data = null;
        this.promise_for_github_issue = github_issue.getGitHubIssue(this.reposlug[0], this.reposlug[1], this.issue_number);
        this.promise_for_github_issue.then(github_issue_result => {
            this.github_issue_data = github_issue_result;
            etch.update(this);
        });
        etch.initialize(this);
    }
    getTitle() {
        return "Minsky Link #" + this.issue_number;
    }
    render() {
        if (this.github_issue_data == null)
            return;
        return;
        /*
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
            "<h6>Created: " + new Date(github_issue_result.created_at).toString() + "</h6>";
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
              var thing = document.createElement("div");
              thing.innerHTML += "<p>User " + github_issue_comment_result.user.login + " wrote:</p>"
              thing.innerHTML += "<div style=\"padding-left: 10em;\">" + github_issue_comment_result.body + "</div>";
              this.htmlcontainer.appendChild(thing);
            }
          });
        });
    
        this.promise_for_github_issue.catch(github_issue_result => {
          this.htmlcontainer.innerHTML = "<h2>Failed to get issue info!</h2>";
          this.htmlcontainer.appendChild(
            (document.createElement("div").innerHTML = github_issue_result.message)
          );
        });
    
        return this.htmlcontainer;
    
        //*/
    }
    //@ts-ignore
    update(props, children) {
        return etch.update(this);
    }
    async destroy() {
        await etch.destroy(this);
    }
}
class MinskyEtchPaneView {
    // @ts-ignore
    constructor(serializedState, uri) {
        // this.element = document.createElement("div");
        this.uri = uri || "minsky://minsky-link/0";
        // this.element.innerHTML = "Hello Minsky!<br>My URI is " + uri;
        var issue_number = parseInt(this.uri.split("/")[this.uri.split("/").length - 1]);
        console.log("Creating new Etch Renderer for issue #" + issue_number);
        this.internal_etch_renderer = new MinskyEtchPane({
            issue_number: issue_number
        }, []);
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
        this.internal_etch_renderer.destroy();
    }
    getElement() {
        return this.internal_etch_renderer.element;
    }
}
exports.MinskyEtchPaneView = MinskyEtchPaneView;
atom.workspace.addOpener(uri => {
    console.log('Opener checking URI "' + uri + '"');
    if (uri.startsWith("minsky://")) {
        return new MinskyEtchPaneView(null, uri);
    }
});
//# sourceMappingURL=view_pane.js.map