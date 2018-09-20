interface Git
{
    // Functions
    createIssue(title: string, body: string, milestone: number, labels: string[],
        assignees: string[]): boolean;

    addAssignee(id: number, assignees: string[]): boolean;

    getAvailableAssignees(per_page: number, page: number): any;

    checkAssignability(assignee: string): boolean;

    removeAssignees(id: number, assignees: string[]): boolean;

    createComment(id: number, body: string): boolean;

    editComment(id: string, body: string): boolean;

    getComment(id: string, per_page: number, page: number): any;

    getAllComments(issue_id: number, since: string, per_page: number, page: number): Array<any>;

    getAllCommentsInRepo(sort: string, direction: string, since: string): Array<any>;

    deleteComment(comment_id: string): boolean;

    createLabel(name: string, color: string, description: string): boolean;

    updateLabel(current_name: string, new_name: string, 
        color: string, description: string): boolean;

    replaceAllLabels(id: number, labels: string[]): boolean;

    removeLabel(id: number, name: string): boolean;

    removeAllLabels(id: number): boolean;

    getAllLabels(id: number, per_page: number, page: number): Array<any>;

    getLabel(name: string): any;

    addLabels(id: number, labels: string[]): boolean;

    deleteLabel(name: string): boolean;

    createMilestone(title: string, state: string, description: string, 
        due_on: string): boolean;

    updateMilestone(id: number, title: string, state: string, 
        description: string, due_on: string): boolean;

    getMilestone(milestone_id: number): any;

    getMilestoneLabels(milestone_id: number, per_page: number, page: number): Array<any>;

    deleteMilestone(id: number): boolean;

    getIssue(id: number): any;

    editIssue(id: number, title: string, body: string, state: string, milestone: number,
        labels: string[], assignees: string[]): boolean;

    lock(id: number, lock_reason: string): boolean;

    unlock(id: number): boolean;

    // Properties
    owner: string;
    repo: string;
}
