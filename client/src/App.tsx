import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useRoutes } from './routes'
import { useAuth } from './hooks/auth.hook'
import { SnackbarProvider } from 'notistack';
import { AuthContext } from './context/AuthContext'
import { CssBaseline, Drawer } from '@material-ui/core'
import Navbar from './components/Navbar'

const App: React.FC = () => {
  const { token, login, logout, userId, ready } = useAuth()
  const isAuth = !!token
  const routes = useRoutes(isAuth)

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
        <BrowserRouter>
          {isAuth && <Navbar logout={logout} />}
          {routes}
        </BrowserRouter>
      </AuthContext.Provider>
    </SnackbarProvider>
  </>
}

export default App
