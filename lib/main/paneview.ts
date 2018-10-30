import {getGitHubIssue} from "../github/github_issue"

export default class paneview {

  constructor(url) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('Minsky');

    // Create message element
    //const content = document.createElement('div');
    const currentIssue = getGitHubIssue("utk-cs","team-minsky", url.substr(url.lastIndexOf("/") + 1));
    for (let i of currentIssue.getAllComments()) {
      const message = document.createElement('div');
      message.textContent = i.body;
      this.element.appendChild(message);
    }
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
