import React, { Component } from 'react'

import Engine from 'lndr/engine'

import { Text, View } from 'react-native'

import Button from 'ui/components/button'
import Popup, { closePopup } from 'ui/components/popup'
import Section from 'ui/components/section'

import AddDebt from 'ui/dialogs/add-debt'
import MyAccount from 'ui/dialogs/my-account'

import general from 'theme/general'
import formStyle from 'theme/form'

import { tip, welcomeBack, noNicknameWarning, accountManagement } from 'language'

interface Props {
  engine: Engine
}

interface State {
  shouldShowAddDebt: boolean
  shouldShowMyAccount: boolean
  loadedAccountInformation: boolean
  accountInformation?: { nickname?: string }
}

export default class HomeView extends Component<Props, State> {
  constructor() {
    super()
    this.state = {
      shouldShowAddDebt: false,
      shouldShowMyAccount: false,
      loadedAccountInformation: false
    }
  }

  async componentDidMount() {
    const { engine } = this.props

    try {
      const accountInformation = await engine.getAccountInformation()

      this.setState({
        loadedAccountInformation: true,
        accountInformation
      })
    }

    catch (error) {
      engine.setErrorMessage(accountManagement.loadInformation.error)
    }
  }

  refresh() {
    this.componentDidMount()
  }

  renderAccountInformation() {
    const { loadedAccountInformation, accountInformation = {} } = this.state

    if (!loadedAccountInformation) {
      return
    }

    const { nickname } = accountInformation

    if (!nickname) {
      return <Text style={formStyle.warningText}>
        <Text style={formStyle.bold}>{tip}</Text>
        {noNicknameWarning}
      </Text>
    }

    return <Text style={formStyle.text}>{welcomeBack(nickname)}</Text>
  }

  renderAddDebtDialog() {
    const { shouldShowAddDebt } = this.state

    if (!shouldShowAddDebt) {
      return null
    }

    const { engine } = this.props

    return <Popup onClose={() => this.setState({ shouldShowAddDebt: false })}>
      <AddDebt closePopup={closePopup} engine={engine} />
    </Popup>
  }

  renderMyAccountDialog() {
    const { shouldShowMyAccount } = this.state

    if (!shouldShowMyAccount) {
      return null
    }

    const { engine } = this.props

    return <Popup onClose={() => [ this.refresh(), this.setState({ shouldShowMyAccount: false }) ]}>
      <MyAccount closePopup={closePopup} engine={engine} />
    </Popup>
  }

  showMyAccount() {
    this.setState({ shouldShowMyAccount: true })
  }

  showAddDebt() {
    this.setState({ shouldShowAddDebt: true })
  }

  render() {
    const { accountInformation } = this.state

    return <View>
      <Section>
        { this.renderAddDebtDialog() }
        { this.renderMyAccountDialog() }

        <View style={general.horizontalFlex}>
          <Button
            icon='ios-cash'
            containerStyle={general.stretch}
            text='Add Debt'
            onPress={() => this.showAddDebt()}
          />
          <Button
            icon='ios-settings'
            onPress={() => this.showMyAccount()}
          />
        </View>

        { this.renderAccountInformation() }
      </Section>

      <Section text='My Balances'>
        <Text style={formStyle.text}>List of balances to go here #todo</Text>
      </Section>
    </View>
  }
}
