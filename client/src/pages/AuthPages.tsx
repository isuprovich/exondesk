import { Container, Paper, TextField, Button, Typography, Grid } from "@material-ui/core"
import { useState, useContext } from "react"
import { Controller, useForm } from "react-hook-form"
import styled from "styled-components"
import { AuthContext } from "../context/AuthContext"
import { useApi } from "../hooks/api.hook"
import { useSnackbar } from 'notistack';

const AuthPaper = styled(Paper)`
  padding: 32px;
`
const AuthContainer = styled(Container)`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`
const LoginPage: React.FC = () => {
  const auth = useContext(AuthContext)
  const { loading, request } = useApi()
  const [isSignUp, setIsSignIn] = useState(true)
  const { handleSubmit, control } = useForm()
  const { enqueueSnackbar } = useSnackbar()
  const onSignIn = async (data: any) => {
    try {
      const reqData = await request('/api/auth/login', 'POST', data)
      auth.login(reqData.token, reqData.userId)
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
  }
  const onSignUp = async (data: any) => {
    try {
      const reqData = await request('/api/auth/register', 'POST', data)
      enqueueSnackbar(reqData.message, { variant: 'success' })
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
  }

  return <>
    <AuthContainer>
      <AuthPaper variant='outlined'>
        <Typography variant="h4" gutterBottom align="center">
          {isSignUp ? <span>Вход в Exondesk</span> : <span>Регистрация в Exondesk</span>}
        </Typography>
        <form onSubmit={isSignUp ? handleSubmit(onSignIn) : handleSubmit(onSignUp)}>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    label="E-Mail"
                    variant="outlined"
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={error ? error.message : null}
                    fullWidth={true}
                  />
                )}
                rules={{ required: 'Введите E-Mail' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    label="Пароль"
                    variant="outlined"
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={error ? error.message : null}
                    type="password"
                    fullWidth={true}
                  />
                )}
                rules={{ required: 'Введите пароль' }}
              />
            </Grid>
            <Grid item xs={12} spacing={2} container justifyContent='center'>
              <Grid item>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {isSignUp ? <span>Вход</span> : <span>Регистрация</span>}
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary" onClick={() => setIsSignIn(!isSignUp)}>
                  {isSignUp ? <span>Нет аккаунта?</span> : <span>Уже есть аккаунт</span>}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </AuthPaper>
    </AuthContainer>

  </>
}

export default LoginPage