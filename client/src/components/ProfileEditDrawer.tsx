import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Divider, Drawer, Grid, TextField, Typography, Button } from '@material-ui/core';
import { TNewUserData, TUser } from '../api/users.api';

type TProfileEditDrawer = {
  isProfileEdit: boolean
  setProfileEdit: (isProfileEdit: boolean) => void
  setNewUserData: (data: TNewUserData | null) => void
  user: TUser
};
export const ProfileEditDrawer: React.FC<TProfileEditDrawer> = ({ isProfileEdit, setProfileEdit, user, setNewUserData }) => {

  const { handleSubmit, control } = useForm();
  const saveEdit = (data: TNewUserData) => {
    setNewUserData(data)
  }

  return <Drawer
    anchor="right"
    open={isProfileEdit}
    onClose={() => setProfileEdit(false)}
  >
    <form onSubmit={handleSubmit(saveEdit)} style={{
      overflow: "hidden",
      height: '100%'
    }}>
      <div style={{display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'space-between'}}>
        <div>
          <Typography variant="h6" align="center" style={{ padding: "10px" }}>
            Редактирование профиля
          </Typography>
          <Divider />
          <Grid container direction="column" spacing={2} style={{ padding: '16px' }}>
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
              <Button variant="contained" color="secondary" onClick={() => setProfileEdit(false)}>
                Отмена
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </form>
  </Drawer>
}
