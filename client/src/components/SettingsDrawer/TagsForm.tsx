import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Grid, TextField, Button, Typography, ButtonGroup } from '@material-ui/core';
import { TTag, TTagInner } from '../../api/tags.api';
import { CustomChip } from '../StyledComponents/CustomChip';
import { AxiosResponse } from 'axios';
import ColorPicker from '../ColorPicker';

type TTagsForm = {
    getTags: () => Promise<TTag>,
    newTag: (data: TTagInner) => Promise<AxiosResponse<any>>,
    deleteTag: (value: string) => Promise<AxiosResponse<any>>,
    tagsLabel: string
}
export const TagsForm: React.FC<TTagsForm> = ({getTags, newTag, deleteTag, tagsLabel}) => {
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
        if(tagToDelete) {
            deleteTag(tagToDelete).then(res => {
                setTagToDelete(null)
            })
        }
    }, [tagToDelete, deleteTag])

    return <form onSubmit={handleSubmit(saveTag)}>
        <Grid container direction="column" spacing={2} style={{ padding: '16px' }}>
            <Grid item xs={12}>
                <Typography align="center" variant="subtitle2">{tagsLabel}</Typography>
            </Grid>
            <Grid item xs={12}>
                {tags?.map(tag => {
                    return <div key={tag.value} style={{marginBottom: "8px"}}>
                        <CustomChip
                            label={`${tag.label} (${tag.value})`}
                            $color={tag.color}
                            style={{ width: "100%" }}
                            onClick={() => {console.log('Clicked')}}
                            onDelete={() => setTagToDelete(tag.value)}
                        />
                    </div>
                })}
            </Grid>
            <Grid container justifyContent="center">
                {!newTagToggle
                    ? <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setNewTagToggle(true)}
                        size="small"
                    >
                        +
                    </Button>
                    : <Typography align="center" variant="subtitle2">Создание тега</Typography>
                }
            </Grid>
            {newTagToggle && <>
                <Grid item xs={12}>
                    <Controller
                        name="value"
                        control={control}
                        defaultValue={""}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                label="Значение"
                                variant="outlined"
                                size="small"
                                value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                                fullWidth={true} />
                        )} />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="label"
                        control={control}
                        defaultValue={""}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                label="Наименование"
                                variant="outlined"
                                size="small"
                                value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                                fullWidth={true} />
                        )} />
                </Grid>
                <Grid item xs={12}>
                    <ColorPicker name={"color"} control={control} />
                </Grid>
                <Grid item container xs={12} justifyContent="center">
                    <ButtonGroup disabled={disableSubmit}>
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
            </>}
        </Grid>
    </form>;
};
