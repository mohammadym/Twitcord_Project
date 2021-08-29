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
import {useSelector} from 'react-redux';

/* eslint-disable require-jsdoc */
const UserLiked = () => {
  const profileInfo = useSelector((state) => state).tweet.profileInfo;
  const [UserLikedList, setUserLikedList] = React.useState([{}]);

  useEffect(() => {
    API.getUsersLiked({id: profileInfo.id})
        .then((response) => {
          setUserLikedList(response.data.results);
        })
        .catch((error) => {
          console.log(error);
        });
  }, []);
  return (
    <List className="fl-root" >
      {UserLikedList.map((postdetail, index) => {
        return (
          <div key={index} >
            <ListItem alignItems="flex-start" >
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary={postdetail.username}
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" className="fl-inline" color="textPrimary" >
                      {postdetail.first_name+postdetail.last_name}
                    </Typography>
                    {' — ' + postdetail.type + '\n' + postdetail.email}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </div>
        );
      })}
    </List>
  );
};
export default UserLiked;
