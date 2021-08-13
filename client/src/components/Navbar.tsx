import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Divider, Drawer, Grid, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import s from '../fonts/logo.module.css'

type TProfileEditDrawer = {
  isProfileEdit: boolean,
  setProfileEdit: (isProfileEdit: boolean) => void
}

const ProfileEditDrawer: React.FC<TProfileEditDrawer> = ({ isProfileEdit, setProfileEdit }) => {
  const { handleSubmit, control } = useForm()
  const { enqueueSnackbar } = useSnackbar()
  const updateProfile = async (data: any) => {
    try {
      console.log(data)
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
  }
  return <Drawer
    anchor="right"
    open={isProfileEdit}
    onClose={() => setProfileEdit(false)}
  >
    <form onSubmit={handleSubmit(updateProfile)} style={{height: '100vh'}}>
      <Typography variant="h6" align="center" style={{ padding: "10px" }}>
        Редактирование профиля
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
              />
            )}
          />
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
                fullWidth={true}
              />
            )}
          />
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
          <Button variant="contained" color="secondary" onClick={() => setProfileEdit(false)}>
            Отмена
          </Button>
        </Grid>
      </Grid>
    </form>
  </Drawer>
}

const SLink = styled(Link)`
  color: white;
  text-decoration: none
`
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    kek: {
      flexGrow: 1,
    },
    divider: {
      flexGrow: 25,
    },
  }),
);

type TNavbar = {
  logout: () => void,
  userId: string | null
}
const Navbar: React.FC<TNavbar> = ({ logout }) => {

  const classes = useStyles();
  const [isProfileEdit, setProfileEdit] = useState(false)

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={s.logo}>Exondesk</Typography>
          <div className={classes.kek}></div>
          <Button color="inherit"><SLink to='/newtask'>Создать задачу</SLink></Button>
          <Button color="inherit"><SLink to='/tasks'>Список задач</SLink></Button>
          <Button color="inherit"><SLink to='/kanban'>Доска</SLink></Button>
          <div className={classes.divider}></div>
          <Button color="inherit" onClick={() => setProfileEdit(true)}>UserName</Button>
          <Button color="inherit" onClick={() => logout()}>ВЫХОД</Button>
        </Toolbar>
      </AppBar>
      <ProfileEditDrawer setProfileEdit={setProfileEdit} isProfileEdit={isProfileEdit} />
    </div>
  );
}

export default Navbar