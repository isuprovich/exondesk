import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Button, Typography, ButtonGroup, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { TTag, TTagInner } from '../../api/tags.api';
import { CustomChip } from '../StyledComponents/CustomChip';
import { AxiosResponse } from 'axios';
import ColorPicker from '../ColorPicker';
import CustomInput from '../CustomInput';

type TTagsForm = {
    getTags: () => Promise<TTag>,
    newTag: (data: TTagInner) => Promise<AxiosResponse<any>>,
    deleteTag: (value: string) => Promise<AxiosResponse<any>>,
    tagsLabel: string
}
export const TagsForm: React.FC<TTagsForm> = ({ getTags, newTag, deleteTag, tagsLabel }) => {
    const { handleSubmit, control, reset } = useForm();
    const [newTagToggle, setNewTagToggle] = useState(false);
    const [tags, setTags] = useState<TTag | null>(null);
    const [tagToDelete, setTagToDelete] = useState<string | null>(null)
    useEffect(() => {
        if (!newTagToggle) {
            getTags().then(res => {
                setTags(res)
            })
        }
    }, [newTagToggle, getTags, tagToDelete]);
    const [disableSubmit, setDisableSubmit] = useState(false)
    const saveTag = (data: TTagInner) => {
        setDisableSubmit(true)
        newTag(data).then(res => {
            setDisableSubmit(false)
            setNewTagToggle(false)
            reset()
        })
    }
    useEffect(() => {
        if (tagToDelete) {
            deleteTag(tagToDelete).then(res => {
                setTagToDelete(null)
            })
        }
    }, [tagToDelete, deleteTag])

    return <Accordion variant="outlined">
        <AccordionSummary>
            <Typography style={{ width: '100%' }} align="center">{tagsLabel}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <div style={{ width: '100%' }}>
                <Grid container direction="column" spacing={1}>
                    {tags?.map(tag => {
                        return <Grid item xs={12} key={tag.value}>
                            <CustomChip
                                label={`${tag.label} (${tag.value})`}
                                $color={tag.color}
                                style={{ width: "100%" }}
                                onClick={() => { console.log('Clicked') }}
                                onDelete={() => setTagToDelete(tag.value)}
                            />
                        </Grid>
                    })}
                    <Grid item container justifyContent="center">
                        {!newTagToggle
                            ? <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setNewTagToggle(true)}
                                size="small"
                                fullWidth
                            >
                                +
                            </Button>
                            : <Typography align="center" variant="subtitle2">Создание тега</Typography>
                        }
                    </Grid>
                    {newTagToggle && <form onSubmit={handleSubmit(saveTag)}>
                        <Grid container direction="column" spacing={1}>
                            <Grid item xs={12}>
                                <CustomInput
                                    name={"value"}
                                    label={"Значение"}
                                    control={control}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomInput
                                    name={"label"}
                                    label={"Наименование"}
                                    control={control}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ColorPicker name={"color"} control={control} />
                            </Grid>
                            <Grid item container xs={12} justifyContent="center">
                                <ButtonGroup disabled={disableSubmit} fullWidth>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                    >
                                        Сохранить
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={() => {
                                            setNewTagToggle(false)
                                            reset()
                                        }}
                                    >
                                        Отмена
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </form>}
                </Grid>
            </div>
        </AccordionDetails>
    </Accordion>
};
