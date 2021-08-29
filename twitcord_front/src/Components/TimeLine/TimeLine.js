/* eslint-disable */
import React, { useEffect, useState } from 'react';
import TweetItem from '../TweetItem/TweetItem.js';
import Grid from '@material-ui/core/Grid';
import './TimeLine.css';
import Divider from '@material-ui/core/Divider';
import * as API from '../../Utils/API/index';

const TimeLine = () => {
  const [timeLine, setTimeLine] = useState([]);
  const getTimeLine = () => {
    API.getTimeLine().then((res) => {
      setTimeLine(res.data.results);
    }).catch((error) => {
    });
  };
  useEffect(() => {
    getTimeLine();
  }, []);

  return (
    <Grid >
      {timeLine.map((tweet) => {
        return (
          <div key={tweet.id} >
            <TweetItem
              tweet={tweet}
            />
            <Divider />
          </div>
        );
      })}
    </Grid>
  );
};


export default TimeLine;
