import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Grid from '@material-ui/core/Grid';
import './TweetBox.css';
import PropTypes from 'prop-types';
import * as Constants from '../../Utils/Constants.js';
import CharCounter from '../CharCounter/CharCounter';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import * as API from '../../Utils/API/index';
import * as Actions from '../../redux/Actions/index';
import SnackbarAlert from '../Snackbar/Snackbar';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import minioClient from '../../Utils/Minio';

/* eslint-disable */
let hasMedia = false;
let photoUploadDetails = null;

const TweetBox = () => {
  const tweetInfo = useSelector((state) => state).tweet;
  const dispatch = useDispatch();
  const isSnackbarOpen = useSelector((state) => state).tweet.isSnackbarOpen;
  const [snackbarAlertMessage, setSnackbarAlertMessage] = useState('');
  const [snackbarAlertSeverity, setSnackbarAlertSeverity] = useState('');
  const [media, setMedia] = useState(null);
  let photoInput;
  const postButtonDisable =
  tweetInfo.tweetCharCount > Constants.TWEET_CHAR_LIMIT ||
  tweetInfo.tweetText.length == 0;

  const clearTweet = () => {
    onClearMedia();
    dispatch(Actions.setTweetText({
      tweetText: '',
    }));
  };

  const handlePostClick = () => {
    const tweetData = {content: tweetInfo.tweetText, has_media: hasMedia};
    const userId = JSON.parse(
        localStorage.getItem(Constants.GENERAL_USER_INFO),
    )?.pk;

    API.postTweet(tweetData, userId)
        .then((response) => {
          photoUploadDetails = response.data.tweet_media_upload_details;
          clearTweet();
          if (photoInput != null){
            uploadPhoto()
          }
        })
        .catch((error) => {
          setSnackbarAlertMessage(
              Constants.TWEET_FAILURE_MESSAGE);
          setSnackbarAlertSeverity(
              Constants.SNACKBAR_ERROR_SEVERITY);
          setMedia(null);
          dispatch(
              Actions.setSnackBarState({
                isSnackbarOpen: true,
              }),
          );
        });
  };

  const uploadPhoto = () => {
    minioClient.presignedPutObject(
      photoUploadDetails.bucket_name,
      photoUploadDetails.object_name,
      function(err, presignedUrl) {
        API.uploadPhoto({file: media, url: presignedUrl})
        .then(
          res => {
            setSnackbarAlertMessage(
              Constants.TWEET_SUCCESS_MESSAGE);
          setSnackbarAlertSeverity(
              Constants.SNACKBAR_SUCCESS_SEVERITY);
          dispatch(
              Actions.setSnackBarState({
                isSnackbarOpen: true,
              }),
          );
          }
        ).catch(
          err => {
            setSnackbarAlertMessage(
              Constants.TWEET_FAILURE_MESSAGE);
          setSnackbarAlertSeverity(
              Constants.SNACKBAR_ERROR_SEVERITY);
          setMedia(null);
          dispatch(
              Actions.setSnackBarState({
                isSnackbarOpen: true,
              }),
          );
          }
          );
      });
  }

  const onPhotoChange = (file) => {
    setMedia(file);
    hasMedia = true;
  };

  const onAddPhotoClick = () => {
    photoInput.click();
  };

  const onClearMedia = () => {
    setMedia(null);
    hasMedia = false;
  };

  const getMediaUrl = () => {
    return URL.createObjectURL(media);
  };

  return (
    <div>
      <Grid container className="tweet-box">
        {isSnackbarOpen && (<SnackbarAlert
          alertMessage={snackbarAlertMessage}
          severity={snackbarAlertSeverity}/>)}
        <Grid container direction="column" item xs={12}>

          {
          media !== null ?
          <Grid item className="tb-media-container">
            <img
              className="tb-media"
              src={getMediaUrl()}/>
            <HighlightOffIcon
              onClick={onClearMedia}
              className="tb-clear-media"/>
          </Grid> : null
          }

          <Grid item>
            <TextareaAutosize
              rowsMin={Constants.TWEET_BOX_ROW_MIN}
              rowsMax={Constants.TWEET_BOX_ROW_MAX}
              placeholder="what is in your mind?"
              onChange={(e) =>
                dispatch(
                    Actions.setTweetText({
                      tweetText: e.target.value,
                    }),
                )
              }
              value={tweetInfo.tweetText}
            />
          </Grid>
        </Grid>
      </Grid>
      <div className="d-flex align-items-center justify-content-between p-10">
        <input
          type="file"
          id="file"
          onChange={(e) =>{
            onPhotoChange(e.target.files[0]);
            e.target.value = '';
          }}
          ref={(ref) => photoInput = ref}
          style={{display: 'none'}}/>
        <div className="tb-items-box" id="tb_items_container">
          <CharCounter numChar={tweetInfo.tweetCharCount} />
          <AddPhotoAlternateIcon
            id="add-photo"
            onClick={onAddPhotoClick}
            className="tb-image-icon"/>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePostClick}
          disabled={postButtonDisable}
        >
        post
        </Button>
      </div>
    </div>
  );
};
// eslint-disable-next-line require-jsdoc
TweetBox.propTypes = {
  tweetText: PropTypes.string,
  tweetCharCount: PropTypes.number,
};

export default TweetBox;
