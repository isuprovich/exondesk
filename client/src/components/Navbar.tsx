import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, ButtonGroup, Avatar } from '@material-ui/core'
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded'
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded'
import { ProfileEditDrawer } from './ProfileEditDrawer'
import { SettingsEditDrawer } from './SettingsDrawer/SettingsEditDrawer'
import s from '../fonts/logo.module.css'
import { TNewUserData, TUser, usersAPI } from '../api/users.api'
import { useSnackbar } from "notistack"

type TNavbar = {
  logout: () => void,
  userId: string
}
const Navbar: React.FC<TNavbar> = ({ logout, userId }) => {

  //Get/Edit profile info
  const [isProfileEdit, setProfileEdit] = useState(false)
  const [user, setUser] = useState<TUser | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const [newUserData, setNewUserData] = useState<TNewUserData | null>(null)
  useEffect(() => {
    if (!!userId) {
      usersAPI.getUser(userId).then(res => {
        setUser(res.user)
      })
    }
  }, [userId, newUserData])
  useEffect(() => {
    if (!!newUserData) {
      usersAPI.updateUser(userId, newUserData).then(res => {
        setProfileEdit(false)
        enqueueSnackbar('Данные успешно обновлены', { variant: 'success' })
        setNewUserData(null)
      })
    }
  }, [newUserData, enqueueSnackbar, userId])

  //Get/Edit settings
  const [isSettingsEdit, setSettingsEdit] = useState(false)

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography className={s.logo}>Exondesk</Typography>
          <ButtonGroup size="small" color="primary" variant="text">
            <Button color="inherit" onClick={() => setSettingsEdit(true)}><SettingsRoundedIcon /></Button>
            <Button component={Link} to='/newtask' color="inherit"><AddCircleOutlineRoundedIcon /></Button>
            <Button component={Link} to='/tasks' color="inherit">Список задач</Button>
            <Button component={Link} to='/kanban' color="inherit">Доска</Button>
          </ButtonGroup>
          <div style={{flexGrow: 1}}></div>
          <ButtonGroup size="small" color="primary" variant="text">
            <Button
              color="inherit"
              onClick={() => setProfileEdit(true)}
              startIcon={<Avatar style={{height: '24px', width: '24px'}}>{!user ? "" : user.name === undefined ? user.email : user.name}</Avatar>}
            >
              {!user ? "" :user.name === undefined ? user.email : user.name}
            </Button>
            <Button color="inherit" onClick={() => logout()}>ВЫХОД</Button>
          </ButtonGroup>
        </Toolbar>
      </AppBar>
      {!!user && <ProfileEditDrawer setProfileEdit={setProfileEdit} isProfileEdit={isProfileEdit} user={user} setNewUserData={setNewUserData} />}
      <SettingsEditDrawer isSettingsEdit={isSettingsEdit} setSettingsEdit={setSettingsEdit} />
    </div>
  );
}

export default Navbar