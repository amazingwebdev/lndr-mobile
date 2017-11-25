import React from 'react'

import { View, Platform } from 'react-native'
import { BlurView } from 'react-native-blur'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/Ionicons'

import { bluish, gray } from 'theme/include/colors'

import { myAccount, aboutLndr, getHelp,logoutAction } from 'language'

import style from 'theme/action-button'
import popupStyle from 'theme/popup'

interface Props {
  onLogout: () => void
  onMyAccount: () => void
  onMyLndr: () => void
  onGetHelp: () => void
}

export default ({ onLogout, onMyAccount, onGetHelp, onMyLndr }: Props) => (
  <ActionButton
    buttonColor={gray}
    bgColor={'rgba(70,70,70,0.5)'} // TODO hack for android until blurview issue is fixed
    size={40}
    verticalOrientation='down'
    spacing={10}
    hideShadow={true}
    backdrop={Platform.OS === 'ios' ? <BlurView blurType='dark' style={popupStyle.wrap}></BlurView> : false}
    offsetX={Platform.OS === 'ios' ? 15 : 15}
    offsetY={Platform.OS === 'ios' ? 30 : 10}
    >
    <ActionButton.Item buttonColor={bluish} title={logoutAction} onPress={onLogout} textContainerStyle={style.textContainer} textStyle={style.text}>
      <Icon name={'md-lock'} style={style.icon} />
    </ActionButton.Item>
    <ActionButton.Item buttonColor={bluish} title={myAccount} onPress={onMyAccount} textContainerStyle={style.textContainer} textStyle={style.text}>
      <Icon name={'md-stats'} style={style.icon} />
    </ActionButton.Item>
    <ActionButton.Item buttonColor={bluish} title={aboutLndr} onPress={onMyLndr} textContainerStyle={style.textContainer} textStyle={style.text}>
      <Icon name={'md-contacts'} style={style.icon} />
    </ActionButton.Item>
    <ActionButton.Item buttonColor={bluish} title={getHelp} onPress={onGetHelp} textContainerStyle={style.textContainer} textStyle={style.text}>
      <Icon name={'md-help'} style={style.icon} />
    </ActionButton.Item>
  </ActionButton>
)
