/* eslint-disable max-len */
import React from 'react';
import './Tweets.css';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import {Icon} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

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

export const Tweets = (props) => {
  const dhm = (t) => {
    const cd = 24 * 60 * 60 * 1000;
    const ch = 60 * 60 * 1000;
    let d = Math.floor(t / cd);
    let h = Math.floor((t - d * cd) / ch);
    let m = Math.round((t - d * cd - h * ch) / 60000);
    const pad = function(n) {
      return n < 10 ? 0 + n : n;
    };
    if (m === 60) {
      h++;
      m = 0;
    }
    if (h === 24) {
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
    const diffMins = dhmResult[2];

    if (diffHours < 1 && diffDays < 1 && diffMins > 0) {
      showingDate = diffMins + ' m';
    }

    if (diffDays < 1 && diffHours > 0) {
      showingDate = diffHours + ' h';
    }

    if (date.getDate() < currentDate.getDate()) {
      showingDate =
        date.getFullYear() +
        ' ' +
        monthNumberToLabelMap[date.getMonth() + 1] +
        ' ' +
        date.getDate();
    }

    return showingDate;
  };

  return (
    <Grid
      container
      direction="row"
      spacing={6}
      className="t-container"
      justify="space-between"
    >
      <Grid item xs={12} sm={9} md={10}>
        <Avatar className="avatar" alt="avatar" />
        <div className="t-avatar-container">

          <div className="t-username-container">
            <div className="t-name-container">
              <Tooltip title={props.name} placement="top-start">
                <Typography className="t-name">{props.name}</Typography>
              </Tooltip>
              {!props.isPublic && <Icon className="t-lock-icon">lock</Icon>}
              <Typography className="t-date">
                <div className="t-dot" />
                {extractTime(props.createDate)}
              </Typography>
            </div>
            <Tooltip title={'@' + props.username} placement="top-start">
              <Typography className="t-username">@{props.username}</Typography>
            </Tooltip>
          </div>
        </div>
      </Grid>

      <Grid xs={12} item className="t-item-desc">
        <Typography className="t-desc">{props.content}</Typography>
      </Grid>

      <Grid xs={12} container item className="t-icon-bottom-bar">
        <Grid item>
          <IconButton className="t-like" aria-label="like">
            <FavoriteBorderOutlinedIcon />
          </IconButton>
        </Grid>

        <Grid item>
          <IconButton>
            <CachedOutlinedIcon />
          </IconButton>
        </Grid>

        <Grid item>
          <IconButton>
            <ChatBubbleOutlineOutlinedIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

Tweets.propTypes = {
  name: PropTypes.string,
  username: PropTypes.string,
  content: PropTypes.string,
  isPublic: PropTypes.bool,
  createDate: PropTypes.string,
  id: PropTypes.number,
};
export default Tweets;
