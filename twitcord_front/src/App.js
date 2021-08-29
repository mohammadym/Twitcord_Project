import React from 'react';
import {Provider} from 'react-redux';
import store from './redux/store.js';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import LogIn from './Components/LogIn/LogIn.js';
import SignUp from './Components/SignUp/SignUp.js';
import HomePage from './Components/HomePage/HomePage.js';
import Search from './Components/Search/Search.js';
import {useSelector} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import EditProfile from './Components/EditProfile/EditProfile.js';
import RoomList from './Components/Room/RoomList/RoomList';
import SideDrawer from './Components/SideDrawer/SideDrawer.js';
import Profile from './Components/Profile/Profile.js';
import Chat from './Components/Chat/Chat.js';
import TweetPage from './Components/TweetPage/TweetPage.js';
import MobileNavbar from './Components/MobileNavbar/MobileNavbar.js';

// eslint-disable-next-line require-jsdoc
function App() {
  // const windowHeight = window['innerHeight'];
  const sideDrawerEnable =
  useSelector((state) => state).tweet.sideDrawerEnable;

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Hidden smUp>
          <MobileNavbar/>
          <div className="h-56"></div>
        </Hidden>
        <Grid container spacing={0}>
          {sideDrawerEnable &&
          <Hidden xsDown>
            <Grid item sm={4}>
              <SideDrawer />
            </Grid>
          </Hidden>
          }
          <Grid item xs={12} sm={8} md={5}>
            <div className="App border-left-1 border-right-1 min-h-100vh">
              <div>
                <Route exact path="/" render={() =>
                  (<Redirect to="/homepage" />)} />
                <Route exact path="/search" component={Search} />
                <Route exact path="/homepage" component={HomePage} />
                <Route exact path="/login" component={LogIn} />
                <Route exact path="/signup" component={SignUp} />
                <Route exact path="/profile/:id" component={Profile} />
                <Route exact path="/edit-profile" component={EditProfile} />
                <Route exact path="/chat/:id" component={Chat} />
                <Route exact path="/tweet/:id" component={TweetPage}></Route>
                <Route exact path="/room" component={RoomList} />
              </div>
            </div>
          </Grid>
          {sideDrawerEnable &&
          <Hidden mdDown>
            <Grid
              item
              md={3}>
            </Grid>
          </Hidden>}
        </Grid>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
