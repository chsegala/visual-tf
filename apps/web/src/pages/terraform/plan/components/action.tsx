import { Button, Toolbar } from "@mui/material";

interface ActionProperties {
    onPlanClick: () => void;
    onRefreshClick: () => void;
}

export const Action: React.FC<ActionProperties> = ({ onPlanClick, onRefreshClick }) => {

    return (
        <Toolbar>
            <Button variant="outlined" onClick={onPlanClick} >Plan</Button>
            <Button variant="outlined" onClick={onRefreshClick} >Refresh</Button>
        </Toolbar>
    )
}