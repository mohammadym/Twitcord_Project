import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import './ProfileTweetlist.css';
import Divider from '@material-ui/core/Divider';
import * as API from '../../Utils/API/index';
import * as Constants from '../../Utils/Constants.js';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import * as Actions from '../../redux/Actions/index.js';
import {TweetItem} from '../TweetItem/TweetItem';


const ProfileTweetlist = () => {
  const tweetInfo = useSelector((state) => state).tweet.tweetInfo;
  const profileInfo = useSelector((state) => state).tweet.profileInfo;
  const dispatch = useDispatch();
  let profileId = -1;
  const userGeneralInfo = JSON.parse(
      localStorage.getItem(Constants.GENERAL_USER_INFO),
  );
  if (userGeneralInfo != null) {
    profileId = userGeneralInfo.pk;
  }
  useEffect(() => {
    API.tweetlist({id: profileId})
        .then((data) => {
          const d = data.data;
          console.log(data.data.results);
          dispatch(Actions.setTweetListInfo({
            tweetInfo: d.results,
          }));
          console.log('tweetInfo', tweetInfo);
          console.log('profileInfo', profileInfo);
        })
        .catch((error) => {
          console.log(error);
        });
  }, []);

  return (
    <Grid container item className="tweetlist">
      {tweetInfo.map((tweet) => {
        return (
          <div key={tweet.id}>
            <TweetItem
              id={tweet.id}
              name={profileInfo.firstName+ ' ' +profileInfo.lastName}
              username={profileInfo.username}
              createDate={tweet.create_date}
              content={tweet.content}
              userId={tweet.user}
              profileImg={tweet.profile_img}
              isPublic={profileInfo.isPublic}
            />
            <Divider />
          </div>
        );
      })}
    </Grid>
  );
};


export default ProfileTweetlist;
