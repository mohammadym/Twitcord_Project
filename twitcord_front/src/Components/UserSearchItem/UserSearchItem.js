/* eslint-disable */
import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Icon} from '@material-ui/core';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import * as API from '../../Utils/API/index';
import './UserSearchItem.css';
import {Link, useHistory} from 'react-router-dom';

const UserSearchItem = (props) => {
  const [Situation, setSituation] = useState(props.status);
  const history = useHistory();
  function handleunrequest(id) {
    API.deleteFollowRequest({id: id})
        .then((response) => {
          setSituation(response.data.status);
        })
        .catch((error) => {
          console.log(error);
        });
  }
  function handleunfollow(id) {
    API.unfollow({id: id})
        .then((response) => {
          setSituation(response.data.status);
        })
        .catch((error) => {
          console.log(error);
        });
  }
  function handlefollow(id) {
    API.follow({'request_to': id})
        .then((response) => {
          setSituation(response.data.status);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  const clickTest = (event) => {
    const links = document.getElementsByTagName('a');
    const buttons = document.getElementsByTagName('button');
    for (let i=0; i<links.length; i++) {
      if (links[i].contains(event.target)) {
        return;
      }
    }
    for (let i=0; i<buttons.length; i++) {
      if (buttons[i].contains(event.target)) {
        return;
      }
    }
    history.push('/profile/' + props.id);
  };

  return (
    <Grid onClick={clickTest}
      container
      spacing={6}
      className="usi-container usi-item-hover m-0 w-100 pointer"
      justify="space-between">
      <Grid item container xs={12} className="usi-info-container">
        <Grid item className="text-right p-3" xs={6} >
          { Situation == 'not following' ? (
              <Button
                color="primary"
                onClick={() => handlefollow(props.id)}
                variant="contained">
                follow
              </Button>) : Situation == 'following' ? (
                <Button
                  color="primary"
                  onClick={() => handleunfollow(props.id)}
                  variant="contained">
                  unfollow
                </Button>) : Situation == 'pending' ? (
                <Button
                  color="primary"
                  onClick={() => handleunrequest(props.id)}
                  variant="contained">
                  pending
                </Button>) : (<button />)}

        </Grid>
        <Grid item xs={6} >
          <div className="usi-avatar-container">
            <Link to={'/profile/'+ props.id}>
              <Avatar className="usi-avatar" alt="avatar" 
              src={props.profileImg}/>
            </Link>
            <div className="usi-username-container">
              <div className="usi-name-container">
                <Link to={'/profile/'+ props.id}>
                  <Tooltip title={props.name} placement="top-start">
                    <Typography className="usi-name" >{props.name}</Typography>
                  </Tooltip>
                </Link>
                {!props.isPublic && <Icon className="usi-lock-icon">lock</Icon>}
              </div>
              <Link to={'/profile/'+ props.id}>
                <Tooltip title={'@'+props.username} placement="top-start">
                  <Typography className="usi-username">
                  @{props.username}
                  </Typography>
                </Tooltip>
              </Link>
            </div>
          </div>
        </Grid>
      </Grid>
      {props.bio != null && <Grid xs={12} item className="usi-item-desc">
        <Typography className="usi-desc">{props.bio}</Typography>
      </Grid>}
    </Grid>
  );
};

UserSearchItem.propTypes = {
  name: PropTypes.string,
  username: PropTypes.string,
  bio: PropTypes.string,
  id: PropTypes.number,
  isPublic: PropTypes.bool,
  status: PropTypes.string,
  profileImg: PropTypes.string,
};

export default UserSearchItem;
