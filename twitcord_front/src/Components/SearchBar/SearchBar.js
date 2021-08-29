import React, {useEffect} from 'react';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import './SearchBar.css';
import * as API from '../../Utils/API/index';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import * as Actions from '../../redux/Actions/index.js';
/* eslint-disable */


const SearchBar = () => {
  const userInput = useSelector((state) => state).tweet.searchInput;
  const dispatch = useDispatch();

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      searchUser(userInput);
      searchTweet(userInput);
    }
  };

  const handleInputChange = (e) => {
    dispatch(Actions.setSearchInput({
      input: e.target.value,
    }));  
  };
  
  useEffect(() => {
    dispatch(Actions.setUserSearchResults({
      users: [],
    }));
    dispatch(Actions.setTweetSearchResults({
      tweets: []
    }));
  }, []);

  const searchUser = (query, page=1) => {
    API.searchUsers({}, {query: query, page: page})
        .then((response) => {
          const data = response.data;
          dispatch(Actions.setUserSearchResults({
            users: data.results,
          }));
        })
        .catch((error) => {
        });
  };

  const searchTweet = (query, page=1) => {
    API.searchTweets({}, {query: query, page: page})
        .then((response) => {
          const data = response.data;
          dispatch(Actions.setTweetSearchResults({
            tweets: data.results,
          }));
        })
        .catch((error) => {
        });
  };

  return (
    <div
      component="form"
      className="root">
      <InputBase
        id="input"
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        value={userInput}
        className="input-base"
        placeholder="Search"/>
      <IconButton
        id="search"
        className="search-icon"
        type="submit"
        onClick={(event) => {
          searchUser(userInput);
          searchTweet(userInput);
        }}
        aria-label="search">
        <SearchIcon />
      </IconButton>
    </div> );
};

export default SearchBar;