import React from 'react'
import { useForm } from 'react-hook-form'
import { Divider, Drawer, Grid, TextField, Typography, Button, Avatar, ButtonGroup } from '@material-ui/core'
import { TNewUserData, TUser } from '../api/users.api'
import ColorPicker from './ColorPicker';
import CustomInput from './CustomInput';
import { stringAcronymize } from '../custom-functions/stringAcronymize';

type TProfileEditDrawer = {
  isProfileEdit: boolean
  setProfileEdit: (isProfileEdit: boolean) => void
  setNewUserData: (data: TNewUserData | null) => void
  user: TUser
};
export const ProfileEditDrawer: React.FC<TProfileEditDrawer> = ({ isProfileEdit, setProfileEdit, user, setNewUserData }) => {

  const { handleSubmit, control } = useForm()

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
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Typography variant="h6" align="center" style={{ padding: "16px" }}>
            Редактирование профиля
          </Typography>
          <Divider />
          <Grid container direction="column" spacing={2} style={{ padding: '16px' }}>
            <Grid item>
              <Avatar
                style={{
                  height: '100px',
                  width: '100px',
                  fontSize: '40px',
                  margin: '0 auto'
                }}
              >
                {stringAcronymize(user.name === undefined ? user.email : user.name)}
              </Avatar>
            </Grid>
            <Grid item>
              <TextField
                label="ID пользователя"
                variant="outlined"
                size="small"
                disabled={true}
                value={user._id}
                fullWidth={true}
              />
            </Grid>
            <Grid item>
              <CustomInput
                name={"name"}
                label={"Имя пользователя"}
                control={control}
                defaultValue={user.name}
              />
            </Grid>
            <Grid item>
              <CustomInput
                name={"email"}
                label={"E-Mail (логин)"}
                control={control}
                defaultValue={user.email}
              />
            </Grid>
            <Grid item>
              <ColorPicker name={"color"} control={control} color={user.color} />
            </Grid>
          </Grid>
        </div>
        <div>
          <Divider />
          <ButtonGroup fullWidth style={{ padding: '16px' }}>
            <Button variant="contained" color="secondary" onClick={() => setProfileEdit(false)}>
              Отмена
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Сохранить
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </form>
  </Drawer>
}
