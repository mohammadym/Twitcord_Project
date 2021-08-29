import React from 'react';
import Grid from '@material-ui/core/Grid';
import './HomePage.css';
import TweetBox from '../TweetBox/TweetBox';
import {Divider} from '@material-ui/core';
import TimeLine from '../TimeLine/TimeLine';


const HomePage = () => {
  return (
    <Grid container className="hp-container">
      <Grid item xs>
        <TweetBox/>
        <Divider/>
        <TimeLine/>
      </Grid>
    </Grid>
  );
};

export default HomePage;
