import React, { Component } from 'react'

import { View, Text } from 'react-native'

import Engine from 'lndr/engine'

import Button from 'ui/components/button'

import { cancel, confirmAccount, mnemonicExhortation } from 'language'

import style from 'theme/form'

interface Props {
  engine: Engine,
  mnemonic?: string
}

export default class RecoverAccountView extends Component<Props> {
  render() {
    const { engine, mnemonic } = this.props

    return (
      <View style={style.form}>
        <Text style={style.header}>{mnemonicExhortation}</Text>
        <Text selectable style={style.displayText}>{mnemonic}</Text>
        <Button onPress={() => engine.confirmAccount()} text={confirmAccount} />
        <Button alternate onPress={() => engine.cancelConfirmAccount()} text={cancel} />
      </View>
    )
  }
}
