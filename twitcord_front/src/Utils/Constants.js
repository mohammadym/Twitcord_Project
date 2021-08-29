/* eslint-disable max-len */

export const BASE_URL = 'http://127.0.0.1:8000';

// request types
export const POST_REQUEST_METHOD = 'POST';
export const GET_REQUEST_METHOD = 'GET';
export const PATCH_REQUEST_METHOD = 'PATCH';
export const DELETE_REQUEST_METHOD = 'DELETE';

// follow status
export const STATUS_FOLLOW = 'Follow';
export const STATUS_FOLLOWING = 'Following';
export const STATUS_REQUESTED = 'Requested';
export const PUT_REQUEST_METHOD = 'PUT';

// Urls
export const URL_TWEET = '/tweets/';
export const URL_SIGN_UP = '/rest-auth/registration/';
export const URL_LOG_IN = '/rest-auth/login/';
export const URL_SEARCH_USER = '/search/user/';
export const URL_SEARCH_TWEET = '/search/tweet/';
export const URL_PROFILE_INFO = '/profile/{id}/header/';
export const URL_LIKE= '/like/tweet/{id}/';
export const URL_UNLIKE= '/like/tweet/{id}/';
export const URL_LIKES= '/tweets/like/user/{id}/';
export const URL_USERS_LIKED= '/users/like/tweet/{id}/';
export const URL_USER_GENERAL_INFO= '/rest-auth/user/';
export const URL_FOLLOWINGS= '/followings/list/{id}/';
export const URL_FOLLOWERS= '/followers/list/{id}/';
export const URL_FOLLOW_REQUESTS= '/followers/requests/';
export const URL_FOLLOW_COUNT= '/follow/count/{id}/';
export const URL_FOLLOW= '/followings/requests/';
export const URL_UNFOLLOW= '/followings/{id}/';
export const URL_DELETE_FOLLOW_REQUEST= '/followings/requests/{id}/';
export const REJECT_FOLLOW_REQUEST= '/followers/requests/{id}/?action=reject';
export const ACCEPT_FOLLOW_REQUEST= '/followers/requests/{id}/?action=accept';
export const URL_CREATE_ROOM= '/create/rooms/';
export const URL_FOLLOWINGS_LIST= '/followings/list/{id}/';
export const URL_FOLLOWERS_LIST= '/followers/list/{id}/';
export const URL_ROOMS_LIST= '/user/{id}/rooms/';
export const URL_REPLY = '/reply/';
export const URL_MESSAGES = '/rooms/{id}/messages/?page={page}';
export const URL_ROOM_INFO = '/room/{id}/';
export const URL_REPLYS= '/replys/';
export const URL_USER = '/users/';
export const URL_TIMELINE = '/timeline/';
export const URL_RETWEET = '/retweet/';
export const URL_EDIT_FOLLOW_STATUS = '/followings/{id}/';
export const TWEET_BOX_ROW_MIN = 6;
export const TWEET_BOX_ROW_MAX = 16;
export const TWEET_CHAR_LIMIT = 140;
export const LOG_IN_VERIFICATION_ERROR_MESSAGE = 'Verify your email or checkout your password again';
export const LOG_IN_SUCCESS_MESSAGE = 'You are logged in';
export const TWEET_SUCCESS_MESSAGE = 'posted successfuly!';
export const TWEET_FAILURE_MESSAGE = 'post failed!';
export const GET_USER_INFO_FAILURE = 'Could not get your info, try again later.';
export const SIGN_UP_EMAIL_ERROR_MESSAGE = 'A user is already registered with this e-mail or username';
export const SIGN_UP_VERIFICATION_SUCCESS_MESSAGE = 'Verification email is sent';
export const EDIT_PROFILE_UPDATE_PROFILE_SUCCESS_MESSAGE = 'Profile updated successfuly';
export const EDIT_PROFILE_UPDATE_PROFILE_NO_CHANGE_MESSAGE = 'Please change at least one field to update!';
export const EDIT_PROFILE_UPDATE_PROFILE_ERROR_MESSAGE = 'Profile update failed!';
export const EDIT_PROFILE_FETCH_PROFILE_ERROR_MESSAGE = 'Profile info fetch failed!';
export const COVER_CLEARED = 'Cover cleared. Press submit to update profile';
export const PHOTO_CLEARED = 'Photo cleared. Press submit to update profile';

export const SNACKBAR_ERROR_SEVERITY = 'error';
export const SNACKBAR_SUCCESS_SEVERITY = 'success';

export const GENERAL_USER_INFO = 'GENERAL_USER_INFO';
