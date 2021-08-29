import React from 'react';
// import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import './MobileNavbar.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import {useState} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import NotificationsRoundedIcon from
  '@material-ui/icons/NotificationsRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
// import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import RecordVoiceOverRoundedIcon from
  '@material-ui/icons/RecordVoiceOverRounded';
import * as Constants from '../../Utils/Constants';
import {Link} from 'react-router-dom';


const MobileNavbar = () => {
  const [drawerState, setDrawerState] = useState(false);
  const toggleDrawer = (open) => {
    setDrawerState(open);
  };

  const userGeneralInfo = JSON.parse(
      localStorage.getItem(Constants.GENERAL_USER_INFO),
  );

  const userId = userGeneralInfo?.pk;

  const navItems = [
    {id: 0, title: 'Home', route: '/homepage',
      icon: <HomeRoundedIcon />},
    {id: 1, title: 'Profile', route: '/profile/' + userId,
      icon: <PersonRoundedIcon />},
    {id: 2, title: 'Notification', route: '/notification',
      icon: <NotificationsRoundedIcon />},
    {id: 3, title: 'Search', route: '/search',
      icon: <SearchRoundedIcon />},
    {id: 4, title: 'Room', route: '/room',
      icon: <RecordVoiceOverRoundedIcon />},
  ];

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton onClick={()=> toggleDrawer(true)} edge="start"
            color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          {drawerState}
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor="left"
        open={drawerState}
        onClose={()=>toggleDrawer(false)}
        onOpen={()=>toggleDrawer(true)}>
        <List>
          {navItems.map((item) => (
            <Link onClick={()=>toggleDrawer(false)}
              to={item.route} key={item.id}>
              <ListItem button className="w-250">
                <ListItemIcon> {item.icon} </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            </Link>
          ))}
        </List>
      </SwipeableDrawer>
    </div>
  );
};

export default MobileNavbar;
