import { TerraformPlan } from "shared";
import { api } from "../utils/http";

export const TerraformService = (() => {
    const plan = (): Promise<void> => api.put('/terraform/plan');
    const getPlan = (): Promise<TerraformPlan> => api.get('/terraform/plan').then(v => v.data as TerraformPlan);

    return {
        plan,
        getPlan,
    }
})();