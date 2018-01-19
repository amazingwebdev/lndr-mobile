import { StyleSheet } from 'react-native'

import { light, white, black } from 'theme/include/colors'
import { percent } from 'theme/include/dimensions'

export default StyleSheet.create({
  topView: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    backgroundColor: white,
    padding: 10
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: black,
    marginTop: 36,
    marginRight: 3,
    marginLeft: 3
  },
  text: {
    textAlign: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 20,
    fontSize: 26,
    fontWeight: '100',
    color: black
  },
  caption: {
    textAlign: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 20,
    fontSize: 22,
    fontWeight: '100',
    color: black
  },
  boldCaption: {
    fontWeight: '500'
  },
  italic: {
    fontStyle: 'italic'
  },
  bold: {
    fontWeight: 'bold'
  },
  completeButton: {
    marginTop: percent.ten
  },
  horizontial: {
    flexDirection: 'row'
  },
  topSpacing: {
    marginTop: '10%'
  },
  bottomSpacing: {
    paddingBottom: '7%'
  }
} as any)
