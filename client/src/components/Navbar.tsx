import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, ButtonGroup, Avatar } from '@material-ui/core'
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded'
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded'
import { ProfileEditDrawer } from './ProfileEditDrawer'
import { SettingsEditDrawer } from './SettingsDrawer/SettingsEditDrawer'
import s from '../fonts/logo.module.css'
import { TNewUserData, usersAPI } from '../api/users.api'
import { useSnackbar } from "notistack"
import { setCurrentUser } from '../redux/selectors/users.selector'
import { stringAcronymize } from '../custom-functions/stringAcronymize'
import { getCurrentUser } from '../redux/reducers/users.reducer'

type TNavbar = {
  logout: () => void,
  userId: string
}
const Navbar: React.FC<TNavbar> = ({ logout, userId }) => {

  //Get/Edit profile info
  const [isProfileEdit, setProfileEdit] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [newUserData, setNewUserData] = useState<TNewUserData | null>(null)
  const user = useSelector(setCurrentUser)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!!newUserData) {
      usersAPI.updateUser(userId, newUserData).then(res => {
        setProfileEdit(false)
        enqueueSnackbar('Данные успешно обновлены', { variant: 'success' })
        setNewUserData(null)
        if (res.status === 200) { dispatch(getCurrentUser(userId)) }
      })
    }
  }, [newUserData, enqueueSnackbar, userId, dispatch])

  //Get/Edit settings
  const [isSettingsEdit, setSettingsEdit] = useState(false)

  return (
    <div>
      <AppBar>
        <Toolbar>
          <Typography className={s.logo}>Exondesk</Typography>
          <ButtonGroup size="small" variant="text">
            <Button color="inherit" onClick={() => setSettingsEdit(true)}><SettingsRoundedIcon /></Button>
            <Button component={Link} to='/newtask' color="inherit"><AddCircleOutlineRoundedIcon /></Button>
            <Button component={Link} to='/tasks' color="inherit">Список задач</Button>
            <Button component={Link} to='/kanban' color="inherit">Доска</Button>
          </ButtonGroup>
          <div style={{ flexGrow: 1 }}></div>
          <ButtonGroup size="small" variant="text">
            <Button
              color="inherit"
              onClick={() => setProfileEdit(true)}
              startIcon={<Avatar style={{
                height: '24px',
                width: '24px',
                fontSize: '12px'
              }}>
                {stringAcronymize(!user ? "" : user.name === undefined ? user.email : user.name)}
              </Avatar>}
            >
              {!user ? "" : user.name === undefined ? user.email : user.name}
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