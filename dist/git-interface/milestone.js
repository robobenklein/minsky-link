"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
var M_State;
(function (M_State) {
    M_State["Open"] = "open";
    M_State["Closed"] = "closed";
})(M_State = exports.M_State || (exports.M_State = {}));
class Milestone {
    constructor(url, html_url, labels_url, id, cnumber, title, state = M_State.Open, description = "", creator = new user_1.User(), open_issues = 0, closed_issues = 0, created_at = "", closed_at = "", due_on = "") {
        this.url = url;
        this.html_url = html_url;
        this.labels_url = labels_url;
        this.id = id;
        this.mnumber = cnumber;
        this.mtitle = title;
        this.state = state;
        this.description = description;
        this.creator = creator;
        this.open_issues = open_issues;
        this.closed_issues = closed_issues;
        this.created_at = created_at;
        this.closed_at = closed_at;
        this.due_on = due_on;
    }
}
exports.Milestone = Milestone;
//# sourceMappingURL=milestone.js.map