import React from 'react';
import Grid from '@material-ui/core/Grid';
import './RoomItem.css';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
/* eslint-disable*/

const RoomItem = (props) => {
  console.log(props.room)
  return (
    <Grid container className="ri-container" >
      <Grid className="ri-avatar-container" item xs={12} sm={2} md={1} >
        <Avatar 
        src={props.room.room_img}
        className="ri-avatar" 
        alt="room name"
        />
      </Grid>
      <Grid className="ri-details-container" item xs>
        <Typography className="ri-room-name">{props.room.title}</Typography>
        <Typography className="ri-members-count">
          {props.room.number_of_members} members
        </Typography>
      </Grid>
    </Grid>
  );
};

RoomItem.propTypes = {
  title: PropTypes.string,
  membersCount: PropTypes.number,
};


export default RoomItem;
