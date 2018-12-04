"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(login = "", id = -1, avatar_url = "", gravatar_id = "", url = "", html_url = "", events_url = "", received_events_url = "", utype = "", site_admin = false) {
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
exports.User = User;
class Team {
    constructor(id = 0, url = "", name = "", slug = "", description = "", privacy = "", permission = "", members_url = "", repositories_url = "") {
        this.id = id;
        this.url = url;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.privacy = privacy;
        this.permission = permission;
        this.members_url = members_url;
        this.repositories_url = repositories_url;
    }
}
exports.Team = Team;
//# sourceMappingURL=user.js.map