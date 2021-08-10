import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Drawer, List, ListItem } from '@material-ui/core';
import { useState } from 'react';
import styled from 'styled-components';
import { NavLink, BrowserRouter, Switch } from 'react-router-dom';

const NavDrawer = styled.div`
  padding: 16px;
`
const NavLinkS = styled(NavLink)`
  color: black;
  
`
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);
type TNavbar = {
  logout: () => void
}
const Navbar: React.FC<TNavbar> = ({ logout }) => {
  const classes = useStyles();
  const [isDrawer, setDrawer] = useState(false)
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => setDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            EXONDESK
          </Typography>
          <Button color="inherit" onClick={() => logout()}>ВЫХОД</Button>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isDrawer} onClose={() => setDrawer(false)}>
        <NavDrawer>
          <Typography variant="h6" align="center">
            Навигация
          </Typography>
          <List component='nav'>
            <NavLinkS to='/kanban' onClick={() => setDrawer(false)}><ListItem button>Доска</ListItem></NavLinkS>
            <NavLinkS to='/tasks' onClick={() => setDrawer(false)}><ListItem button>Список задач</ListItem></NavLinkS>
            <NavLinkS to='/newtask' onClick={() => setDrawer(false)}><ListItem button>Создать задачу</ListItem></NavLinkS>
          </List>
        </NavDrawer>
      </Drawer>
    </div>
  );
}

export default Navbar