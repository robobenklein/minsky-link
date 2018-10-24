import { PRCorrespondingWithIssue, IssueState, Issue } from "../git-interface/issue"
import { GitComment } from "../git-interface/comment"
import { Label } from "../git-interface/label"
import { M_State, Milestone } from "../git-interface/milestone"
import { User } from "../git-interface/user"

import * as Github from "../../node_modules/@octokit/rest/index"

export enum LockReason
{
    OffTopic = "off-topic",
    TooHeated = "too heated",
    Resolved = "resolved",
    Spam = "spam"
}

export class GitHubIssue extends Issue
{
    constructor(id: number, title: string, url="", repository_url="", labels_url="",
        comments_url="", events_url="", html_url="", inumber=0, state=IssueState.Open,
        body="", user=new User(), labels=new Array<Label>(), assignees=new Array<User>(), 
        milestone=new Milestone(),locked=false, active_lock_reason="", num_comments=0,
        corresponding_pr=new PRCorrespondingWithIssue(), created_at="", closed_at="",
        updated_at="")
    {
        super();
        this.id=id; this.title=title; this.url=url; this.repository_url=repository_url;
        this.labels_url=labels_url; this.comments_url=comments_url; 
        this.events_url=events_url; this.html_url=html_url; this.inumber=inumber;
        this.state=state; this.body=body; this.user=user; this.labels=labels;
        this.assignees=assignees; this.milestone=milestone; this.locked=locked;
        this.active_lock_reason=active_lock_reason; this.num_comments=num_comments;
        this.corresponding_pr=corresponding_pr, this.created_at=created_at;
        this.closed_at=closed_at; this.updated_at=updated_at;
    }

    // All functions use async/await

    async addAssignees(assignees: string[]): Promise<boolean>
    {
        var gh = new Github(this.opts);
        var ret: boolean;
        const result = await gh.issues.addAssigneesToIssue(
            {owner: this.org, repo: this.repo, number: this.id, assignees: assignees});
        ret = (result.status >= 200 && result.status < 205);
        return new Promise<boolean>(resolve => resolve(ret));
    }

