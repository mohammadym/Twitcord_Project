import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import {Icon} from '@material-ui/core';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import './TweetSearchItem.css';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CachedIcon from '@material-ui/icons/Cached';
import IconButton from '@material-ui/core/IconButton';
import {ReplyModal} from '../ReplyModal/ReplyModal';


const monthNumberToLabelMap = {
  [1]: 'January',
  [2]: 'February',
  [3]: 'March',
  [4]: 'April',
  [5]: 'May',
  [6]: 'June',
  [7]: 'July',
  [8]: 'August',
  [9]: 'September',
  [10]: 'October',
  [11]: 'November',
  [12]: 'December',
};

export const TweetSearchItem = (props) => {
  const dhm = (t) => {
    const cd = 24 * 60 * 60 * 1000;
    const ch = 60 * 60 * 1000;
    let d = Math.floor(t / cd);
    let h = Math.floor( (t - d * cd) / ch);
    let m = Math.round( (t - d * cd - h * ch) / 60000);
    const pad = function(n) {
      return n < 10 ? 0 + n : n;
    };
    if ( m === 60 ) {
      h++;
      m = 0;
    }
    if ( h === 24 ) {
      d++;
      h = 0;
    }
    return [d, pad(h), pad(m)];
  };

  const extractTime = (dateString) => {
    let showingDate = 'now';

    const date = new Date(dateString);
    const currentDate = new Date();
    const dateInMillies = date.getTime();
    const currentDateInMillies = currentDate.getTime();
    const diffInMillies = currentDateInMillies - dateInMillies;

    const dhmResult = dhm(diffInMillies);
    const diffDays = dhmResult[0];
    const diffHours = dhmResult[1];
    const diffMins =dhmResult[2];

    if (diffHours < 1 && diffDays < 1 && diffMins > 0) {
      showingDate = diffMins + ' m';
    }

    if (diffDays < 1 && diffHours > 0) {
      showingDate = diffHours + ' h';
    }

    if (date.getDate() < currentDate.getDate()) {
      showingDate = date.getFullYear() +
      ' ' + ( monthNumberToLabelMap[date.getMonth() + 1] ) +
      ' ' + date.getDate();
    }

    return showingDate;
  };

  const [open, setOpen] = useState(false);

  const openReplyModal = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Grid container
        direction="row"
        spacing={6}
        className="tsi-container"
        justify="space-between">
        <Grid item xs={12} sm={9} md={10}>
          <div className="tsi-avatar-container">
            <Avatar className="tsi-avatar" alt="avatar"/>
            <div className="tsi-username-container">
              <div className="tsi-name-container">
                <Tooltip title={props.name} placement="top-start">
                  <Typography className="tsi-name" >{props.name}</Typography>
                </Tooltip>
                {!props.isPublic && <Icon className="tsi-lock-icon">lock</Icon>}
                <Typography className="tsi-date">
                  <div className="tsi-dot"/>
                  {extractTime(props.createDate)}
                </Typography>
              </div>
              <Tooltip title={'@'+props.username} placement="top-start">
                <Typography className="tsi-username">@{props.username}
                </Typography>
              </Tooltip>
            </div>
          </div>
        </Grid>

        <Grid xs={12} item className="tsi-item-desc">
          <Typography className="tsi-desc">{props.content}</Typography>
        </Grid>

        <Grid xs={12} container item className="tsi-icon-bottom-bar">
          <Grid item>
            <IconButton>
              <FavoriteBorderIcon/>
            </IconButton>
          </Grid>

          <Grid item>
            <IconButton onClick={openReplyModal}>
              <ChatBubbleOutlineIcon/>
            </IconButton>
          </Grid>

          <Grid item>
            <IconButton>
              <CachedIcon/>
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <ReplyModal tweet={props} open={open} onClose={handleClose} />
    </div>
  );
};

TweetSearchItem.propTypes = {
  name: PropTypes.string,
  username: PropTypes.string,
  content: PropTypes.string,
  isPublic: PropTypes.bool,
  createDate: PropTypes.string,
  id: PropTypes.number,
  userId: PropTypes.number,
};
