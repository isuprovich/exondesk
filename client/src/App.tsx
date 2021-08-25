import React, { useEffect } from 'react'
import { useRoutes } from './routes'
import { useAuth } from './hooks/auth.hook'
import { SnackbarProvider } from 'notistack';
import { AuthContext } from './context/AuthContext'
import { CssBaseline } from '@material-ui/core'
import Navbar from './components/Navbar'
import { getStatuses, getPriorities } from './redux/reducers/tags.reducer';
import { getUsers } from './redux/reducers/users.reducer';
import { useDispatch } from 'react-redux'

const App: React.FC = () => {
  const { token, login, logout, userId, ready } = useAuth()
  const isAuth = !!token
  const routes = useRoutes(isAuth)
  const dispatch = useDispatch()
  useEffect(() => { dispatch(getUsers()) }, [dispatch])
  useEffect(() => { dispatch(getStatuses()) }, [dispatch])
  useEffect(() => { dispatch(getPriorities()) }, [dispatch])


  if (!ready) {
    return <>
      <CssBaseline />
      LOADING
    </>
  }
  return <>
    <SnackbarProvider>
      <AuthContext.Provider value={{ token, login, logout, userId, isAuth }}>
        <CssBaseline />
          {userId !== "" && <Navbar logout={logout} userId={userId} />}
          {routes}
      </AuthContext.Provider>
    </SnackbarProvider>
  </>
}

export default App
