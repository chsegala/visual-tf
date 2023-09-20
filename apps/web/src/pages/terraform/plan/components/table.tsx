/* eslint-disable eslint-comments/disable-enable-pair */




import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid, List, ListItem, ListSubheader, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { groupBy, snakeCaseToHuman, type TerraformResourceChanges } from "shared";
import { Resource } from "./resource";

interface ResourceTableProps {
    resourceChanges: TerraformResourceChanges[]
}

const TypeResourceTable: React.FC<ResourceTableProps> = ({ resourceChanges: plan }) => {
    const getKey = (actions: string[]): string => {
        if (actions.includes('create') && actions.includes('delete')) {
            return 'replace';
        }
        return actions[0] || '_';
    }

    const [grouped, setGrouped] = useState<Record<string, TerraformResourceChanges[]>>({})
    const getComplimentary = (key: string): TerraformResourceChanges[] => {
        switch (key) {
            case "create": return grouped['delete'] || [];
            case "delete": return grouped['create'] || [];
            default: return [];
        }
    }

    useEffect(() => {
        setGrouped(groupBy(plan, (p) => getKey(p.change.actions)));
    }, [plan])

    return (<>
        {
            Object.entries(grouped).map(([key, _values]) => (
                <Grid item key={key} sm={12 / (Object.keys(grouped).length || 1)}>
                    <List dense
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader" >
                                <Typography sx={{ textTransform: "capitalize" }} variant="subtitle1" >{key} resources</Typography>
                                <Typography sx={{ fontSize: '0.7em' }} variant="subtitle2">{grouped[key].length} items</Typography>
                            </ListSubheader>
                        }
                        sx={{ width: '100%', bgcolor: 'background.paper' }}
                    >
                        <Divider />
                        {_values.map((v) => (
                            <ListItem key={v.address}>
                                <Resource complimentaryResources={getComplimentary(key)} resource={v} />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            ))
        }
        { }
    </>)
}

export const ResourceTable: React.FC<ResourceTableProps> = ({ resourceChanges: plan }) => {
    const [sorted, setSorted] = useState<Record<string, TerraformResourceChanges[]>>();

    useEffect(() => {
        const s = groupBy<TerraformResourceChanges>(plan, (item: TerraformResourceChanges) => item.type);
        setSorted(s)
    }, [plan])

    return (
        <>
            {
                Object.entries(sorted || {}).map(([key, values]) => (
                    <Accordion defaultExpanded key={key}>
                        <AccordionSummary expandIcon={<ExpandMore />} id={key}>
                            {snakeCaseToHuman(key)}
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container>
                                <TypeResourceTable resourceChanges={values} />
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))
            }
            {/* <TableContainer component={Paper}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Resource Type (count)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(sorted || {}).map(([key, values]) => (
                        <TableRow key={key}>
                            <TableCell>{snakeCaseToHuman(key)} - ({values.length})</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer> */}
        </>
    )
}