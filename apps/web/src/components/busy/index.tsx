import { Backdrop, CircularProgress } from "@mui/material";
import React, { PropsWithChildren, createContext, useState } from "react";

const initState = { busy: false, setBusy: (_: boolean): void => { /**/ } };
export const BusyContext = createContext(initState);

// eslint-disable-next-line react/function-component-definition
export const BusyComponent: React.FC<PropsWithChildren<any>> = ({ children }) => {
    const [busy, setBusy] = useState(false);

    return <BusyContext.Provider value={{ busy, setBusy }}>
        <Backdrop open={busy} sx={{zIndex: 3000}}>
            <CircularProgress />
        </Backdrop>
        {children}
    </BusyContext.Provider>
}