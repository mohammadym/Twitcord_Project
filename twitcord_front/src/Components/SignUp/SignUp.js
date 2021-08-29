import React, {useState, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {Link, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {useStore} from 'react-redux';
import * as Actions from '../../redux/Actions/index.js';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import {TextField} from 'formik-material-ui';
import Container from '@material-ui/core/Container';
import {Formik, Form, Field} from 'formik';
import PropTypes from 'prop-types';
import * as API from '../../Utils/API/index';
import SnackbarAlert from '../Snackbar/Snackbar';
import * as Constants from '../../Utils/Constants.js';
import './SignUp.css';
import logo from '../../assets/twitcord.png';
/* eslint-disable */

/* eslint-disable require-jsdoc */
const SignUp = () => {
  const store = useStore();
  const history = useHistory();
  const isSnackbarOpen = useSelector((state) => state).tweet.isSnackbarOpen;
  const [snackbarAlertMessage, setSnackbarAlertMessage] = useState('');
  const [snackbarAlertSeverity, setSnackbarAlertSeverity] = useState('');
  const dispatch = useDispatch();

  useMemo(
    () => {
        dispatch(
          Actions.setSideDrawerEnable({
            enable: false,
          }),
      );
    },
    []
  );

  const handleSubmit = (values) => {
    dispatch(Actions.setSignUpInfo(values));
    API.signUp(store.getState().tweet.signUpInfo)
        .then((response) => {
          setSnackbarAlertMessage(
              Constants.SIGN_UP_VERIFICATION_SUCCESS_MESSAGE);
          setSnackbarAlertSeverity(
              Constants.SNACKBAR_SUCCESS_SEVERITY);
          dispatch(
              Actions.setSnackBarState({
                isSnackbarOpen: true,
              }),
          );
          history.push('/login');
        })
        .catch((error) => {
          setSnackbarAlertMessage(
              Constants.SIGN_UP_EMAIL_ERROR_MESSAGE);
          setSnackbarAlertSeverity(
              Constants.SNACKBAR_ERROR_SEVERITY);
          dispatch(
              Actions.setSnackBarState({
                isSnackbarOpen: true,
              }),
          );
        });
  };
  return (
    <div>
      <Container className="su-root" component="main" maxWidth="xs">
        {isSnackbarOpen && (<SnackbarAlert
          alertMessage={snackbarAlertMessage}
          severity={snackbarAlertSeverity}/>)}
        <CssBaseline />
        <div className="su-content-container">
          <img className="su-logo" src={logo} />
          <Formik
            initialValues={{
              username: '',
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validate={(values) => {
              const errors = {};
              if (!values.username) {
                errors.username = 'Required';
              }
              if (!values.firstName) {
                errors.firstName = 'Required';
              }
              if (!values.lastName) {
                errors.lastName = 'Required';
              }
              if (!values.email) {
                errors.email = 'Required';
              } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.
                  test(values.email)) {
                errors.email = 'Invalid email';
              }
              if (!values.password) {
                errors.password = 'Required';
              } else if (values.password.length < 8 ||
                !/\d/g.test(values.password) ||
                  /^\d*$/i.test(values.password)) {
                errors.password =
                'Password must contain at least 8 characters and numbers';
              }
              if (!values.confirmPassword) {
                errors.confirmPassword = 'Required';
              } else if (values.confirmPassword !== values.password) {
                errors.confirmPassword = 'Invalid password';
              }
              return errors;
            }}
            onSubmit={(values, {setSubmitting}) => {
              setSubmitting(false);
              handleSubmit(values);
            }}
          >
            {({submitForm, isSubmitting, errors, touched}) => (
              <Form className="form">
                <Field
                  component={TextField}
                  className="text-field"
                  label="Username"
                  variant="outlined"
                  name="username"
                />

                <Field
                  component={TextField}
                  className="text-field"
                  label="Email Address"
                  variant="outlined"
                  name="email"
                  type="email"
                />

                <Field
                  component={TextField}
                  className="text-field"
                  label="First Name"
                  variant="outlined"
                  name="firstName"
                />

                <Field
                  component={TextField}
                  className="text-field"
                  label="Last Name"
                  variant="outlined"
                  name="lastName"
                />

                <Field
                  component={TextField}
                  className="text-field"
                  label="Password"
                  variant="outlined"
                  name="password"
                  type="password"
                />

                <Field
                  component={TextField}
                  className="text-field"
                  label="Confirm Password"
                  variant="outlined"
                  name="confirmPassword"
                  type="password"
                />

                <Button
                  variant="contained"
                  className="text-field"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                    Sign Up
                </Button>
                <Link to="/login" className='log-in-redirection'>
                Already have an account? Sign in
                </Link>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
    </div>
  );
};

SignUp.propTypes = {
  username: PropTypes.string,
  email: PropTypes.string,
  password1: PropTypes.number,
  password2: PropTypes.number,
};

export default SignUp;
