/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import {Divider} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import CachedIcon from '@material-ui/icons/Cached';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import * as API from '../../Utils/API/index';
import * as helper from '../../Utils/helper';
import './TweetPage.css';
import {ReplyModal} from '../ReplyModal/ReplyModal';
import TweetItem from '../TweetItem/TweetItem.js';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {Link} from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import {Modal} from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade'

const TweetPage = () => {
  const params = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [tweet, setTweet] = useState({});
  const [open, setOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [openlikes, setOpenlikes] = useState(false);
  const history = useHistory();
  const [userLikedList, setUserLikedList] = React.useState([{}]);
  const [count, setcount] = useState(0);

  const [replyModel, setReplyModel] = useState({});

  const openReplyModal = (tweet) => {
    setReplyModel(tweet);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloselikes = () => {
    setOpenlikes(false);
  };

  useEffect(()=>{
    API.getTweet(params.id).then((res)=> {
      setTweet({...res.data, name: res.data.first_name +
         ' ' + res.data.last_name});
         API.getUsersLiked({id: res.data.id })

        .then((response) => {
         setUserLikedList(response.data.results);
         setcount(response.data.count);

      console.log(results);

    })
    .catch((error) => {
      console.log(error);
    });
    }).catch((error)=>{
      setSnackOpen(true);
    });
  }, [open, params.id]);

  const handleClickMoreBtn = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMoreBtn = () => {
    setAnchorEl(null);
  };

  const handleBack = () => {
    window.history.back();
  };

  const goParent = (event) => {
    event.stopPropagation();
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
    if (open) {
      return;
    }
    history.push('/tweet/'+ tweet.parent?.id);
  };

  const handleOpenLikedTweet = () => {
    
    setOpenlikes(true);
    
  };
  console.log(tweet);
  const likebody = (
    <div className="likespaper" >
      <List className="fl-root" >
        
        {userLikedList.map((postdetail, index) => {
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
    </div>
  );
  const doNothing = () => {
    return;
  };

  return (
    <div>
      <Snackbar
        open={snackOpen}
        onClose={()=>setSnackOpen(false)}
        autoHideDuration={3000}
      >
        <MuiAlert elevation={6} variant="filled"
          onClose={()=> setSnackOpen(false)} severity="error">
        Problem loading the tweet page
        </MuiAlert>
      </Snackbar>
      <Box>
        <Tooltip title="back" className="m-2">
          <IconButton onClick={handleBack} aria-label="close">
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Box component="span" className="b-900 ml-2">Tweet</Box>
        <Divider />
        {tweet.is_reply &&
        <Box onClick={goParent} display="flex"
          className="px-3 pt-3 parent-hover pointer">
          <Box display="flex" alignItems="center" flexDirection="column">
            <Avatar alt={tweet.parent?.user?.username}
              title={tweet.parent?.user?.username}
              className="w-48 h-48"
              src="/static/images/avatar/1.jpg" />
            <div className="vl mt-1 br-33"></div>
          </Box>
          <div className="ml-2 w-100">
            <Box display="flex" className="lh-20 fs-15">
              {(tweet.parent?.user?.first_name ||
               tweet.parent?.user?.last_name)&&
              (<div className="b-900 mr-2">
                {(tweet.parent?.user?.first_name +
                   ' ' + tweet.parent?.user?.last_name)}</div>)}
              <div className="b-400 text-gray">
                @{tweet.parent?.user?.username} .</div>
              <div className="ml-2 text-gray">
                {helper.extractTime(tweet.parent?.create_date)}</div>
            </Box>
            <div className="mt-2 fs-15 lh-20">
              {tweet.parent?.content}
            </div>
            <Box display="flex"
              justifyContent="space-around" className="px-3 py-1 mt-2 fs-12">
              <div>
                <IconButton className="mr-1">
                  <FavoriteBorderIcon />
                </IconButton>
                {tweet.parent?.like_count}
              </div>
              <div>
                <IconButton className="mr-1"
                  onClick={()=> openReplyModal(tweet.parent)}>
                  <ChatBubbleOutlineIcon />
                </IconButton>
                {tweet.parent?.reply_count}
              </div>
              <div>
                <IconButton className="mr-1">
                  <CachedIcon />
                </IconButton>
                {tweet.parent?.retweet_count}
              </div>
            </Box>
          </div>
        </Box>}
        <Box className={tweet.is_reply ? 'px-3 mt-1' : 'px-3 mt-3'}>
          <Box display="flex" justifyContent="space-between"
            alignItems="center">
            <Box display="flex">
              <Avatar alt={tweet.user?.username}
                title={tweet.user?.username}
                className="w-48 h-48"
                src="/static/images/avatar/1.jpg" />
              <Box display="flex" flexDirection="column" justifyContent="center"
                className="ml-2">
                <Box className="b-600">
                  {tweet.user?.first_name}
                </Box>
                <Box className="text-gray mt-1">
                  {'@' + tweet.user?.username}</Box>
              </Box>
            </Box>
            <Box className="mr--6">
              <IconButton size="small" onClick={handleClickMoreBtn}>
                <MoreHorizIcon /></IconButton>
            </Box>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseMoreBtn}
            >
              <MenuItem onClick={handleCloseMoreBtn}>Profile</MenuItem>
              <MenuItem onClick={handleCloseMoreBtn}>Block User</MenuItem>
              <MenuItem onClick={handleCloseMoreBtn}>Report</MenuItem>
            </Menu>
          </Box>
          {tweet.is_reply && <div className="my-3">
            <span className="text-gray">Replying to </span>
            <Link to={'/profile/'+tweet.parent?.user?.id}
              className="link-color">
              @{tweet.parent?.user?.username}
            </Link>
          </div>}
          <Box className="mt-3">
          <img className="ti-media" src={tweet?.tweet_media}/>
            {tweet.content}
          </Box>
          <Box className="mt-4 text-gray fs-14">
            {helper.extractTime(tweet.create_date)}</Box>
          <Divider className="mt-3"/>
          <Box display="flex" className="py-3">
            <Box>{0} <Box component="span"
              className="text-gray">Retweets</Box></Box>

            <Box type="userLiked" className="userLiked" onClick={handleOpenLikedTweet}>
            {count+ '   ' +'likes'}
            </Box>
            <Modal
            open={openlikes}
            onClose={handleCloselikes}
            aria-labelledby="simple-modal-title"
            aria-describedby="sim"
            BackdropComponent={Backdrop}
            className="modal"
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={openlikes}>{likebody}</Fade>
          </Modal>
          
          </Box>
        </Box>
        <Box className="px-3"><Divider /></Box>
        <Box display="flex" justifyContent="space-around" className="px-3 py-1">
          <IconButton>
            <FavoriteBorderIcon />
          </IconButton>
          <IconButton onClick={()=> openReplyModal(tweet)}>
            <ChatBubbleOutlineIcon />
          </IconButton>
          <IconButton>
            <CachedIcon />
          </IconButton>
        </Box>
        <Divider />
      </Box>
      {tweet.children?.map((child) => (
        <Box key={child.id}>
          <TweetItem
            tweet={child}/>
          <Divider />
        </Box>
      ))}
      <ReplyModal tweet={replyModel} open={open} onClose={handleClose}
        onReply={doNothing}/>
    </div>
  );
};

export default TweetPage;
