/* eslint-disable max-len */
import React, {useEffect} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import * as API from '../../Utils/API/index';
import * as Constants from '../../Utils/Constants.js';
import {IconButton} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import {green} from '@material-ui/core/colors';
// import "./Follow.css";

/* eslint-disable require-jsdoc */
const Followings = () => {
  let profileId = -1;
  const userGeneralInfo = JSON.parse(localStorage.getItem(Constants.GENERAL_USER_INFO));
  if (userGeneralInfo != null) {
    profileId = userGeneralInfo.pk;
  }
  const [FollowList, setFollowList] = React.useState([{}]);

  useEffect(() => {
    API.getFollowRequests({id: profileId})
        .then((response) => {
          setFollowList(response.data.results);
        })
        .catch((error) => {
          console.log('failed to load data');
        });
  }, []);

  function handledelete(id) {
    console.log(id);
    const newList = FollowList.filter((item) => item.id !== id);
    setFollowList(newList);
    console.log(newList);
    API.rejectfollowrequest({id: id})
        .then((response) => {
          setFollowList(response.data.results);
          console.log(FollowList);
        })
        .catch((error) => {
          console.log(error);
        });
  }
  function handleaccept(id) {
    console.log(id);
    const newList = FollowList.filter((item) => item.id !== id);
    setFollowList(newList);
    console.log(newList);
    API.acceptfollowrequest({id: id})
        .then((response) => {
          setFollowList(response.data.results);
        })
        .catch((error) => {
          console.log(error);
        });
  }
  return (
    <List className="fl-root" >
      {FollowList.length === 0 ?(
         <div>nothing to show</div>
      ):(
        <div>
          {FollowList.map((postdetail, index) => {
            return (
              <div key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={postdetail.username}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          className="fl-inline"
                          color="textPrimary"
                        >
                          {postdetail.first_name + postdetail.last_name}
                        </Typography>
                        {' — ' + postdetail.email }
                      </React.Fragment>
                    }
                  />
                  <IconButton aria-label="delete" style={{color: green[500]}} fontSize="small" onClick={() => handleaccept(postdetail.id)} >
                    <CheckIcon />
                  </IconButton>
                  <IconButton aria-label="delete" color="primary" onClick={() => handledelete(postdetail.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            );
          })}
        </div>

      )}

    </List>
  );
};
export default Followings;
