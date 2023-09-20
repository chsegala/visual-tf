/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import styled from "@emotion/styled";
import { ExpandMore } from "@mui/icons-material";
import type { IconButtonProps } from "@mui/material";
import { Box, Button, ButtonGroup, Divider, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import type { TerraformResourceChanges } from "shared";
import { ResourceModal } from "./resource-modal";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMoreWrapper = styled((props: ExpandMoreProps) => {
    const { expand: _expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    //@ts-expect-error
    transition: theme.transitions.create('transform', {
        //@ts-expect-error
        duration: theme.transitions.duration.shortest,
    }),
}));

interface ResourceProps {
    resource: TerraformResourceChanges
    complimentaryResources: TerraformResourceChanges[]
}

export const Resource: React.FC<ResourceProps> = ({ resource, complimentaryResources }) => {
    const getName = (res: TerraformResourceChanges): string => {
        return res.address
    }

    const [expanded, setExpanded] = useState(false);

    return (<Box sx={{ width: '100%', fontSize: "0.8em" }}>
        <Box sx={{ display: 'inline-flex', width: '100%', fontSize: "inherit" }}>
            <ButtonGroup fullWidth onClick={(): void => setExpanded(!expanded)} sx={{ textAlign: "left", fontSize: "inherit" }}>
                <Button fullWidth sx={{ textTransform: 'none', textAlign: "left", justifyContent: "flex-start", fontSize: "inherit" }} variant="text">
                    <Typography dir="rtl" fontSize="inherit" noWrap overflow="hidden">{getName(resource)}</Typography>
                </Button>
                <ExpandMoreWrapper expand={expanded} sx={{ fontSize: "inherit" }}>
                    <ExpandMore fontSize="inherit" />
                </ExpandMoreWrapper>
            </ButtonGroup>
        </Box>
        <Divider />
        <ResourceModal complimentaryResources={complimentaryResources} handleClose={(): void => setExpanded(false)} open={expanded} resource={resource} />
    </Box>)
}