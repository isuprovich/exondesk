import { Switch, Route, Redirect } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useAuth } from './hooks/auth.hook'
import { SnackbarProvider } from 'notistack';
import { AuthContext } from './context/AuthContext'
import { Container, createTheme, CssBaseline, ThemeProvider, Typography } from '@material-ui/core'
import Navbar from './components/Navbar'
import { getStatuses, getPriorities } from './redux/reducers/tags.reducer'
import { getCurrentUser, getUsers } from './redux/reducers/users.reducer'
import { useDispatch } from 'react-redux'
import LoginPage from './pages/AuthPages'
import KanbanPage from './pages/KanbanPage'
import SettingsPage from './pages/SettingsPage'
import TaskPage from './pages/TaskPage'
import TasksListPage from './pages/TasksListPage'

const App: React.FC = () => {
  const { token, login, logout, userId, ready } = useAuth()
  const isAuth = !!token
  const dispatch = useDispatch()
  useEffect(() => { dispatch(getUsers()) }, [dispatch])
  useEffect(() => { dispatch(getStatuses()) }, [dispatch])
  useEffect(() => { dispatch(getPriorities()) }, [dispatch])
  useEffect(() => { if (userId) dispatch(getCurrentUser(userId)) }, [dispatch, userId])

  const theme = createTheme({
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '.MuiAccordionSummary-content': {
            margin: '0 !important' //ОЧЕНЬ НУЖНО ИСПРАВИТЬ
          },
          '.MuiAccordionSummary-content.Mui-expanded': {
            margin: 0
          },
          '.MuiAccordion-root': {
            marginBottom: '8px'
          },
          '.MuiAccordion-root.Mui-expanded': {
            margin: '0 0 8px 0'
          },
          '.MuiAccordion-root:before': {
            backgroundColor: 'transparent',
            opacity: 1
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
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {userId !== "" && <Navbar logout={logout} userId={userId} />}
          <div style={{ margin: "74px 10px 0 10px" }}>
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
            <Container style={{ margin: "10px auto" }}><Typography variant="body2" align="center">Exondesk, 2021 (c) Ivan Suprovich</Typography></Container>
          </div>
        </ThemeProvider>
      </AuthContext.Provider>
    </SnackbarProvider>
  </>
}

export default App
