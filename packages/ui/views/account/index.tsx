import React, { Component } from 'react'

import Engine from 'lndr/engine'

import { View, Text } from 'react-native'

import Button from 'ui/components/button'
import Tabs, { Tab } from 'ui/components/tabs'
import ActionButton from 'ui/components/action-button'
import Popup from 'ui/components/popup'

import HomeView from './home'
import FriendsView from './friends'
import ActivityView from './activity'

import general from 'theme/general'
import style from 'theme/account'

import { accountViewLanguage } from 'language'

interface Props {
  engine: Engine
}

export default class AccountView extends Component<Props> {
  home: any
  friends: any
  tabs: any

  render() {
    const { engine } = this.props

    return <View style={general.flex}>
      <Tabs tabContainerStyle={style.tabs} ref={tabs => this.tabs = tabs}>
        <Tab reference='home' text={accountViewLanguage.home} onRefresh={() => this.home.refresh()}>
          <HomeView engine={engine} ref={home => this.home = home} />
        </Tab>
        <Tab reference='friends' text={accountViewLanguage.friends} onRefresh={() => this.friends.refresh()}>
          <FriendsView engine={engine} ref={friends => this.friends = friends} />
        </Tab>
        <Tab reference='activity' text={accountViewLanguage.activity}>
          <ActivityView engine={engine} />
        </Tab>
      </Tabs>
      <ActionButton
        onLogout={() => engine.logoutAccount()}
        onMyAccount={() => this.tabs.switchTo('home').then(() => this.home.showMyAccount())}
        onAddFriend={() => this.tabs.switchTo('friends').then(() => this.friends.showAddFriend())}
        onAddDebt={() => this.tabs.switchTo('home').then(() => this.home.showAddDebt())}
      />
    </View>
  }
}
