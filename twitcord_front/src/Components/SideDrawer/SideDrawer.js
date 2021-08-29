import React, {useState} from 'react';
import {useHistory, NavLink} from 'react-router-dom';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import NotificationsRoundedIcon from
  '@material-ui/icons/NotificationsRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import RecordVoiceOverRoundedIcon from
  '@material-ui/icons/RecordVoiceOverRounded';
import Typography from '@material-ui/core/Typography';
import './SideDrawer.css';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import {useDispatch} from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import * as Constants from '../../Utils/Constants';
import * as Actions from '../../redux/Actions/index';
import logo from '../../assets/twitcord.png';
import Tooltip from '@material-ui/core/Tooltip';


const SideDrawer = () => {
  const history = useHistory();

  const userGeneralInfo = JSON.parse(
      localStorage.getItem(Constants.GENERAL_USER_INFO),
  );

  const userId = userGeneralInfo?.pk;

  const navItems = [
    {id: 0, title: 'Home', route: '/homepage',
      icon: <HomeRoundedIcon className="sd-icon" />},
    {id: 1, title: 'Profile', route: '/profile/' + userId,
      icon: <PersonRoundedIcon className="sd-icon" />},
    {id: 2, title: 'Notification', route: '/notification',
      icon: <NotificationsRoundedIcon className="sd-icon" />},
    {id: 3, title: 'Search', route: '/search',
      icon: <SearchRoundedIcon className="sd-icon" />},
    {id: 4, title: 'Room', route: '/room',
      icon: <RecordVoiceOverRoundedIcon className="sd-icon" />},
  ];
  const dispatch = useDispatch();
  const windowHeight = window['innerHeight'];
  const [anchorEl, setAnchorEl] = useState(null);

  // useMemo(
  //   () => {
  //       if (userGeneralInfo == null || userGeneralInfo.userID == null){
  //         history.push('/login')
  //       }
  //   },
  //   []
  // );

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.setItem(
        Constants.GENERAL_USER_INFO, null,
    );

    dispatch(
        Actions.setSideDrawerEnable({
          enable: false,
        }),
    );

    history.push('/login');
  };

  return (
    <div style={{height: windowHeight}} className="sd-root">
      <div className="sd-container">
        <img className="sd-logo" src={logo} />

        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.route}
            activeClassName='sd-item-selected'
            className='sd-item'>
            {item.icon}
            <Typography className="sd-title">{item.title}</Typography>
          </NavLink>
        ))}

      </div>

      <div className="sd-account" onClick={handleMenuClick}>
        <Avatar
          className="sd-avatar"
        />
        <Tooltip
          title={userGeneralInfo !== null ? userGeneralInfo.email : ''}
          placement="top-start">
          <Typography className="sd-user-email sd-title">
            {userGeneralInfo !== null ? userGeneralInfo.email : ''}
          </Typography>
        </Tooltip>
      </div>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}>
        <MenuItem onClick={handleLogout}>
          <ExitToAppIcon className="sd-logout-icon"/>
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default SideDrawer;
