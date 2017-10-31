import React, { Component } from 'react';
import { TabNavigator, TabBarTop} from 'react-navigation';
import {
    Platform
} from 'react-native';

import Balances from './src/screens/Balances';
import Friends from './src/screens/Friends';
import Pending from './src/screens/Pending';

import { createTables, dropAll } from './src/utils/Storage';

const Navigator = TabNavigator({
  Balances: { screen: Balances },
  Friends: { screen: Friends },
  Pending: { screen: Pending }
}, {
  	tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
    tabBarOptions: {
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#FFFFFF',
        labelStyle: {
            fontSize: 14,
            fontWeight: '500'
        },
        style: {
            paddingTop: 25,
            height: 80,
            backgroundColor: '#f76e0c'
        }
    }
});

export default class App extends Component {

  componentDidMount() {
    // dropAll();
    createTables();
  }

  fetch() {
    console.log("this that");
  }

  render() {
    return (
      <Navigator
        fetch={this.fetch}/>
    );
  }

}
