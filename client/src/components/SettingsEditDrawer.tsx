import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Divider, Drawer, Grid, TextField, Typography, Button } from '@material-ui/core';
import { useSnackbar } from 'notistack';

type TSettingsEditDrawer = {
  isSettingsEdit: boolean
  setSettingsEdit: (isSettingsEdit: boolean) => void
};
export const SettingsEditDrawer: React.FC<TSettingsEditDrawer> = ({ isSettingsEdit, setSettingsEdit }) => {
  const { handleSubmit, control } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const updateProfile = async (data: any) => {
    try {
      console.log(data);
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
    }
  };
  return <Drawer
    anchor="right"
    open={isSettingsEdit}
    onClose={() => setSettingsEdit(false)}
  >
    <form onSubmit={handleSubmit(updateProfile)} style={{ height: '100vh' }}>
      <Typography variant="h6" align="center" style={{ padding: "10px" }}>
        Редактирование тегов
      </Typography>
      <Divider />
      <Grid container style={{ display: 'flex' }}>
        <Grid item xs={12} style={{ padding: "10px" }}>
          <Controller
            name="name"
            control={control}
            defaultValue="userName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Имя пользователя"
                variant="outlined"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
                fullWidth={true}
                size="small"
              />
            )} />
        </Grid>
        <Grid item xs={12} style={{ padding: "10px" }}>
          <Controller
            name="email"
            control={control}
            defaultValue="eMail"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="E-Mail (логин)"
                variant="outlined"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
                fullWidth={true} />
            )} />
        </Grid>
      </Grid>
      <Divider />
      <Grid container justifyContent="center">
        <Grid item style={{ padding: "10px" }}>
          <Button type="submit" variant="contained" color="primary">
            Сохранить изменения
          </Button>
        </Grid>
        <Grid item style={{ padding: "10px" }}>
          <Button variant="contained" color="secondary" onClick={() => setSettingsEdit(false)}>
            Отмена
          </Button>
        </Grid>
      </Grid>
    </form>
  </Drawer>
}
