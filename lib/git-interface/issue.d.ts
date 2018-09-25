import { Label } from "./label";
import { Milestone } from "./milestone"

export interface Issue
{
    // Functions
    
    // Turn into Constructor for Implementations
    //createIssue(title: string, body: string, milestone: number, labels: string[],
    //    assignees: string[]): boolean;

    addAssignees(assignees: string[]): boolean;

    getAvailableAssignees(per_page: number, page: number): any;

    checkAssignability(assignee: string): boolean;

    removeAssignees(assignees: string[]): boolean;

    createComment(body: string): boolean;

    editComment(comment_id: string, body: string): boolean;

    getComment(comment_id: string, per_page: number, page: number): any;

    getAllComments(since: string, per_page: number, page: number): Array<any>;

    deleteComment(comment_id: string): boolean;

    createLabel(name: string, color: string, description: string): boolean;

    updateLabel(current_name: string, new_name: string, 
        new_color: string, new_description: string): boolean;

    replaceAllLabels(labels: string[]): boolean;

    removeLabel(name: string): boolean;

    removeAllLabels(): boolean;

    getAllLabels(per_page: number, page: number): Array<Label>;

    getLabel(name: string): Label;

    addLabels(labels: string[]): boolean;

    deleteLabel(name: string): boolean;

    createMilestone(title: string, state: string, description: string, 
        due_on: string): boolean;

    updateMilestone(milestone_id: number, title: string, state: string, 
        description: string, due_on: string): boolean;

    getMilestone(milestone_id: number): any;

    getMilestoneLabels(milestone_id: number, per_page: number, page: number): Array<any>;

    deleteMilestone(milestone_id: number): boolean;

    //getIssue(id: number): any;

    //editIssue(id: number, title: string, body: string, state: string, milestone: number,
    //    labels: string[], assignees: string[]): boolean;

    lock(lock_reason: string): boolean;

    unlock(): boolean;

    // Properties
    owner: string;
    repo: string;
    id: number;
}
