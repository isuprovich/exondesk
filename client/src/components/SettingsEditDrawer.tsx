import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Divider, Drawer, Grid, TextField, Typography, Button } from '@material-ui/core';
import { tagsAPI, TTag } from '../api/tags.api';

const PrioritiesForm: React.FC<{ isSettingsEdit: boolean }> = ({ isSettingsEdit }) => {
  const { handleSubmit, control } = useForm();
  const [priorities, setPriorities] = useState<TTag | null>(null)
  useEffect(() => {
    if (isSettingsEdit) {
      tagsAPI.getPriorities().then(res => {
        setPriorities(res.priorities)
      })
    }
  }, [isSettingsEdit])
  const [newPriorityToggle, setNewPriorityToggle] = useState(false)

  const savePriority = (data: any) => {
    // setNewUserData(data)
    console.log(data)
  }

  return <div>
    <Grid container direction="column" spacing={2} style={{ padding: '16px' }}>
      <Grid item xs={12}>
        {priorities?.map(priority => {
          return <div key={priority.value} style={{ backgroundColor: priority.color }}>
            {`Value: ${priority.value}, Label: ${priority.label}, Color: ${priority.color}`}
          </div>
        })}
      </Grid>
      <Grid item xs={12}>
        {!newPriorityToggle && <Button
          variant="contained"
          color="primary"
          onClick={() => setNewPriorityToggle(true)}
        >
          Новый приоритет
        </Button>}
      </Grid>
    </Grid>
    {newPriorityToggle && <form onSubmit={handleSubmit(savePriority)}>
      <Grid container direction="column" spacing={2} style={{ padding: '16px' }}>
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
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Сохранить
          </Button>
        </Grid>
      </Grid>
    </form>}
  </div>
}
const StatusesForm: React.FC<{ isSettingsEdit: boolean }> = ({ isSettingsEdit }) => {
  const { handleSubmit, control } = useForm()
  const [statuses, setStatuses] = useState<TTag | null>(null)
  useEffect(() => {
    if (isSettingsEdit) {
      tagsAPI.getStatuses().then(res => {
        setStatuses(res.statuses)
      })
    }
  }, [isSettingsEdit])
  const [newStatusToggle, setNewStatusToggle] = useState(false)
  const saveStatus = (data: any) => {
    // setNewUserData(data)
    console.log(data)
  }
  return <div>
    <Grid container direction="column" spacing={2} style={{ padding: '16px' }}>
      <Grid item xs={12}>
        {statuses?.map(status => {
          return <div key={status.value} style={{ backgroundColor: status.color }}>
            {`Value: ${status.value}, Label: ${status.label}, Color: ${status.color}`}
          </div>
        })}
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setNewStatusToggle(true)}
          disabled={newStatusToggle}
        >
          Новый статус
        </Button>
      </Grid>
    </Grid>
    <form onSubmit={handleSubmit(saveStatus)}>
      {newStatusToggle && <Grid container direction="column" spacing={2} style={{ padding: '16px' }}>
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
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => setNewStatusToggle(false)}
          >
            Сохранить
          </Button>
        </Grid>
      </Grid>}
    </form>
  </div>
}
type TSettingsEditDrawer = {
  isSettingsEdit: boolean
  setSettingsEdit: (isSettingsEdit: boolean) => void
}
export const SettingsEditDrawer: React.FC<TSettingsEditDrawer> = ({ isSettingsEdit, setSettingsEdit }) => {
  return <Drawer
    anchor="right"
    open={isSettingsEdit}
    onClose={() => setSettingsEdit(false)}
  >
    <div style={{
      overflow: "hidden",
      height: '100%'
    }}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Typography variant="h6" align="center" style={{ padding: "10px" }}>
            Редактирование тэгов
          </Typography>
          <Divider />
          <PrioritiesForm isSettingsEdit={isSettingsEdit} />
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <StatusesForm isSettingsEdit={isSettingsEdit} />
        </div>
        <div>
          <Divider />
          <Grid container spacing={2} style={{ padding: '16px' }}>
            <Grid item>
              <Button type="submit" variant="contained" color="primary">
                Сохранить изменения
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={() => setSettingsEdit(false)}>
                Отмена
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  </Drawer>
}
