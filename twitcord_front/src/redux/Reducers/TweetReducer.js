import {ActionTypes} from '../Actions/actionTypes.js';

const initialState = {
  signUpInfo: {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password1: '',
    password2: '',
  },
  logInInfo: {
    email: '',
    password: '',
  },
  userSearchResult: [],
  tweetSearchResult: [],
  profileInfo: {
    bio: '',
    birth_date: '',
    date_joined: '',
    email: '',
    first_name: '',
    followers_count: 0,
    following_status: '',
    followings_count: 0,
    has_header_img: false,
    has_profile_img: false,
    header_img: '',
    header_img_upload_details: '',
    id: 0,
    is_active: false,
    is_public: false,
    last_name: '',
    profile_img: '',
    status: '',
    type: '',
    username: '',
    website: '',
  },
  followcount: {
    pk: 0,
    followers_count: 0,
    followings_count: 0,
  },
  sideDrawerEnable: true,
  tweetText: '',
  tweetCharCount: 0,
  searchInput: '',
};

const tweetReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case ActionTypes.SET_SIGN_UP_INFO:
      return {
        ...state,
        signUpInfo: {
          ...state.signUpInfo,
          username: action.username,
          email: action.email,
          first_name: action.firstName,
          last_name: action.lastName,
          password1: action.password,
          password2: action.confirmPassword,
        },
      };

    case ActionTypes.SET_LOG_IN_INFO:
      return {
        ...state,
        logInInfo: {
          ...state.logInInfo,
          email: action.email,
          password: action.password,
        },
      };

    case ActionTypes.SET_TWEET_TEXT:
      return {
        ...state,
        tweetText: action.tweetText,
        tweetCharCount: action.tweetText.length,
      };

    case ActionTypes.SET_SEARCH_INPUT: {
      return {
        ...state,
        searchInput: action.input,
      };
    }

    case ActionTypes.SET_SNACKBAR_STATE: {
      return {
        ...state,
        isSnackbarOpen: action.isSnackbarOpen,
      };
    }

    case ActionTypes.SET_USER_SEARCH_RESULT: {
      return {
        ...state,
        userSearchResult: action.users,
      };
    }
    case ActionTypes.SET_FOLLOW_COUNT: {
      return {
        ...state,
        followcount: {
          ...state.followcount,
          pk: action.pk,
          followers_count: action.followers_count,
          followings_count: action.followings_count,
        },
      };
    }
    case ActionTypes.SET_TWEET_SEARCH_RESULT: {
      return {
        ...state,
        tweetSearchResult: action.tweets,
      };
    }

    case ActionTypes.SET_PROFILE_INFO: {
      console.log('reducer'+ action);
      return {
        ...state,
        profileInfo: {
          ...state.profileInfo,
          bio: action.bio,
          birth_date: action.birth_date,
          date_joined: action.date_joined,
          email: action.email,
          first_name: action.first_name,
          followers_count: action.followers_count,
          following_status: action.following_status,
          followings_count: action.followings_count,
          has_header_img: action.has_header_img,
          has_profile_img: action.has_profile_img,
          header_img: action.header_img,
          header_img_upload_details: action.header_img_upload_details,
          profile_img: action.profile_img,
          profile_img_upload_details: action.profile_img_upload_details,
          id: action.id,
          is_active: action.is_active,
          is_public: action.is_public,
          last_name: action.last_name,
          profile_img: action.profile_img,
          status: action.status,
          type: action.type,
          username: action.username,
          website: action.website,
        },
      };
    }

    case ActionTypes.SET_USER_GENERAL_INFO: {
      return {
        ...state,
        userGeneralInfo: {
          ...state.userGeneralInfo,
          userID: action.pk,
          userEmail: action.email,
          userProfile: action.profile_img,
        },
      };
    }
    case ActionTypes.SET_SEARCH_INPUT: {
      return {
        ...state,
        searchInput: action.input,
      };
    }
    case ActionTypes.SET_SIDE_DRAWER_ENABLE: {
      return {
        ...state,
        sideDrawerEnable: action.enable,
      };
    }

    default:
      return state;
  }
};

export default tweetReducer;
