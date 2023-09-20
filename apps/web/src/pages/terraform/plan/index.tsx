import { Container } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { filterChanges, logger, type TerraformPlan as TFPlan } from "shared";
import { BusyContext } from "../../../components/busy";
import { TerraformService } from "../../../service/terraform-service";
import { Action } from "./components/action";
import { ResourceTable } from "./components/table";

export const TerraformPlan: React.FC<object> = () => {
    const { setBusy } = useContext(BusyContext);
    const [plan, setPlan] = useState<TFPlan>();

    const refresh = (): void => {
        setBusy(true);
        TerraformService.getPlan()
            .then(v => setPlan(v))
            .catch(() => logger.error('unable to get plan data'))
            .finally(() => setBusy(false));
    }

    const runPlan = (): void => {
        TerraformService.plan()
            .catch(() => logger.error('Unable to run plan'));
    }

    useEffect(() => {
        refresh();
    }, [])


    return <Container>
        <Action onPlanClick={runPlan} onRefreshClick={refresh} />
        <ResourceTable resourceChanges={filterChanges(plan)} />
    </Container>
}