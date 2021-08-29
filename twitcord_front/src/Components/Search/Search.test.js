import React from 'react';
import Search from './Search';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {mount, configure, shallow} from 'enzyme';
import {Provider} from 'react-redux';
import store from '../../redux/store';
import Tabs from '@material-ui/core/Tabs';
import {Tab} from '@material-ui/core';

configure({adapter: new Adapter()});

describe('Search', () => {
  it('should renders without crashing', () => {
    const wrapper = mount( <Provider store={store}><Search /></Provider>);
  });

  it('should change the state after change the tab 0', () => {
    const wrapper = mount( <Provider store={store}><Search /></Provider>);

    wrapper
        .find(Tabs)
        .find(Tab)
        .find('[id="tab-users"]')
        .hostNodes()
        .simulate('click');

    expect(wrapper.find(Tabs).prop('value')).toEqual(0);
  });

  it('should change the state after change the tab 1', () => {
    const wrapper = mount( <Provider store={store}><Search /></Provider>);

    wrapper
        .find(Tabs)
        .find(Tab)
        .find('[id="tab-tweets"]')
        .hostNodes()
        .simulate('click');

    expect(wrapper.find(Tabs).prop('value')).toEqual(1);
  });
});
