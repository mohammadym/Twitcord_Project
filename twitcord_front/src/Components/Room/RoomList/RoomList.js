import {Divider, TextField, Typography} from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import RoomItem from '../RoomItem/RoomItem';
import './RoomList.css';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import {useDispatch} from 'react-redux';
import Backdrop from '@material-ui/core/Backdrop';
import Avatar from '@material-ui/core/Avatar';
import * as Actions from '../../../redux/Actions/index';
import ImageIcon from '@material-ui/icons/Image';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import * as API from '../../../Utils/API/index';
import * as Constants from '../../../Utils/Constants.js';
import ClearIcon from '@material-ui/icons/Clear';
import minioClient from '../../../Utils/Minio';
import PropTypes from 'prop-types';

/* eslint-disable*/
let hasImage = false;
import {Link} from 'react-router-dom';
/* eslint-disable */

const RoomList = (props) => {
  const [open, setOpen] = React.useState(false);
  const [rooms, setRooms] = React.useState([]);
  const dispatch = useDispatch();
  const [snackbarAlertMessage, setSnackbarAlertMessage] = useState('');
  const [snackbarAlertSeverity, setSnackbarAlertSeverity] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [postButtonDisabled, setPostButtonDisabled] = useState(true);
  const [roomTitle, setRoomTitle] = useState('');
  const [selectedOptionIds, setSelectedOptionIds] = useState([]);
  const [media, setMedia] = useState(null);
  const optionIds = [];
  let photoInput;
  const userGeneralInfo = JSON.parse(
      localStorage.getItem(Constants.GENERAL_USER_INFO),
  );

  useEffect(() => {
    API.getRoomsList({id: userGeneralInfo.pk})
        .then((response) => {
          const rooms = response.data.results;
          console.log(rooms)
          setRooms(rooms);
        })
        .catch((error) => {
        });

    API.getFollowersList({id: userGeneralInfo.pk})
        .then((response) => {
          const followers = response.data.results.map((item) => {
            return {value: item.id, label: item.username};
          });

          followers
              .map((item) => {
                options.push(item);
                optionIds.push(item.value);
              });
          setOptions(options);
        });
  }, []);

  const openCreateRoomModal = () => {
    setOpen(true);
    setPostButtonDisabled(true);
  };

  const closeCreateRoomModal = () => {
    setOpen(false);
    setRoomTitle('');
    setSelectedOptionIds([]);
    setSelectedOption(null);
  };

  const handlePostClick = () => {
    const data = {
      owner: userGeneralInfo.pk,
      title: roomTitle,
      users: selectedOptionIds,
      has_image: hasImage
    };

    API.createRoom(data)
        .then((response) => {
          closeCreateRoomModal();
          uploadPhoto(response.data.room_img_upload_details)
          setRooms([...rooms, {
            id: response.data.id,
            title: response.data.title,
            owner: response.data.owner,
            users: response.data.users,
            number_of_members: response.data.number_of_members,
            room_img: getMediaUrl()
          }]);
        })
        .catch((error) => {
        });
  };

  const handleTextChange = (text) => {
    setRoomTitle(text);

    if (text.length > 0) {
      setPostButtonDisabled(false);
    } else {
      setPostButtonDisabled(true);
    }
  };

  const handleSelectChange = (selectedOptions) => {
    setSelectedOptionIds(selectedOptions.map((so) => so.value));
    setSelectedOption(selectedOptions);
  };

  const uploadPhoto = (roomPhotoUploadDetails) => {
    minioClient.presignedPutObject(
      roomPhotoUploadDetails.bucket_name,
      roomPhotoUploadDetails.object_name,
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
    hasImage = true;
  };

  const onAddPhotoClick = () => {
    photoInput.click();
  };

  const onClearMedia = () => {
    setMedia(null);
    hasImage = false;
  };

  const getMediaUrl = () => {
    if (media == null){
      return null;
    }
    return URL.createObjectURL(media);
  };

  const roomsList = rooms.map((room) => <Link 
  key={room.id} 
  to={'/chat/'+room.id} 
  >
    <div>
      <RoomItem room={room}/>
      <Divider/>
    </div>
  </Link>);

  return (
    <div className="rl-root">
      {roomsList}
      {!props.self && <Fab
        className="rl-fab"
        color="primary"
        aria-label="add"
        onClick={openCreateRoomModal}>
        <AddIcon />
      </Fab>}
      <Modal
        className="rl-modal"
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={closeCreateRoomModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <form className="rl-paper">
            <Typography className="rl-title">Create Room</Typography>
            <Avatar 
            src={getMediaUrl()}
            className="rl-avatar" 
            onClick={onAddPhotoClick}
            alt="room name">
              <ImageIcon className="rl-icon"/>
            </Avatar>
            {media != null && <ClearIcon
              className="rl-clear"
              onClick={onClearMedia}
             />}
            <input
            accept="image/*"
            type="file"
            id="file"
            onChange={(e) =>{
              onPhotoChange(e.target.files[0]);
              e.target.value = '';
            }}
            ref={(ref) => photoInput = ref}
            style={{display: 'none'}}/>
            <TextField
              className="rl-room-name"
              label="room name"
              required
              value={roomTitle}
              onChange={(e) => handleTextChange(e.target.value)}
            />
            <Select
              className="rl-select"
              placeholder="Select Members"
              isMulti
              value={selectedOption}
              onChange={
                (selectedOptions) => handleSelectChange(selectedOptions)
              }
              options={options}
            />
            <Button
              className="rl-create-room"
              variant="contained"
              color="primary"
              onClick={handlePostClick}
              disabled={postButtonDisabled}>create</Button>
          </form>
        </Fade>
      </Modal>
    </div>
  );
};

RoomList.propTypes = {
  self: PropTypes.bool,
};

export default RoomList;
