import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Divider, Drawer, Grid, TextField, Typography, Button } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useApi } from '../hooks/api.hook';

type TProfileEditDrawer = {
  isProfileEdit: boolean
  setProfileEdit: (isProfileEdit: boolean) => void
  user: {
    tasks: never[];
    _id: string;
    email: string;
    name: string;
  }
};
export const ProfileEditDrawer: React.FC<TProfileEditDrawer> = ({ isProfileEdit, setProfileEdit, user }) => {
  const { handleSubmit, control } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const { loading, request } = useApi()
  const updateProfile = async (data: { name: string, email: string }) => {
    try {
      await request(`/api/users/${user._id}`, 'POST', data)
      setProfileEdit(false)
      enqueueSnackbar('Данные пользователя успешно обновлены', { variant: 'success' });
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
    }
  };
  return <Drawer
    anchor="right"
    open={isProfileEdit}
    onClose={() => setProfileEdit(false)}
  >
    <form onSubmit={handleSubmit(updateProfile)} style={{overflow: "hidden"}}>
      <Typography variant="h6" align="center" style={{ padding: "10px" }}>
        Редактирование профиля
      </Typography>
      <Divider />
      <Grid container direction="column" spacing={2} style={{ display: 'flex', padding: '16px' }}>
        <Grid item xs={12}>
              <TextField
                label="ID пользователя"
                variant="outlined"
                size="small"
                disabled={true}
                value={user._id}
                fullWidth={true}
              />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            defaultValue={user.name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Имя пользователя"
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
            name="email"
            control={control}
            defaultValue={user.email}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="E-Mail (логин)"
                variant="outlined"
                size="small"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
                fullWidth={true} />
            )} />
        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={2} justifyContent="center" style={{ display: 'flex', padding: '16px'}}>
        <Grid item>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            Сохранить изменения
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" disabled={loading} onClick={() => setProfileEdit(false)}>
            Отмена
          </Button>
        </Grid>
      </Grid>
    </form>
  </Drawer>
}
