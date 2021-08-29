import React from 'react';
import SearchBar from './SearchBar';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {mount, configure, shallow} from 'enzyme';
import {Provider} from 'react-redux';
import store from '../../redux/store';
import tweetReducer from '../../redux/Reducers/TweetReducer'
import * as Actions from '../../redux/Actions/index';
import IconButton from '@material-ui/core/IconButton';

configure({adapter: new Adapter()});

describe('SearchBar', () => {
  it('should renders without crashing', () => {
    const wrapper = mount( <Provider store={store}><SearchBar /></Provider>);
  });

  it('should change the state after change the input value', () => {
    const wrapper = mount( <Provider store={store}><SearchBar /></Provider>);
    // when
    wrapper
        .find('input')
        .simulate('change', {target: {value: 'newValue'}});

    expect(wrapper.find('input').prop('value')).toEqual('newValue');
  });

  it('should set input search in store', () => {
    expect(tweetReducer(
        { 
        },
        Actions.setSearchInput({ 
            input: 'search term'
        })
      )).toEqual({ 
        searchInput: 'search term'
     });
  });

  it('should change state of reducer', () => {
    const wrapper = mount( <Provider store={store}><SearchBar /></Provider>);
    // when
    wrapper
    .find('input')
    .simulate('change', {target: {value: 'newValue'}});

    wrapper
        .find(IconButton)
        .simulate('click');

    expect(wrapper.find('input').prop('value')).toEqual('newValue');
  });

  it('change state of tweetSearchResult of reducer',  () => {
    const data = { 
        "count": 2,
        "next": null,
        "previous": null,
        "results": [
          {
            "id": 2,
            "is_reply": true,
            "content": "wtf",
            "create_date": "2021-05-04T19:13:57+04:30",
            "parent": 8,
            "profile_img": "/profiles/defaults/user-profile-image.jpg",
            "username": "ali5",
            "first_name": "mmds",
            "last_name": "moghadam"
          },
          {
            "id": 2,
            "is_reply": false,
            "content": ",jfkufyugilgui",
            "create_date": "2021-05-04T19:10:24+04:30",
            "parent": null,
            "profile_img": "/profiles/defaults/user-profile-image.jpg",
            "username": "ali5",
            "first_name": "mmds",
            "last_name": "moghadam"
          }
        ]        
    };

    expect(tweetReducer(
      {tweetSearchResult: []},
      Actions.setTweetSearchResults({tweets: data.results}),
    )).toEqual({tweetSearchResult: data.results});
  });

  it('change state of tweetSearchResult of reducer',  () => {
    const data = { 
        "count": 2,
        "next": null,
        "previous": null,
        "results": [
          {
            "id": 2,
            "is_reply": true,
            "content": "wtf",
            "create_date": "2021-05-04T19:13:57+04:30",
            "parent": 8,
            "profile_img": "/profiles/defaults/user-profile-image.jpg",
            "username": "ali5",
            "first_name": "mmds",
            "last_name": "moghadam"
          },
          {
            "id": 2,
            "is_reply": false,
            "content": ",jfkufyugilgui",
            "create_date": "2021-05-04T19:10:24+04:30",
            "parent": null,
            "profile_img": "/profiles/defaults/user-profile-image.jpg",
            "username": "ali5",
            "first_name": "mmds",
            "last_name": "moghadam"
          }
        ]        
    };

    expect(tweetReducer(
      {tweetSearchResult: []},
      Actions.setTweetSearchResults({tweets: data.results}),
    )).toEqual({tweetSearchResult: data.results});
  });

  it('change state of userSearchResult of reducer',  () => {
    const data = { 
        "count": 2,
        "next": null,
        "previous": null,
        "results": [
          {
            "id": 2,
            "is_reply": true,
            "content": "wtf",
            "create_date": "2021-05-04T19:13:57+04:30",
            "parent": 8,
            "profile_img": "/profiles/defaults/user-profile-image.jpg",
            "username": "ali5",
            "first_name": "mmds",
            "last_name": "moghadam"
          },
          {
            "id": 2,
            "is_reply": false,
            "content": ",jfkufyugilgui",
            "create_date": "2021-05-04T19:10:24+04:30",
            "parent": null,
            "profile_img": "/profiles/defaults/user-profile-image.jpg",
            "username": "ali5",
            "first_name": "mmds",
            "last_name": "moghadam"
          }
        ]        
    };

    expect(tweetReducer(
      {userSearchResult: []},
      Actions.setUserSearchResults({users: data.results}),
    )).toEqual({userSearchResult: data.results});
  });

});
