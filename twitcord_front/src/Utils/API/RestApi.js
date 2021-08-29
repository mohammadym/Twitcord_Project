import axios from 'axios';
import * as Constants from '../Constants.js';

/* eslint-disable */
const instance = axios.create({
  baseURL: Constants.BASE_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const withoutAuthInstance = axios.create({
  baseURL: Constants.BASE_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const request = (data, params, url, method) => {
  if (url !== Constants.URL_SIGN_UP && url !== Constants.URL_LOG_IN) {
    return instance({
      method: method,
      url: url,
      params: params,
      data,
      headers: {
        'Authorization': 'token ' + localStorage.getItem('token'),
      },
    });
  } else {
    return withoutAuthInstance({
      method: method,
      url: url,
      data,
    });
  }
};

export const signUp = (data) => {
  return request(
      data,
      {},
      Constants.URL_SIGN_UP,
      Constants.POST_REQUEST_METHOD,
  );
};

export const postTweet = (data, userId) => {
  return request(
      data,
      {},
      Constants.URL_USER + userId + Constants.URL_TWEET,
      Constants.POST_REQUEST_METHOD,
  );
};

export const logIn = (data) => {
  return request(data, {}, Constants.URL_LOG_IN, Constants.POST_REQUEST_METHOD);
};

export const rejectfollowrequest = (data, params) => {
  return request(
      data,
      params,
      Constants.REJECT_FOLLOW_REQUEST.replace('{id}', data.id),
      Constants.PATCH_REQUEST_METHOD,
  );
};
export const acceptfollowrequest = (data, params) => {
  return request(
      data,
      params,
      Constants.ACCEPT_FOLLOW_REQUEST.replace('{id}', data.id),
      Constants.PATCH_REQUEST_METHOD,
  );
};


export const searchUsers = (data, params) => {
  return request(
      data,
      params,
      Constants.URL_SEARCH_USER,
      Constants.GET_REQUEST_METHOD,
  );
};

export const searchTweets = (data, params) => {
  return request(
      data,
      params,
      Constants.URL_SEARCH_TWEET,
      Constants.GET_REQUEST_METHOD,
  );
};

export const getProfileInfo = (data) => {
  return request(
      data,
      {},
      Constants.URL_PROFILE_INFO.replace('{id}', data.id),
      Constants.GET_REQUEST_METHOD,
  );
};

export const updateProfileInfo = (id, data) => {
  return request(
      data,
      {},
      Constants.URL_PROFILE_INFO.replace('{id}', id),
      Constants.PATCH_REQUEST_METHOD,
  );
};

export const followcount = (data) => {
  return request(
      data,
      {},
      Constants.URL_FOLLOW_COUNT.replace('{id}', data.id),
      Constants.GET_REQUEST_METHOD,
  );
};

export const userGeneralInfo = (data) => {
  return request(
      data,
      {},
      Constants.URL_USER_GENERAL_INFO,
      Constants.GET_REQUEST_METHOD,
  );
};

export const uploadPhoto = (data) => {
  return request(
      data.file,
      {},
      data.url,
      'PUT',
  );
};

export const replyTweet = (data) => {
  return request(
      data,
      {},
      Constants.URL_REPLY,
      Constants.POST_REQUEST_METHOD,
  );
};

export const createRoom = (data) => {
  return request(
      data,
      {},
      Constants.URL_CREATE_ROOM,
      Constants.POST_REQUEST_METHOD,
  );
};

export const getFollowersList = (data) => {
  return request(
      {},
      {},
      Constants.URL_FOLLOWERS_LIST.replace('{id}', data.id),
      Constants.GET_REQUEST_METHOD,
  );
};

export const getFollowingsList = (data) => {
  return request(
      {},
      {},
      Constants.URL_FOLLOWINGS_LIST.replace('{id}', data.id),
      Constants.GET_REQUEST_METHOD,
  );
};

export const getRoomsList = (data) => {
  return request(
      {},
      {},
      Constants.URL_ROOMS_LIST.replace('{id}', data.id),
      Constants.GET_REQUEST_METHOD,
  );
};

export const getmessages = (data) => {
  return request(
      {},
      {},
      Constants.URL_MESSAGES
        .replace('{id}', data.id)
        .replace('{page}', data.page),
      Constants.GET_REQUEST_METHOD,
  );
};

export const getroominfo = (data) => {
  return request(
      {},
      {},
      Constants.URL_ROOM_INFO.replace('{id}', data.id),
      Constants.GET_REQUEST_METHOD,
  );
};
export const followerslist = (data) => {
  return request(
      data,
      {},
      Constants.URL_FOLLOWERS.replace('{id}', data.id),
      Constants.GET_REQUEST_METHOD,
  );
};
export const followingslist = (data) => {
  return request(
      data,
      {},
      Constants.URL_FOLLOWINGS.replace('{id}', data.id),
      Constants.GET_REQUEST_METHOD,
  );
};

export const like = ( id , data) => {
  
  return request(
      data,
      {},
      Constants.URL_LIKE.replace('{id}' , id),
      Constants.POST_REQUEST_METHOD,
  );
};

export const unlike = (data) => {
  return request(
      data,
      {},
      Constants.URL_UNLIKE.replace('{id}' , data),
      Constants.DELETE_REQUEST_METHOD,
  );
};

export const getLikeList = (id) => {
  return request(
      {},
      {},
      Constants.URL_LIKES.replace('{id}', id),
      Constants.GET_REQUEST_METHOD,
  );
};

export const getUsersLiked = (data) => {
  return request(
      {},
      {},
      Constants.URL_USERS_LIKED.replace('{id}', data.id),
      Constants.GET_REQUEST_METHOD,
  );
};

export const getFollowRequests = (data) => {
  return request(
      data,
      {},
      Constants.URL_FOLLOW_REQUESTS,
      Constants.GET_REQUEST_METHOD,
  );
};

export const follow = (data) => {
  return request(
      data,
      {},
      Constants.URL_FOLLOW,
      Constants.POST_REQUEST_METHOD,
  );
};

export const unfollow = (data) => {
  return request(
      {},
      {},
      Constants.URL_UNFOLLOW.replace('{id}', data.id),
      Constants.DELETE_REQUEST_METHOD,
  );
};

export const deleteFollowRequest = (data) => {
  return request(
      {},
      {},
      Constants.URL_DELETE_FOLLOW_REQUEST.replace('{id}', data.id),
      Constants.DELETE_REQUEST_METHOD,
  );
};

export const getTweet = (id) => {
  return request(
      {},
      {},
      Constants.URL_TWEET+id+'/family/',
      Constants.GET_REQUEST_METHOD,
  );
};

export const getTimeLine = (data) => {
  return request(
      data,
      {},
      Constants.URL_TIMELINE,
      Constants.GET_REQUEST_METHOD,
  );
};
export const editfollowstatus = (data, id) => {
  return request(
      data,
      {},
      Constants.URL_EDIT_FOLLOW_STATUS.replace('{id}', id),
      Constants.PATCH_REQUEST_METHOD,
  );
};


export const getReplyList = (id) => {
  return request(
      {},
      {},
      Constants.URL_REPLYS+id + '/',
      Constants.GET_REQUEST_METHOD,
  );
};

export const getTweetList = (id) => {
  return request(
      {},
      {},
      Constants.URL_USER+id+Constants.URL_TWEET,
      Constants.GET_REQUEST_METHOD,
  );
};

export const createRetweet = (id, data) => {
  return request(
      data,
      {},
      Constants.URL_TWEET+id+Constants.URL_RETWEET,
      Constants.POST_REQUEST_METHOD,
  );
};


// TODO change the url
export const deleteTweet = (id) => {
  return request(
      {},
      {},
      Constants.URL_TWEET+id,
      Constants.DELETE_REQUEST_METHOD,
  );
};