    async getAvailableAssignees(per_page=30, page=1): Promise<Array<User>>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.getAssignees({owner: this.org, repo: this.repo,
            per_page: per_page, page: page});
        var data: Array<any>;
        if (result.status >= 200 && result.status < 205)
        {
            data = result.data;
        }
        else 
        { 
            return new Promise<Array<User>>((resolve, reject) => 
                {reject(new Error("HTML Request failed."))})
        }
        var final_data = new Array<User>();
        for (var us of data)
        {
            var fus = new User(us.login, us.id, us.avatar_url, us.gravatar_id,
                               us.url, us.html_url, us.events_url, us.received_events_url,
                               us.type, us.site_admin);
            final_data.push(fus);
        }
        return new Promise<Array<User>>(resolve => {resolve(final_data);});
    }

    async checkAssignability(assignee: string): Promise<boolean>
    {
        var gh = new Github(this.opts);
        const result = await gh.issues.checkAssignee({owner: this.org, 
            repo: this.repo, assignee: assignee});
        return new Promise<boolean>((resolve) => 
            {resolve((result.status == 204))});
    }

    async removeAssignees(assignees: string[]): Promise<boolean>
    {
        var gh = new Github(this.opts);
        const result = await gh.issues.removeAssigneesFromIssue({owner: this.org,
                             repo: this.repo, number: this.id, assignees: assignees});
        var data;
        if (result.status >= 200 && result.status < 205)
        {
            data = result.data;
        }
        else
        {
            return new Promise<boolean>((resolve, reject) => 
                {reject(new Error("HTML Request Failed"))});
        }
        if (data.id > 0)
        {
            return new Promise<boolean>((resolve) => {resolve(true)});
        }
        else
        {
            return new Promise<boolean>((resolve) => {resolve(false)});
        }
    }
  
    async createComment(body: string): Promise<GitComment>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.createComment({owner: this.org, repo: this.repo,
                             number: this.id, body: body});
        var data;
        if (result.status >= 200 && result.status < 205)
        {
            data = result.data;
        }
        else
        {
            return new Promise<GitComment>((resolve, reject) => 
                {reject(new Error("HTML Request Failed"))});
        }
        var us: User = new User(data.user.login, data.user.id, data.user.avatar_url, 
                                data.user.gravatar_id, data.user.url, data.user.html_url, 
                                data.user.events_url, data.user.received_events_url,
                                data.user.type, data.user.site_admin);
        var comment = new GitComment(data.body, this.org, this.repo, data.id, 
                                     data.url, data.html_url, us, data.created_at, 
                                     data.updated_at);
        return new Promise<GitComment>((resolve) => {resolve(comment)});
    }
  
    async editComment(comment_id: number, body: string): Promise<GitComment>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.editComment({owner: this.org, repo: this.repo,
            comment_id: comment_id, body: body});
        var data;
        if (result.status >= 200 && result.status < 205)
        {
            data = result.data;
        }
        else
        {
            return new Promise<GitComment>((resolve, reject) => 
                {reject(new Error("HTML Request Failed"))});
        }
        var us: User = new User(data.user.login, data.user.id, data.user.avatar_url, 
                                data.user.gravatar_id, data.user.url, data.user.html_url, 
                                data.user.events_url, data.user.received_events_url,
                                data.user.type, data.user.site_admin);
        var comment = new GitComment(data.body, this.org, this.repo, data.id, 
                                     data.url, data.html_url, us, data.created_at, 
                                     data.updated_at);
        return new Promise<GitComment>((resolve) => {resolve(comment)});
    }
  
    async getComment(comment_id: number, per_page: number, page: number): Promise<GitComment>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.getComment({owner: this.org, repo: this.repo,
            comment_id: comment_id, per_page: per_page, page: page});
        var data;
        if (result.status >= 200 && result.status < 205)
        {
            data = result.data;
        }
        else
        {
            return new Promise<GitComment>((resolve, reject) => 
                {reject(new Error("HTML Request Failed"))});
        }
        var us: User = new User(data.user.login, data.user.id, data.user.avatar_url, 
                                data.user.gravatar_id, data.user.url, data.user.html_url, 
                                data.user.events_url, data.user.received_events_url,
                                data.user.type, data.user.site_admin);
        var comment = new GitComment(data.body, this.org, this.repo, data.id, 
                                     data.url, data.html_url, us, data.created_at, 
                                     data.updated_at);
        return new Promise<GitComment>((resolve) => {resolve(comment)});
    }
  
    async getAllComments(
      since: string,
      per_page: number,
      page: number
    ): Promise<Array<GitComment>>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.getComments({owner: this.org, repo: this.repo,
            number: this.id, since: since, per_page: per_page, page: page});
        var data;
        if (result.status >= 200 && result.status < 205)
        {
            data = result.data;
        }
        else
        {
            return new Promise<Array<GitComment>>((resolve, reject) => 
                {reject(new Error("HTML Request Failed"))});
        }
        var comments = new Array<GitComment>();
        for (var resp of data)
        {
            var us: User = new User(resp.user.login, resp.user.id, resp.user.avatar_url, 
                                    resp.user.gravatar_id, resp.user.url, resp.user.html_url, 
                                    resp.user.events_url, resp.user.received_events_url,
                                    resp.user.type, resp.user.site_admin);
            var comment = new GitComment(resp.body, this.org, this.repo, resp.id, 
                                         resp.url, resp.html_url, us, resp.created_at, 
                                         resp.updated_at);
            comments.push(comment)
        }
        return new Promise<Array<GitComment>>((resolve) => {resolve(comments)});
    }
  
    async deleteComment(comment_id: number): Promise<boolean>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.deleteComment({owner: this.org, repo: this.repo,
                                                      comment_id: comment_id});
        return new Promise<boolean>((resolve) => {resolve(result.status == 204)});
    }
  
    async createLabel(name: string, color: string, description=""): Promise<Label>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.createLabel({owner: this.org, repo: this.repo,
                             name: name, color: color, description: description});
        var data;
        if (result.status >= 200 && result.status < 205)
        {
            data = result.data;
        }
        else
        {
            return new Promise<Label>((resolve, reject) => 
                {reject(new Error("HTML Request Failed"))});
        }
        var lab = new Label(data.id, data.url, data.name, data.color, this.org, 
                            this.repo, data.description, data.default)
        return new Promise<Label>((resolve) => {resolve(lab)});
    }
  
    async updateLabel(
      current_name: string,
      new_name="",
      new_color="",
      new_description=""
    ): Promise<Label>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.createLabel({owner: this.org, repo: this.repo,
                             current_name: current_name, name: new_name, 
                             color: new_color, description: new_description});
        var data;
        if (result.status >= 200 && result.status < 205)
        {
            data = result.data;
        }
        else
        {
            return new Promise<Label>((resolve, reject) => 
                {reject(new Error("HTML Request Failed"))});
        }
        var lab = new Label(data.id, data.url, data.name, data.color, this.org, 
                            this.repo, data.description, data.default)
        return new Promise<Label>((resolve) => {resolve(lab)});
    }
  
    async replaceAllLabels(labels: string[]): Promise<Array<Label>>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.replaceAllLabels({owner: this.org, repo: this.repo,
                             number: this.id, labels: labels});
        var data;
        if (result.status >= 200 && result.status < 205)
        {
            data = result.data;
        }
        else
        {
            return new Promise<Array<Label>>((resolve, reject) => 
                {reject(new Error("HTML Request Failed"))});
        }
        var labs = new Array<Label>();
        for (var l of data)
        {
            var lab = new Label(l.id, l.url, l.name, l.color, this.org, 
                                this.repo, l.description, l.default)
            labs.push(lab)
        }
        return new Promise<Array<Label>>((resolve) => {resolve(labs)});
    }
  
    async removeLabel(name: string): Promise<boolean>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.removeLabel({owner: this.org, repo: this.repo,
                             number: this.id, name: name});
        return new Promise<boolean>((resolve) => {resolve(result.status == 200)});
    }
  
    async removeAllLabels(): Promise<boolean>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.removeAllLabels({owner: this.org, repo: this.repo,
                             number: this.id});
        return new Promise<boolean>((resolve) => {resolve(result.status == 204)});
    }
  
    async getAllLabels(per_page: number, page: number): Promise<Array<Label>>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.getLabels({owner: this.org, repo: this.repo,
                             per_page: per_page, page: page});
        var data;
        if (result.status >= 200 && result.status < 205)
        {
            data = result.data;
        }
        else
        {
            return new Promise<Array<Label>>((resolve, reject) => 
                {reject(new Error("HTML Request Failed"))});
        }
        var labs = new Array<Label>();
        for (var l of data)
        {
            var lab = new Label(l.id, l.url, l.name, l.color, this.org, 
                                this.repo, l.description, l.default)
            labs.push(lab)
        }
        return new Promise<Array<Label>>((resolve) => {resolve(labs)});
    }
  
    async getLabel(name: string): Promise<Label>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.getLabel({owner: this.org, repo: this.repo,
                             name: name});
        var data;
        if (result.status >= 200 && result.status < 205)
        {
            data = result.data;
        }
        else
        {
            return new Promise<Label>((resolve, reject) => 
                {reject(new Error("HTML Request Failed"))});
        }
        var lab = new Label(data.id, data.url, data.name, data.color, this.org, 
                            this.repo, data.description, data.default)
        return new Promise<Label>((resolve) => {resolve(lab)});
    }
  
    async addLabels(labels: string[]): Promise<Array<Label>>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.addLabels({owner: this.org, repo: this.repo,
                             number: this.id, labels: labels});
        var data;
        if (result.status >= 200 && result.status < 205)
        {
            data = result.data;
        }
        else
        {
            return new Promise<Array<Label>>((resolve, reject) => 
                {reject(new Error("HTML Request Failed"))});
        }
        var labs = new Array<Label>();
        for (var l of data)
        {
            var lab = new Label(l.id, l.url, l.name, l.color, this.org, 
                                this.repo, l.description, l.default)
            labs.push(lab)
        }
        return new Promise<Array<Label>>((resolve) => {resolve(labs)});
    }
  
    async deleteLabel(name: string): Promise<boolean>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.deleteLabel({owner: this.org, repo: this.repo, name: name});
        return new Promise<boolean>((resolve) => {resolve(result.status == 204)});
    }

    async createMilestone(
      title: string,
      state=M_State.Open,
      description="",
      due_on=""
    ): Promise<Milestone>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.createMilestone({owner: this.org, repo: this.repo,
                             title: title, state: state, description: description, 
                             due_on: due_on});
        var data;
        if (result.status == 201)
        {
            data = result.data;
        }
        else
        {
            return new Promise<Milestone>((resolve, reject) => 
                {reject(new Error("HTML Request Failed"))});
        }
        var us = new User(data.creator.login, data.creator.id, data.creator.avatar_url,
                          data.creator.gravatar_id, data.creator.url, data.creator.html_url,
                          data.creator.events_url, data.creator.received_events_url,
                          data.creator.type, data.creator.site_admin);
        var mstate = (data.state == "open") ? M_State.Open : M_State.Closed;
        var mile = new Milestone(this.org, this.repo, data.url, data.html_url, data.labels_url,
                                 data.id, data.number, data.title, mstate, data.description,
                                 us, data.open_issues, data.closed_issues, data.created_at,
                                 data.closed_at, data.due_on);
        return new Promise<Milestone>((resolve) => {resolve(mile)});
    }
  
    async updateMilestone(
      milestone_id: number,
      title="",
      state=M_State.Open,
      description="",
      due_on=""
    ): Promise<Milestone>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.updateMilestone({owner: this.org, repo: this.repo,
                             number: milestone_id, title: title, state: state, 
                             description: description, due_on: due_on});
        var data;
        if (result.status == 200)
        {
            data = result.data;
        }
        else
        {
            return new Promise<Milestone>((resolve, reject) => 
                {reject(new Error("HTML Request Failed"))});
        }
        var us = new User(data.creator.login, data.creator.id, data.creator.avatar_url,
                          data.creator.gravatar_id, data.creator.url, data.creator.html_url,
                          data.creator.events_url, data.creator.received_events_url,
                          data.creator.type, data.creator.site_admin);
        var mstate = (data.state == "open") ? M_State.Open : M_State.Closed;
        var mile = new Milestone(this.org, this.repo, data.url, data.html_url, data.labels_url,
                                 data.id, data.number, data.title, mstate, data.description,
                                 us, data.open_issues, data.closed_issues, data.created_at,
                                 data.closed_at, data.due_on);
        return new Promise<Milestone>((resolve) => {resolve(mile)});
    }
  
    async getMilestone(milestone_id: number): Promise<Milestone>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.getMilestone({owner: this.org, repo: this.repo,
                             number: milestone_id});
        var data;
        if (result.status == 200)
        {
            data = result.data;
        }
        else
        {
            return new Promise<Milestone>((resolve, reject) => 
                {reject(new Error("HTML Request Failed"))});
        }
        var us = new User(data.creator.login, data.creator.id, data.creator.avatar_url,
                          data.creator.gravatar_id, data.creator.url, data.creator.html_url,
                          data.creator.events_url, data.creator.received_events_url,
                          data.creator.type, data.creator.site_admin);
        var mstate = (data.state == "open") ? M_State.Open : M_State.Closed;
        var mile = new Milestone(this.org, this.repo, data.url, data.html_url, data.labels_url,
                                 data.id, data.number, data.title, mstate, data.description,
                                 us, data.open_issues, data.closed_issues, data.created_at,
                                 data.closed_at, data.due_on);
        return new Promise<Milestone>((resolve) => {resolve(mile)});
    }
  
    async getMilestoneLabels(
      milestone_id: number,
      per_page: number,
      page: number
    ): Promise<Array<Label>>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.getMilestoneLabels({owner: this.org, repo: this.repo,
                             number: milestone_id, per_page: per_page, page: page});
        var data;
        if (result.status == 200)
        {
            data = result.data;
        }
        else
        {
            return new Promise<Array<Label>>((resolve, reject) => 
                {reject(new Error("HTML Request Failed"))});
        }
        var labs = new Array<Label>();
        for (var l of data)
        {
            var lab = new Label(l.id, l.url, l.name, l.color, this.org, 
                                this.repo, l.description, l.default)
            labs.push(lab)
        }
        return new Promise<Array<Label>>((resolve) => {resolve(labs)});
    }
  
    async deleteMilestone(milestone_id: number): Promise<boolean>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.deleteMilestone({owner: this.org, repo: this.repo, 
                             number: milestone_id});
        return new Promise<boolean>((resolve) => {resolve(result.status == 204)});
    }
  
    async lock(lock_reason=LockReason.Resolved): Promise<boolean>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.lock({owner: this.org, repo: this.repo,
                             number: this.id, lock_reason: lock_reason});
        return new Promise<boolean>((resolve) => {resolve(result.status == 204)});
    }
  
    async unlock(): Promise<boolean>
    {
        var gh = new Github(this.opts)
        const result = await gh.issues.unlock({owner: this.org, repo: this.repo, number: this.id})
        return new Promise<boolean>((resolve) => {resolve(result.status == 204)})
    }

}
