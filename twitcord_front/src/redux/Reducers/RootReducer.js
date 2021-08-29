import {combineReducers} from 'redux';
import tweetReducer from './TweetReducer';

const rootReducer = combineReducers({
  tweet: tweetReducer,
});

export default rootReducer;
