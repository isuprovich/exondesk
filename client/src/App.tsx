import { Switch, Route, Redirect } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useAuth } from './hooks/auth.hook'
import { SnackbarProvider } from 'notistack'
import { AuthContext } from './context/AuthContext'
import { createTheme, CssBaseline, ThemeProvider, Typography } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import Navbar from './components/Navbar'
import { getStatuses, getPriorities } from './redux/reducers/tags.reducer'
import { getCurrentUser, getUsers } from './redux/reducers/users.reducer'
import { useDispatch, useSelector } from 'react-redux'
import LoginPage from './pages/AuthPages'
import KanbanPage from './pages/KanbanPage'
import SettingsPage from './pages/SettingsPage'
import TaskPage from './pages/TaskPage'
import TasksListPage from './pages/TasksListPage'
import { setCurrentUser } from './redux/selectors/users.selector'

const App: React.FC = () => {
  const { token, login, logout, userId, ready } = useAuth()
  const isAuth = !!token
  const dispatch = useDispatch()
  useEffect(() => { dispatch(getUsers()) }, [dispatch])
  useEffect(() => { dispatch(getStatuses()) }, [dispatch])
  useEffect(() => { dispatch(getPriorities()) }, [dispatch])
  useEffect(() => { if (userId) dispatch(getCurrentUser(userId)) }, [dispatch, userId])
  const user = useSelector(setCurrentUser)

  const theme = createTheme({
    palette: {
      type: "light",
      primary: {
        light: "#80cbc4",
        main: "#009688",
        dark: "#00796b",
        contrastText: "#ffffff"
      },
      secondary: {
        light: "#ef5350",
        main: "#e53935",
        dark: "#b71c1c",
        contrastText: "#ffffff"
      }
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#d9d9d9',
            borderRadius: '5px'
          },
          '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#9e9e9e'
          }
        }
      }
    }
  })
  const darkTheme = createTheme({
    palette: {
      type: "dark",
      primary: {
        light: "#b2dfdb",
        main: "#4db6ac",
        dark: "#009688",
        contrastText: "#ffffff"
      },
      secondary: {
        light: "#ef5350",
        main: "#e53935",
        dark: "#b71c1c",
        contrastText: "#ffffff"
      }
    },
    overrides: {
      MuiAppBar: {
        colorPrimary: {
          backgroundColor: '#424242'
        }
      },
      MuiCssBaseline: {
        '@global': {
          '::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#d9d9d9',
            borderRadius: '5px'
          },
          '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#9e9e9e'
          }
        }
      }
    }
  })

  if (!ready) {
    return <>
      <CssBaseline />
      LOADING
    </>
  }
  return <>
    <SnackbarProvider>
      <AuthContext.Provider value={{ token, login, logout, userId, isAuth }}>
        <ThemeProvider theme={user?.theme ? darkTheme : theme}>
          <CssBaseline />
          {userId !== "" && <Navbar logout={logout} userId={userId} />}
          <div style={{ height: '100vh',  overflow: 'hidden', padding: '64px 0 0 0' }}>
            <div style={{ height: '97%' }}>
              {isAuth && <Switch>
                <Route path='/kanban' render={() => <KanbanPage />} />
                <Route path='/tasks' render={() => <TasksListPage />} />
                <Route path='/newtask' render={() => <TaskPage editMode={false} />} />
                <Route path='/task/:taskId?' render={() => <TaskPage editMode={true} isReadOnly={true} />} />
                <Route path='/edit/:taskId?' render={() => <TaskPage editMode={true} />} />
                <Route path='/settings' render={() => <SettingsPage />} />
                <Redirect to='/tasks' />
              </Switch>}
              {!isAuth &&
                <Switch>
                  <Route path='/auth' exact render={() => <LoginPage />} />
                  <Redirect to='/auth' />
                </Switch>}
            </div>
            <Container><Typography variant="body2" align="center">Exondesk, 2021 (c) Ivan Suprovich</Typography></Container>
          </div>
        </ThemeProvider>
      </AuthContext.Provider>
    </SnackbarProvider>
  </>
}

export default App
