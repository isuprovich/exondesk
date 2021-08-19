import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Grid, TextField, Button, Typography, ButtonGroup } from '@material-ui/core';
import { tagsAPI, TTag } from '../../api/tags.api';
import { CustomChip } from '../StyledComponents/CustomChip';

type TTagInner = {
    value: string;
    label: string;
    color: string;
}
export const PrioritiesForm: React.FC = () => {
    const { handleSubmit, control, reset } = useForm();
    const [newPriorityToggle, setNewPriorityToggle] = useState(false);
    const [priorities, setPriorities] = useState<TTag | null>(null);
    useEffect(() => {
        if (!newPriorityToggle) {
            tagsAPI.getPriorities().then(res => {
                setPriorities(res.priorities)
            })
        }
    }, [newPriorityToggle]);
    const [disableSubmit, setDisableSubmit] = useState(false)
    const savePriority = (data: TTag) => {
        setDisableSubmit(true)
        tagsAPI.newPriority(data).then(res => {
            setDisableSubmit(false)
            setNewPriorityToggle(false)
            reset()
        })
    }
    const deletePriority = () => {
        console.log('Delete')
    }

    return <form onSubmit={handleSubmit(savePriority)}>
        <Grid container direction="column" spacing={2} style={{ padding: '16px' }}>
            <Grid item xs={12}>
                <Typography align="center" variant="subtitle2">Приоритеты</Typography>
            </Grid>
            <Grid item xs={12}>
                {priorities?.map(priority => {
                    return <div key={priority.value} style={{marginBottom: "8px"}}>
                        <CustomChip
                            label={`${priority.label} (${priority.value})`}
                            $color={priority.color}
                            style={{ width: "100%" }}
                            onClick={() => {console.log('Clicked')}}
                            onDelete={deletePriority}
                        />
                    </div>
                })}
            </Grid>
            <Grid container justifyContent="center">
                {!newPriorityToggle
                    ? <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setNewPriorityToggle(true)}
                        size="small"
                    >
                        +
                    </Button>
                    : <Typography align="center" variant="subtitle2">Создание приоритета</Typography>
                }
            </Grid>
            {newPriorityToggle && <>
                <Grid item xs={12}>
                    <Controller
                        name="value"
                        control={control}
                        defaultValue={""}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                label="Значение приоритета"
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
                                label="Наименование приоритета"
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
                                label="Цвет приоритета"
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
                                setNewPriorityToggle(false)
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
