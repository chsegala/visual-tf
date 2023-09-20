import type { TerraformPlan, TerraformResourceChanges } from "../types/terraform/plan-return";

const allowedChanges = ['create', 'delete']

export const filterChanges = (changes?: TerraformPlan, filterFor = allowedChanges): TerraformResourceChanges[] => {
    if(!changes?.resource_changes) {
        return [];
    }

    const actionsIntersect = (actions: string[]): boolean => {
        for (const c of filterFor) {
            if (actions.includes(c)) {
                return true;
            }
        }
        return false;
    }
    return changes.resource_changes
        .filter((rc) => actionsIntersect(rc.change.actions));
}