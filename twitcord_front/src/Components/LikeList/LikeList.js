import React, {useEffect, useState} from 'react';
import {TweetSearchItem} from '../TweetSearchItem/TweetSearchItem';
import Grid from '@material-ui/core/Grid';
import './LikeList.css';
import Divider from '@material-ui/core/Divider';
import * as API from '../../Utils/API/index';
import * as Constants from '../../Utils/Constants.js';

// import {useDispatch} from 'react-redux';
// import {useSelector} from 'react-redux';
// import * as Actions from '../../redux/Actions/index.js';

const LikeList = () => {
  // const tweetInfo = useSelector((state) => state).tweet.tweetInfo;
  // const dispatch = useDispatch();
  const [tweetInfo, setTweetInfo] = useState(null);
  let profileId = -1;
  const userGeneralInfo = JSON.parse(
      localStorage.getItem(Constants.GENERAL_USER_INFO),
  );
  if (userGeneralInfo != null) {
    profileId = userGeneralInfo.pk;
  }
  useEffect(() => {
    // console.log();
    API.likeList({id: profileId})
        .then((data) => {
          // console.log();
          setTweetInfo(data.data.results);
          console.log('data', data.data.results);
        })
        .catch((error) => {
          console.log(error);
        });
    console.log('tweetInfo', tweetInfo);
  }, []);

  return (
    <Grid container item className="likeList">
      {tweetInfo.map((tweet) => {
        return (
          <div key={tweet.id}>
            <TweetSearchItem
              id={tweet.id}
              name={tweet.first_name + ' ' + tweet.last_name}
              username={tweet.username}
              createDate={tweet.create_date}
              content={tweet.tweet.content}
              isPublic={tweet.is_public}
              is_liked={tweet.is_liked}
            />
            <Divider />
          </div>
        );
      })}
    </Grid>
  );
};


export default LikeList;
