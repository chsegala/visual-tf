export interface TerraformPlan {
    format_version: string;
    terraform_version: string;
    planned_values: any[];
    resource_drift: any[];
    resource_changes: TerraformResourceChanges[];
}

export interface TerraformResource {
    address: string;
    module_address: string;
    mode: string;
    type: string;
    name: string;
    index?: number;
}

export interface TerraformResourceChanges extends TerraformResource {
    change: {
        actions: string[];
        before: Record<string, string>;
        after: Record<string, string>;
    }
}