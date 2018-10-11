"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pr_Event;
(function (Pr_Event) {
    Pr_Event["Approve"] = "APPROVE";
    Pr_Event["RequestChange"] = "REQUEST_CHANGES";
    Pr_Event["MakeComment"] = "COMMENT";
})(Pr_Event = exports.Pr_Event || (exports.Pr_Event = {}));
var Pr_State;
(function (Pr_State) {
    Pr_State["Appr"] = "APPROVED";
    Pr_State["Pend"] = "PENDING";
    Pr_State["Change"] = "CHANGES_REQUESTED";
    Pr_State["Dissmiss"] = "DISMISSED";
})(Pr_State = exports.Pr_State || (exports.Pr_State = {}));
class Review {
    constructor(pr_id, user, body, commit_id, html_url, pr_url, state = Pr_State.Pend) {
        this.pr_id = pr_id;
        this.user = user;
        this.body = body;
        this.commit_id = commit_id;
        this.html_url = html_url;
        this.pull_request_url = pr_url;
        this.state = state;
    }
}
exports.Review = Review;
//# sourceMappingURL=review.js.map