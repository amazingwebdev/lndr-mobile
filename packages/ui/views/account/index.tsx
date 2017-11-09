import React, { Component } from 'react'

import Engine from 'lndr/engine'

import { Text } from 'react-native'

import Button from 'ui/components/button'
import Tabs, { Tab } from 'ui/components/tabs'
import Popup from 'ui/components/popup'

import AddDebt from 'ui/dialogs/add-debt'

interface Props {
  engine: Engine
}

export default class AccountView extends Component<Props> {
  constructor() {
    super()
    this.state = {
      shouldShowAddDebt: false
    }
  }

  renderAddDebtDialog() {
    const { shouldShowAddDebt } = this.state

    if (!shouldShowAddDebt) {
      return null
    }

    const { engine } = this.props

    return <Popup onClose={() => this.setState({ shouldShowAddDebt: false })}>
      <AddDebt engine={engine} />
    </Popup>
  }

  render() {
    return <Tabs>
      <Tab reference='balances' title='Balances'>
        <Text>AccountView</Text>
        <Button text='Add Debt' onPress={() => this.setState({ shouldShowAddDebt: true })} />
        { this.renderAddDebtDialog() }
      </Tab>
      <Tab reference='friends' title='Friends'>
        <Text>Friends</Text>
      </Tab>
      <Tab reference='pending' title='Pending'>
        <Text>Pending</Text>
      </Tab>
    </Tabs>
  }
}
