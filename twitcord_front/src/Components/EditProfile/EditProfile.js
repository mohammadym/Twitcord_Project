import React, {useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import './EditProfile.css';
import {Formik, Form, Field} from 'formik';
import {Button} from '@material-ui/core';
import {TextField, CheckboxWithLabel} from 'formik-material-ui';
import {DatePicker} from 'formik-material-ui-pickers';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import DateFnsUtils from '@date-io/date-fns';
import * as API from '../../Utils/API/index';
import * as Actions from '../../redux/Actions/index';
import FormGroup from '@material-ui/core/FormGroup';
import * as Constants from '../../Utils/Constants.js';
import SnackbarAlert from '../Snackbar/Snackbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import AddAPhotoOutlinedIcon from '@material-ui/icons/AddAPhotoOutlined';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import minioClient from '../../Utils/Minio';
import headerDefaultImage from '../../assets/headerDefaultImage.jpg';

let coverFile = null;
let photoFile = null;
let clearCover = false;
let clearPhoto = false;

const EditProfile = () => {
  const dispatch = useDispatch();
  const [snackbarAlertMessage, setSnackbarAlertMessage] = useState('');
  const [snackbarAlertSeverity, setSnackbarAlertSeverity] = useState('');
  const [clearCoverLocal, setClearCoverLocal] = useState(false);
  const [clearPhotoLocal, setClearPhotoLocal] = useState(false);
  const isSnackbarOpen = useSelector((state) => state).tweet.isSnackbarOpen;
  const profileInfo = useSelector((state) => state).tweet.profileInfo;

  let photoInput;
  let coverInput;

  const userGeneralInfo = JSON.parse(
      localStorage.getItem(Constants.GENERAL_USER_INFO),
  );

  const profileId = userGeneralInfo?.pk ? userGeneralInfo?.pk : -1;

  const getCover = () => {
    if (profileInfo.has_header_img && !clearCoverLocal) {
      return profileInfo.header_img;
    } else {
      return headerDefaultImage;
    }
  };

  const getProfilePhoto = () => {
    if (profileInfo.has_profile_img && !clearPhotoLocal) {
      return profileInfo.profile_img;
    } else {
      return null;
    }
  };

  const requestProfileInfo = () => {
    API.getProfileInfo({id: profileId})
        .then((response) => {
          handleProfileInfoResponse(dispatch, response.data);
        })
        .catch((error) => {
          showSnackbar(
              Constants.EDIT_PROFILE_FETCH_PROFILE_ERROR_MESSAGE,
              Constants.SNACKBAR_ERROR_SEVERITY,
          );
        });
  };

  const showSnackbar = (
      message,
      severity,
  ) => {
    setSnackbarAlertMessage(
        message);
    setSnackbarAlertSeverity(
        severity);
    dispatch(
        Actions.setSnackBarState({
          isSnackbarOpen: true,
        }),
    );
  };

  const handleProfileInfoResponse = (dispatch, data) => {
    saveProfileInfo(dispatch, data);
  };

  const saveProfileInfo = (dispatch, data) => {
    dispatch(Actions.setProfileInfo(data));
  };

  const onSubmitClicked = (
      data,
  ) => {
    if (typeof(data.birthday) === 'number') {
      data.birthday = profileInfo.birthday;
    }

    let hasCover = profileInfo.has_header_img && !clearCover;
    let hasPhoto = profileInfo.has_profile_img && !clearPhoto;

    const isDataChanged = checkDataChanged(profileInfo, data);

    if (coverFile !== null) {
      uploadPhoto(true);
      hasCover = true;
    }

    if (photoFile !== null) {
      uploadPhoto(false);
      hasPhoto = true;
    }

    if (isDataChanged) {
      const dataToSend = {
        bio: data.bio,
        birth_date: data.birthday,
        first_name: data.firstName,
        last_name: data.lastName,
        website: data.website,
        username: data.username,
        is_public: data.isPublic,
        has_header_img: hasCover,
        has_profile_img: hasPhoto,
      };

      API.updateProfileInfo(profileId, dataToSend)
          .then((response) => {
            saveProfileInfo(dispatch, response.data);
            showSnackbar(
                Constants.EDIT_PROFILE_UPDATE_PROFILE_SUCCESS_MESSAGE,
                Constants.SNACKBAR_SUCCESS_SEVERITY,
            );
          }).catch((error) => {
            showSnackbar(
                Constants.EDIT_PROFILE_UPDATE_PROFILE_ERROR_MESSAGE,
                Constants.SNACKBAR_ERROR_SEVERITY,
            );
          });
    } else {
      showSnackbar(
          Constants.EDIT_PROFILE_UPDATE_PROFILE_NO_CHANGE_MESSAGE,
          Constants.SNACKBAR_ERROR_SEVERITY,
      );
    }
  };

  const checkDataChanged = (profileInfo, data) => {
    if (data.username !== profileInfo.username) {
      return true;
    }

    if (data.firstName !== profileInfo.first_name) {
      return true;
    }

    if (data.lastName !== profileInfo.last_name) {
      return true;
    }

    if (data.birthday !== profileInfo.birth_date) {
      return true;
    }

    if (data.bio !== profileInfo.bio) {
      return true;
    }

    if (data.website !== profileInfo.website) {
      return true;
    }

    if (data.isPublic !== profileInfo.is_public) {
      return true;
    }

    if (coverFile !== null) {
      return true;
    }

    if (photoFile !== null) {
      return true;
    }

    if (clearPhoto || clearCover) {
      return true;
    }

    return false;
  };

  const clearCoverImage = () => {
    setClearCoverLocal(true);
    clearCover = true;
    showSnackbar(
        Constants.COVER_CLEARED,
        Constants.SNACKBAR_SUCCESS_SEVERITY,
    );
  };

  const clearPhotoImage = () => {
    setClearPhotoLocal(true);
    clearPhoto = true;
    showSnackbar(
        Constants.PHOTO_CLEARED,
        Constants.SNACKBAR_SUCCESS_SEVERITY,
    );
  };

  const handleUploadProfilePhotoClick = () => {
    photoInput.click();
  };

  const handleUploadProfileCoverClick = () => {
    coverInput.click();
  };

  const setProfilePhotoDetails = (file)=>{
    photoFile = file;
  };

  const setCoverDetails = (file)=>{
    coverFile = file;
  };

  const uploadPhoto = (isCover) => {
    let file;
    let bucketName;
    let objectName;

    if (isCover) {
      file = coverFile;
      bucketName = profileInfo.header_img_upload_details.bucket_name;
      objectName = profileInfo.header_img_upload_details.object_name;
    } else {
      file = photoFile;
      bucketName = profileInfo.profile_img_upload_details.bucket_name;
      objectName = profileInfo.profile_img_upload_details.object_name;
    }

    minioClient.presignedPutObject(
        bucketName,
        objectName,
        function(err, presignedUrl) {
          if (err) return console.log(err);
          API.uploadPhoto({file: file, url: presignedUrl});
        });
  };

  useEffect(() => {
    requestProfileInfo();
  }, []);

  return (
    <Grid container direction="column">
      <Grid item className="ep-grid-item" xs>
        <img src={getCover()} className="ep-profile_cover" />
        <Avatar src={getProfilePhoto()} className="ep-avatar" />
        <Avatar
          onClick={handleUploadProfilePhotoClick}
          className="ep-edit-photo-icon">
          <AddAPhotoOutlinedIcon />
        </Avatar>
        <AddAPhotoIcon
          onClick={handleUploadProfileCoverClick}
          className="ep-edit-cover-icon"/>
        { profileInfo.has_header_img && !clearCoverLocal &&
        <HighlightOffIcon
          onClick={clearCoverImage}
          className="ep-clear-cover-icon"/>
        }
        { profileInfo.has_profile_img && !clearPhotoLocal &&
         <Avatar
           onClick={clearPhotoImage}
           className="ep-clear-photo-icon">
           <HighlightOffIcon />
         </Avatar> }
        <input
          type="file"
          id="file"
          accept="image/*"
          onChange={(e) =>
            setProfilePhotoDetails(e.target.files[0])}
          ref={(ref) => photoInput = ref}
          style={{display: 'none'}}/>
        <input
          type="file"
          id="file"
          accept="image/*"
          onChange={(e) => setCoverDetails(e.target.files[0])}
          ref={(ref) => coverInput = ref}
          style={{display: 'none'}}/>
      </Grid>

      <Grid container>
        <Grid item xs>
          <div>
            {isSnackbarOpen && (<SnackbarAlert
              alertMessage={snackbarAlertMessage}
              severity={snackbarAlertSeverity}/>)}
            <CssBaseline />
            <Formik
              enableReinitialize
              initialValues={{
                username: profileInfo.username || '',
                firstName: profileInfo.first_name || '',
                lastName: profileInfo.last_name || '',
                website: profileInfo.website || '',
                bio: profileInfo.bio || '',
                birthday: Date.parse(profileInfo.birth_date) || '',
                isPublic: !profileInfo.is_public,
              }}
              validate={(values) => {
                const errors = {};
                if (!values.firstName) {
                  errors.firstName = 'Required';
                }

                if (!values.lastName) {
                  errors.lastName = 'Required';
                }

                if (
                  values.website &&
                !values.website.match(
                    '^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9]'+
                    '[-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#'+
                    '\\?&/=%]*)?$',
                )
                ) {
                  errors.website = 'Invalid Url';
                }

                return errors;
              }}
              onSubmit={(values, {setSubmitting}) => {
                setSubmitting(false);
                onSubmitClicked(
                    {...values, isPublic: !values.isPublic},
                );
              }}
            >
              {({submitForm, isSubmitting}) => (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Form className="ep-form">
                    <Field
                      id="username"
                      component={TextField}
                      className="ep-text-field"
                      label="Username"
                      variant="outlined"
                      name="username"
                    />

                    <Field
                      component={TextField}
                      className="ep-text-field"
                      label="First Name"
                      variant="outlined"
                      name="firstName"
                    />

                    <Field
                      component={TextField}
                      className="ep-text-field"
                      label="Last Name"
                      variant="outlined"
                      name="lastName"
                    />

                    <Field
                      component={DatePicker}
                      className="ep-text-field"
                      variant="outlined"
                      name="birthday"
                      label="Birth Day"
                      maxDate={new Date()}
                    />

                    <Field
                      component={TextField}
                      className="ep-text-field"
                      label="Website"
                      variant="outlined"
                      name="website"
                    />

                    <Field
                      component={TextField}
                      className="ep-text-field"
                      label="Bio"
                      variant="outlined"
                      name="bio"
                      multiline
                      rows={4}
                    />
                    <FormGroup className="ep-check-box">
                      <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        color="primary"
                        Label={{label: 'Private Account'}}
                        name="isPublic"
                      />
                    </FormGroup>
                    <Button
                      variant="contained"
                      className="ep-text-field"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={submitForm}
                    >
                    Submit
                    </Button>
                  </Form>
                </MuiPickersUtilsProvider>
              )}
            </Formik>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EditProfile;
