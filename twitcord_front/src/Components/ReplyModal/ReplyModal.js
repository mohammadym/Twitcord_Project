import React, {useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import './ReplyModal.css';
import {makeStyles} from '@material-ui/core/styles';
import * as API from '../../Utils/API/index';
import {Link} from 'react-router-dom';
import CharCounter from '../CharCounter/CharCounter';
import * as Constants from '../../Utils/Constants';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TweetItem from '../TweetItem/TweetItem';


const useStyles = makeStyles((theme) => ({
  scrollPaper: {
    alignItems: 'baseline',
  },
  paper: {
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      width: '100%',
      height: '100%',
      maxHeight: 'none',
      borderRadius: 0,
    },
  },
  popper: {
    transform: 'transalte3d(16px, 20px, 0px)',
  },
}));

export const ReplyModal = (props) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const {onClose, onReply, open} = props;
  const [tweetInfo, setTweetInfo] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);

  const isSubmitDisable = () =>
    (tweetInfo.length==0 || tweetInfo.length >= Constants.TWEET_CHAR_LIMIT);

  const classes = useStyles();

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitting(false);
      setTweetInfo('');
    }, 500);
  };

  const replyTweet = () => {
    const reqData = {content: tweetInfo, parent: props.tweet?.id};
    if (!isSubmitting) {
      setSubmitting(true);
      API.replyTweet(reqData)
          .then((res) => {
            handleClose();
            onReply();
          })
          .catch((error) => {
            console.log(error, 'error');
            setSnackOpen(true);
            setSubmitting(false);
          });
    }
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
        Problem occured during the replying
        </MuiAlert>
      </Snackbar>
      <Dialog classes={{scrollPaper: classes.scrollPaper, paper: classes.paper}}
        onClose={handleClose} aria-labelledby="customized-dialog-title"
        open={open}>
        {isSubmitting && <LinearProgress />}
        <DialogTitle className="px-12 py-4-px"
          id="customized-dialog-title" onClose={handleClose}
        >
          <Box display="flex" justifyContent="space-between"
            alignItems="center">
            <Hidden xsDown>
              <Tooltip title="close">
                <IconButton onClick={handleClose} aria-label="close">
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Hidden>
            <Hidden smUp>
              <Tooltip title="back">
                <IconButton onClick={handleClose} aria-label="close">
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
            </Hidden>
            <Hidden smUp>
              <Button
                variant="contained"
                className="fs-12"
                disabled={isSubmitDisable() || isSubmitting}
                color="primary"
                onClick={replyTweet}
              >
                Reply
              </Button>
            </Hidden>
          </Box>
        </DialogTitle>
        <DialogContent className="px-12 overflow-x-hidden" dividers>
          <Box display="flex" className="min-w-50 min-w-auto-sm">
            <Box display="flex" alignItems="center" flexDirection="column">
              <Avatar alt={props.tweet?.user?.username}
                title={props.tweet?.user?.username}
                className="w-48 h-48"
                src="/static/images/avatar/1.jpg" />
              <div className="vl mt-1 br-33"></div>
            </Box>
            <div className="ml-2 w-100">
              <Box display="flex">
                <div className="b-900 fs-15 b-700 lh-20">
                  {props.tweet?.user?.first_name +
                  ' ' + props.tweet?.user?.last_name}</div>
                <div className="ml-2 fs-15 b-400 lh-20 text-gray">
                  @{props.tweet?.user?.username}</div>
                {/* <div className="ml-2">
                {extractTime(props.tweet?.createDate)}</div> */}
              </Box>
              <div className="mt-2 fs-15 lh-20">
                {props.tweet?.content}
              </div>
              {props.tweet?.retweet_from &&
              <Box className={props.tweet?.content ?
               'px-3 pt-3 ml--3' : 'p-0 ml--3'}>
                <TweetItem isInfoVisable={props.tweet?.content ? false : true}
                  tweet={props.tweet?.retweet_from}></TweetItem>
              </Box>}
              <div className="my-3">
                <span className="text-gray">Replying to </span>
                <Link to={'/profile/'+props.tweet?.user?.id}
                  className="link-color">
                  @{props.tweet?.user?.username}
                </Link>
              </div>
            </div>
          </Box>
          <Box display="flex" className="mt-1">
            <Avatar alt={props.tweet?.user?.username}
              title={props.tweet?.user?.username}
              className="w-48 h-48"
              src="/static/images/avatar/1.jpg" />
            <TextareaAutosize
              disabled={isSubmitting}
              rowsMin={4}
              className="custom-textarea fs-20"
              placeholder="Tweet your reply"
              value={tweetInfo}
              onChange={(e) => setTweetInfo(e.target.value)}
            />
          </Box>
          {!isSubmitting && <Box display="flex" className="mt-2"
            justifyContent={{xs: 'flex-end', sm: 'space-between'}}>
            <CharCounter numChar={tweetInfo.length} />
            <Hidden xsDown>
              <Button
                variant="contained"
                className="d-block"
                disabled={isSubmitDisable()}
                color="primary"
                onClick={replyTweet}
              >
                Reply
              </Button>
            </Hidden>
          </Box>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

ReplyModal.propTypes = {
  onReply: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  tweet: PropTypes.object,
};
