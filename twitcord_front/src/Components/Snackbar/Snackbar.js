/* eslint-disable require-jsdoc */
import React from 'react';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {Snackbar} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import * as Actions from '../../redux/Actions/index.js';

const SnackbarAlert = ({alertMessage, severity}) => {
  const isSnackbarOpen = useSelector((state) => state).tweet.isSnackbarOpen;
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(
        Actions.setSnackBarState({
          isSnackbarOpen: false,
        }),
    );
  };
  return (
    <div>
      <Snackbar
        open={isSnackbarOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handleClose}
        autoHideDuration={6000}>
        <Alert open={isSnackbarOpen} onClose={handleClose} severity={severity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

SnackbarAlert.propTypes = {
  alertMessage: PropTypes.string,
  severity: PropTypes.string,
  isSnackbarOpen: PropTypes.bool,
};


export default SnackbarAlert;
