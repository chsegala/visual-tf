import { Box, Card, CardContent, Collapse, Dialog, DialogContent, DialogTitle, FormControl, FormGroup, FormLabel, InputLabel, List, ListItem, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import Ansi from 'ansi-to-react';
import React, { useEffect, useState } from 'react';
import type { TerraformResourceChanges } from 'shared';
import { logger, snakeCaseToHuman } from 'shared';
import { api } from '../../../../utils/http';

interface ResourceModalProps {
    open: boolean;
    handleClose: () => void;
    resource: TerraformResourceChanges;
    complimentaryResources: TerraformResourceChanges[];
}

export const ResourceModal: React.FC<ResourceModalProps> = ({ open, resource: main, complimentaryResources, handleClose }) => {
    const [diff, setDiff] = useState("");
    const [moveTo, setMoveTo] = useState("");

    const isDelete = (): boolean => main.change.actions[0] === 'delete';
    const handleChange = (evt: SelectChangeEvent<unknown>): void => {
        const value = evt.target.value;
        if (value) {
            setMoveTo(value as string);
        }
    }

    useEffect(() => {
        api.put('/terraform/diff', { ...main.change }, { headers: { 'Content-Type': 'application/json' } })
            .then(({ data }) => {
                if (data) {
                    setDiff(data as string);
                } else {
                    throw new Error('invalid diff return');
                }
            })
            .catch((err) => {
                logger.error(err);
                setDiff("--- diff err ---");
            });
    }, [main]);

    return (<Dialog fullWidth maxWidth="lg" onClose={handleClose} open={open} scroll='paper'>
        <DialogTitle>
            <Typography textTransform="capitalize" variant='h4'>{snakeCaseToHuman(main.type)}</Typography>
            <Typography color="text.secondary" variant='subtitle1'>{main.address}</Typography>
        </DialogTitle>
        <DialogContent dividers>
            <List>
                {isDelete() && complimentaryResources.length ? (
                    <ListItem>
                        <Card elevation={3} sx={{ width: "100%" }}>
                            <CardContent>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">
                                        Create Terraform Command Template
                                    </FormLabel>

                                    <FormGroup>
                                        <FormControl>
                                            <InputLabel>Move To</InputLabel>
                                            <Select onChange={(evt): void => handleChange(evt)} value={moveTo}>
                                                {(complimentaryResources || []).map((resource) => (
                                                    <MenuItem key={resource.address} value={resource.address}>{resource.address}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </FormGroup>
                                </FormControl>
                            </CardContent>
                            <CardContent>
                                <Collapse in={moveTo !== ""}>
                                    <Typography component={"pre"}>
                                        {`terraform state mv \\\n    "${main.address.replace(/"/g, "\\\"")}" \\\n    "${moveTo.replace(/"/g, "\\\"")}"`}
                                    </Typography>
                                </Collapse>
                            </CardContent>
                        </Card>
                    </ListItem>
                ) : ""}
                <ListItem>
                    <Card elevation={3}>
                        <CardContent>
                            <Box sx={{ backgroundColor: "#827e7e", overflow: "scroll", textWrap: "nowrap", fontWeight: "bold" }}>
                                <Ansi>{diff}</Ansi>
                            </Box>
                        </CardContent>
                    </Card>
                </ListItem>
            </List>
        </DialogContent>

    </Dialog >)
}