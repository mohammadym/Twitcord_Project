/* eslint-disable */
import React, {useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import {useHistory} from 'react-router-dom';
import {Modal, Typography} from '@material-ui/core';
import './ProfileUserinfo.css';
import Fade from '@material-ui/core/Fade';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import * as API from '../../Utils/API/index';
import Backdrop from '@material-ui/core/Backdrop';
import * as Actions from '../../redux/Actions/index.js';
import * as Constants from '../../Utils/Constants.js';
import Followers from '../Follows/Followers';
import Requests from '../Follows/Requests';
import Followings from '../Follows/Followings';
import Button from '@material-ui/core/Button';
import {useParams} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import DateRangeIcon from '@material-ui/icons/DateRange';
import headerDefaultImage from '../../assets/headerDefaultImage.jpg';


const ProfileUserinfo = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const profileInfo = useSelector((state) => state).tweet.profileInfo;
  const followcount = useSelector((state) => state).tweet.followcount;
  const [Situation, setSituation] = useState('');
  const [Relation, setRelation] = useState('');
  const userGeneralInfo = JSON.parse(localStorage.getItem(Constants.GENERAL_USER_INFO));
  const userId = JSON.parse(
      localStorage.getItem(Constants.GENERAL_USER_INFO),
  )?.pk;
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
  const [open, setOpen] = React.useState(false);
  const [Value, setValue] = React.useState(0);

  const handleOpenfollowers = () => {
    setOpen(true);
    setValue(1);
  };
  const handlerequests = () => {
    setOpen(true);
    setValue(3);
  };
  const handleOpenfollowing = () => {
    setOpen(true);
    setValue(2);
  };
  const handleedit = () =>{
    history.push('/notification');
  };
  const handleClose = () => {
    setOpen(false);
  };
  const body = (
    <div className="paper" xs={12} md={8}>
      {Value === 1 ?( <Followers /> ): Value === 2 ?( <Followings />): ( <Requests/>)}
    </div>
  );
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
  function onchange(event){
    console.log({"type": event.target.value });
    API.editfollowstatus( {"type": event.target.value } , id)
    .then((response) => {
      setRelation(response.data.type);
      console.log(Relation);
      
    })
    .catch((error) => {
      console.log(error);
    });
  }
  useEffect(() => {
    console.log('effect');
    API.getProfileInfo({id: id})
        .then((response) => {
          dispatch(Actions.setProfileInfo(response.data ));
          setSituation(response.data.status);
          setRelation(response.data.following_status);
       
        })
        .catch((error) => {
          console.log(error);
        });
    API.followcount({id: id})
        .then((response) => {
          dispatch(Actions.setfollowcount(response.data.results[0]));
        })
        .catch((error) => {
          console.log(error);
        });
  }, [id]);


  const getCover = () => {
    if (profileInfo.has_header_img) {
      return profileInfo.header_img;
    } else {
      return headerDefaultImage;
    }
  };

  const getProfilePhoto = () => {
    if (profileInfo.has_profile_img) {
      return profileInfo.profile_img;
    } else {
      return null;
    }
  };

  const date = new Date(profileInfo.date_joined);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dt = date.getDate();

  const handleEditProfileClick = () => {
    history.push('/edit-profile');
  };

  return (
    <Box >
      <Box className="position-relative">
        <img src={getCover()} alt="img" className="profile_cover" />
        <Avatar src={getProfilePhoto()} className="p-avatar" />
      </Box>
      
      <Box className="text-right p-3">
     
        {userGeneralInfo !== null && userGeneralInfo.email === profileInfo.email ? (
          <Button
            onClick={handleEditProfileClick}
            variant="contained"
            color="primary">
            edit profile
          </Button>
        ) : (
          Situation == 'not following' ? (
              <Button
                color="primary"
                onClick={() => handlefollow(profileInfo.id)}
                variant="contained">
                follow
              </Button>) : Situation == 'following' ? (
                <Button
                  color="primary"
                  onClick={() => handleunfollow(profileInfo.id)}
                  variant="contained">
                  unfollow
                </Button>) : Situation == 'pending' ? (
                <Button
                  color="primary"
                  onClick={() => handleunrequest(profileInfo.id)}
                  variant="contained">
                  pending
                </Button>) : (<button />)
        )}
         
      </Box>

      <Box className="px-3">
        <Typography className="fs-25 b-900 lh-1">
          {profileInfo.first_name + ' ' + profileInfo.last_name }
          {userGeneralInfo !== null && userGeneralInfo.email === profileInfo.email ?(
					       <div/> 
					) : (
             profileInfo.status === "following" ?( 

            <select className="relation" onChange = {onchange} value= {Relation}>
            <option value="Unfamiliar_person" className = "option">Unfamiliar person</option>
            <option value="Family" className = "option">family</option>
            <option value="Friend" className = "option">friend</option>
            <option value="Close_friend" className = "option">
              close friend
            </option>
          </select>
          ):(
            <div></div>
          )
          

					)}
      
        </Typography>
       
        <Typography className="color-gray">
          @{profileInfo.username}
        </Typography>
        <Typography className="mt-3">{profileInfo.bio}</Typography>
        <Box display="flex" alignItems="center" className="color-gray">
          <DateRangeIcon fontSize="small" className="mr-1" />
           Joined
          {' ' + dt + ' ' +
            monthNumberToLabelMap[month] +
            ' ' + year}
        </Box>

        <Box display="flex" className="mt-2">
          <Box type="followers" className="followers pointer" onClick={handleOpenfollowers}>
            {'followers' + '   ' + followcount.followers_count}
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className="modal"
            id="1"
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>{body}</Fade>
          </Modal>
          <Box type="followings" className="followings pointer" onClick={handleOpenfollowing}>
            {'followings' + '   ' + followcount.followings_count}
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="sim"
            value="followings"
            id="2"
            BackdropComponent={Backdrop}
            className="modal"
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>{body}</Fade>
          </Modal>
        </Box>

        {profileInfo.is_public === false && userGeneralInfo !== null && userGeneralInfo.email === profileInfo.email ? (
          <Grid item>

            <Box type="requests" className="requests" onClick={handlerequests}>
              requests
              </Box>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="sim"
              value="requests"
              id="2"
              BackdropComponent={Backdrop}
              className="modal"
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={open}>{body}</Fade>
            </Modal>
          </Grid>) : null}
      </Box>

    </Box>
  );
};
export default ProfileUserinfo;
