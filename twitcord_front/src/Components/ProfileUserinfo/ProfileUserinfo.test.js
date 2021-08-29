/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React from 'react';
import ProfileUserinfo from './ProfileUserinfo';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {mount, configure, shallow} from 'enzyme';
import {Provider} from 'react-redux';
import store from '../../redux/store';
import tweetReducer from '../../redux/Reducers/TweetReducer';
import * as Actions from '../../redux/Actions/index';

configure({adapter: new Adapter()});

describe('ProfileUserinfo', () => {
  it('should renders without crashing', () => {
    const wrapper = shallow( <Provider store={store}>
      <ProfileUserinfo />
    </Provider>);
  });


  it('should set profileInfo in store', () => {
    const date = new Date();
      expect(tweetReducer(
        { 
          profileInfo: {
            username: '',
            bio: '',
            date_joined: '',
            birth_date: '',
            first_name: '',
            id: '',
            status: '',
            last_name: '',
            website: '',
            is_public: false,
            email: '',
            following_status: '',
            has_header_img: false,
            has_profile_img: false,
            is_active: false,
            header_img: '',
            type:'SET_PROFILE_INFO',
            profile_img_upload_details: '',
            header_img_upload_details: '',
            followers_count: 0,
            followings_count: 0,
          }
        },
        Actions.setProfileInfo({ 
          username: 'aliii',
          bio: 'bio',
          id: 1212,
          date_joined: date,
          birth_date: date,
          status: 'FOLLOWED',
          type:'SET_PROFILE_INFO',
          first_name: 'ali',
          last_name: 'behrooz',
          website: 'www.google.com',
          is_public: false,
          is_active: true,
          email: 'ali.behroozi@gmail.com',
          has_header_img: false,
          has_profile_img: false,
          following_status: 'FOLLOWED',
          header_img: 'fake_path',
          profile_img: 'fake_path',
          profile_img_upload_details: 'details',
          header_img_upload_details: 'details',
          followers_count: 0,
          followings_count: 0,
        })
      )).toEqual({ profileInfo: {
          username: 'aliii',
          bio: 'bio',
          date_joined: date,
          birth_date: date,
          status: 'FOLLOWED',
          type:'SET_PROFILE_INFO',
          first_name: 'ali',
          id: 1212,
          last_name: 'behrooz',
          website: 'www.google.com',
          is_public: false,
          is_active: true,
          email: 'ali.behroozi@gmail.com',
          has_header_img: false,
          has_profile_img: false,
          header_img: 'fake_path',
          following_status: 'FOLLOWED',
          profile_img: 'fake_path',
          profile_img_upload_details: 'details',
          header_img_upload_details: 'details',
          followers_count: 0,
          followings_count: 0,
    }});
  });
});

