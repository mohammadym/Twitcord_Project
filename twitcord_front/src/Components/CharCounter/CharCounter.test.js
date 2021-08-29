/* eslint-disable no-unused-vars */
import React from 'react';
import CharCounter from './CharCounter';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {mount, configure} from 'enzyme';
import {Provider} from 'react-redux';
import store from '../../redux/store';

configure({adapter: new Adapter()});

describe('CharCounter', () => {
  it('should renders without crashing', () => {
    const wrapper = mount( <Provider store={store}>
      <CharCounter />
    </Provider>);
  });
});

