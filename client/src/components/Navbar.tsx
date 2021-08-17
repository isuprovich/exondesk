import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, ButtonGroup } from '@material-ui/core';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import s from '../fonts/logo.module.css'
import { ProfileEditDrawer } from './ProfileEditDrawer';
import { SettingsEditDrawer } from './SettingsEditDrawer';
import { useUser } from '../hooks/users.hook';

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
  userId: string
}
const Navbar: React.FC<TNavbar> = ({ logout, userId }) => {

  const classes = useStyles();
  const [isProfileEdit, setProfileEdit] = useState(false)
  const [isSettingsEdit, setSettingsEdit] = useState(false)
  const {user} = useUser(userId)


  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={s.logo}>Exondesk</Typography>
          <div className={classes.kek}></div>
          <ButtonGroup size="small" color="primary" variant="text">
            <Button color="inherit" onClick={() => setSettingsEdit(true)}><SettingsRoundedIcon /></Button>
            <Button component={Link} to='/newtask' color="inherit"><AddCircleOutlineRoundedIcon /></Button>
            <Button component={Link} to='/tasks' color="inherit">Список задач</Button>
            <Button component={Link} to='/kanban' color="inherit">Доска</Button>
          </ButtonGroup>
          <div className={classes.divider}></div>
          <ButtonGroup size="small" color="primary" variant="text">
            <Button color="inherit" onClick={() => setProfileEdit(true)}>{user.name === undefined ? user.email : user.name}</Button>
            <Button color="inherit" onClick={() => logout()}>ВЫХОД</Button>
          </ButtonGroup>
        </Toolbar>
      </AppBar>
      <ProfileEditDrawer setProfileEdit={setProfileEdit} isProfileEdit={isProfileEdit} user={user} />
      <SettingsEditDrawer isSettingsEdit={isSettingsEdit} setSettingsEdit={setSettingsEdit} />
    </div>
  );
}

export default Navbar