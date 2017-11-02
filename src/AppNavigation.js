import React, { Component } from 'react';
import { TabNavigator, TabBarTop} from 'react-navigation';
import {
    Platform
} from 'react-native';
import { Notifications } from 'expo';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateFriends, updatePending, updateDebts } from './actions/data';
import { updateCount } from './actions/updateCount';

import { registerForPushNotificationsAsync } from './utils/SetupPushNotifications';
import { process } from './utils/ProcessNotification';

import Balances from './screens/Balances';
import Friends from './screens/Friends';
import Pending from './screens/Pending';

import { createTables, dropAll, executeTransaction } from './utils/Storage';

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

export class AppNavigation extends Component {

  constructor(props) {
    super(props)
  }

  handleNotification = (notification) => {
    // this in prod
    // process(notification);

    //example notification
    const notification_example = {
      action: "NEW_FRIEND_REQUEST",
      value: "test"
    }

    process(notification_example);
  };

  componentDidMount() {
    // push notifications setup - enabled for testing
    // registerForPushNotificationsAsync();
    // this.notificationSubscription = Notifications.addListener(this.handleNotification);

    // dropAll();
    createTables(() => {
      console.log("get data")

      const actions = this.props.actions;
      const friends = {
        table: 'friends',
        action: 'select'
      }

      executeTransaction(friends, (result) => {
        actions.updateFriends(result.rows._array)
      });

      const pending = {
        table: 'pending',
        action: 'select'
      }

      executeTransaction(pending, (result) => {
        const data = result.rows._array;

        actions.updatePending(data)
        actions.updateCount(data.length);
      });

      const debts = {
        table: 'debts',
        action: 'select'
      }

      executeTransaction(debts, (result) => {
        const data = result.rows._array;
        actions.updateDebts(data)
      });
    });
  }

  render() {
    return (
      <Navigator/>
    );
  }
}

export const mapStateToProps = ({ friends }) => ({ state: friends });

export const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ updateDebts, updateFriends, updatePending, updateCount }, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation);
