import React from 'react';
import TweetBox from './TweetBox';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {mount, configure} from 'enzyme';
import {Provider} from 'react-redux';
import store from '../../redux/store';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import tweetReducer from '../../redux/Reducers/TweetReducer';
import * as Actions from '../../redux/Actions/index';


configure({adapter: new Adapter()});

const LONG_TEXT = 'The next time you run the tests'+
'the rendered output will be compared to the previously created snapshot. '+
'The snapshot should be committed along with code changes. When a snapshot '+
'test fails, you need to inspect whether it is an intended+'+
' or unintended change.'+
' If the change is expected you can invoke Jest with jest -u'+
' to overwrite the existing snapshot.';

describe('TweetBox', () => {
  it('should renders without crashing', () => {
    const wrapper = mount( <Provider store={store}><TweetBox /></Provider>);
  });

  it('should change the state after change the input value', () => {
    const wrapper = mount( <Provider store={store}><TweetBox /></Provider>);
    // when
    wrapper
        .find(TextareaAutosize)
        .simulate('change', {target: {value: 'newValue'}});

    expect(wrapper.find(TextareaAutosize).prop('value')).toEqual('newValue');
  });

  it('should disable post button when having more than 146 chars in tweet'
      , () => {
        const wrapper = mount( <Provider store={store}><TweetBox /></Provider>);
        // when
        wrapper
            .find(TextareaAutosize)
            .simulate('change', {target: {value: LONG_TEXT}});

        expect(wrapper.find(Button).prop('disabled')).toEqual(true);
      });

  it('should enabled post button when having less than 146 chars in tweet'
      , () => {
        const wrapper = mount( <Provider store={store}><TweetBox /></Provider>);
        // when
        wrapper
            .find(TextareaAutosize)
            .simulate('change', {target: {value: 'short text'}});

        expect(wrapper.find(Button).prop('disabled')).toEqual(false);
      });

  it('should set "tweetText" & "tweetCharCount" state in reducer', () => {
    expect(tweetReducer(
        {tweetText: '', tweetCharCount: 0},
        Actions.setTweetText({tweetText: 'text'}),
    )).toEqual({tweetText: 'text', tweetCharCount: 4});
  });
});
