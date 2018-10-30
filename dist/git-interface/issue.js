"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PRCorrespondingWithIssue {
    constructor(url = "", html_url = "", diff_url = "", patch_url = "") {
        this.url = url;
        this.html_url = html_url;
        this.diff_url = diff_url;
        this.patch_url = patch_url;
    }
}
exports.PRCorrespondingWithIssue = PRCorrespondingWithIssue;
var IssueState;
(function (IssueState) {
    IssueState["Open"] = "open";
    IssueState["Closed"] = "closed";
    IssueState["All"] = "all";
})(IssueState = exports.IssueState || (exports.IssueState = {}));
var LockReason;
(function (LockReason) {
    LockReason["OffTopic"] = "off-topic";
    LockReason["TooHeated"] = "too heated";
    LockReason["Resolved"] = "resolved";
    LockReason["Spam"] = "spam";
})(LockReason = exports.LockReason || (exports.LockReason = {}));
class Issue {
    constructor() {
        this.opts = { baseUrl: "https://api.github.com" };
    }
}
exports.Issue = Issue;
//# sourceMappingURL=issue.js.map