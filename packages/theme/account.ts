import { StyleSheet, Platform } from 'react-native'

import { radius } from 'theme/include/borders'
import { bold, large, medium, small, xsmall, monospace } from 'theme/include/fonts'
import { xxl, l, m, s, xs, verticalMargin } from 'theme/include/spacing'
import { softGray, gray, white, dark, danger } from 'theme/include/colors'

export default StyleSheet.create({
  tabs: {
    paddingTop: Platform.OS === 'ios' ? l : m,
  },

  whiteBackground: {
    backgroundColor: white
  },

  list: {
    minHeight: 80
  },

  listItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  address: {
    width: 150,
    ...monospace,
    ...xsmall,
    marginTop: s,
    color: gray
  },

  emptyState: {
    ...verticalMargin,
    ...medium,
    color: gray
  },

  text: {
    ...bold
  },

  header: {
    ...medium
  },

  title: {
    paddingLeft: xs,

    flex: 1,
    ...xsmall,
    marginTop: s
  },

  titledFact: {
    padding: xs,
    flex: 1,
    ...medium
  },

  titledFactAmountGood: {
    padding: xs,
    flex: 1,
    ...bold,
    ...medium,
    color: dark
  },

  titledFactAmountDanger: {
    padding: xs,
    flex: 1,
    ...bold,
    ...medium,
    color: danger
  },

  fact: {
    padding: xs,
    flex: 1,
    ...small,
    ...bold,
    ...verticalMargin
  },

  pendingTransaction: {
    ...radius,
    backgroundColor: softGray,
    paddingLeft: m,
    paddingRight: m,
    paddingTop: s,
    paddingBottom: m - xs,
    ...verticalMargin
  },

  transactionIcon: {
    position: 'absolute',
    color: gray,
    top: 5,
    right: 3,
    zIndex: 1,
    ...large
  }
} as any)
