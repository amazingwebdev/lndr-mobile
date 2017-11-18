import React, { Component } from 'react'

import { Text, TextInput, TouchableHighlight, View } from 'react-native'

import { debounce } from 'lndr/time'
import Engine from 'lndr/engine'
import PendingTransaction from 'lndr/pending-transaction'

import Button from 'ui/components/button'
import Loading, { LoadingContext } from 'ui/components/loading'
import PendingTransactionRow from 'ui/components/pending-transaction-row'

import style from 'theme/account'
import formStyle from 'theme/form'

import {
  acknowledge,
  cancel,
  pendingTransactionsLanguage
} from 'language'

const loadingContext = new LoadingContext()

interface Props {
  pendingTransaction: PendingTransaction
  engine: Engine
  closePopup: () => void
}

export default class PendingTransactionDetail extends Component<Props> {
  async confirmPendingTransaction(pendingTransaction: PendingTransaction) {
    const { engine, closePopup } = this.props

    await loadingContext.wrap(
      engine.confirmPendingTransaction(pendingTransaction)
    )

    closePopup()
  }

  async rejectPendingTransaction(pendingTransaction: PendingTransaction) {
    const { engine, closePopup } = this.props

    await loadingContext.wrap(
      engine.rejectPendingTransaction(pendingTransaction)
    )

    closePopup()
  }

  render() {
    const { engine, pendingTransaction, closePopup } = this.props
    const { user } = engine

    if (engine.submitterIsMe(pendingTransaction)) {
      return <View>
        <Text style={formStyle.header}>{pendingTransactionsLanguage.title}</Text>
        <Text style={formStyle.text}>
          {pendingTransactionsLanguage.pendingAnnouncement}
        </Text>
        <Button style={formStyle.lastButton} onPress={closePopup} text={acknowledge} />
      </View>
    }

    return <View>
      <Text style={formStyle.header}>{pendingTransactionsLanguage.title}</Text>
      <Text style={formStyle.text}>{pendingTransactionsLanguage.confirmationQuestion}</Text>
        <Loading context={loadingContext} />
        <PendingTransactionRow
          user={user}
          key={pendingTransaction.hash}
          pendingTransaction={pendingTransaction}
        />
        <View style={style.listItem}>
          <Button containerStyle={formStyle.leftButton} danger onPress={() => this.rejectPendingTransaction(pendingTransaction)} text={pendingTransactionsLanguage.reject} />
          <Button containerStyle={formStyle.rightButton} onPress={() => this.confirmPendingTransaction(pendingTransaction)} text={pendingTransactionsLanguage.confirm} />
        </View>
        <Button alternate onPress={closePopup} text={cancel} />
    </View>
  }
}
