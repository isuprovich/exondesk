import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Grid, TextField, Button, Typography } from '@material-ui/core';
import { tagsAPI, TTag } from '../../api/tags.api';

export const StatusesForm: React.FC = () => {
    const { handleSubmit, control, reset } = useForm();
    const [newStatusToggle, setNewStatusToggle] = useState(false);
    const [statuses, setStatuses] = useState<TTag | null>(null);
    useEffect(() => {
        if (!newStatusToggle) {
            tagsAPI.getStatuses().then(res => {
                setStatuses(res.statuses);
            });
        }
    }, [newStatusToggle]);
    const [disableSubmit, setDisableSubmit] = useState(false)
    const saveStatus = (data: any) => {
        setDisableSubmit(true)
        tagsAPI.newStatus(data).then(res => {
            setDisableSubmit(false)
            setNewStatusToggle(false)
            reset()
        })
    };
    return <form onSubmit={handleSubmit(saveStatus)}>
        <Grid container direction="column" spacing={2} style={{ padding: '16px' }}>
            <Grid item xs={12}>
                {statuses?.map(status => {
                    return <div key={status.value} style={{ backgroundColor: status.color }}>
                        {`Value: ${status.value}, Label: ${status.label}, Color: ${status.color}`}
                    </div>;
                })}
            </Grid>
            <Grid container justifyContent="center">
                {!newStatusToggle
                    ? <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setNewStatusToggle(true)}
                    size="small"
                >
                    Новый статус
                </Button>
                : <Typography align="center" variant="subtitle2">Создание статуса</Typography>
                }
                
            </Grid>
            {newStatusToggle && <>
                <Grid item xs={12}>
                    <Controller
                        name="value"
                        control={control}
                        defaultValue={""}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                label="Значение статуса"
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
                                label="Наименование статуса"
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
                        name="color"
                        control={control}
                        defaultValue={""}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                label="Цвет статуса"
                                variant="outlined"
                                size="small"
                                value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                                fullWidth={true} />
                        )} />
                </Grid>
                <Grid item container xs={12} justifyContent="center">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={disableSubmit}
                    >
                        Сохранить
                    </Button>
                </Grid>
            </>}
        </Grid>
    </form>
};
