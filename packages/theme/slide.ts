import { StyleSheet } from 'react-native'

import { dark, light, white, gray } from 'theme/include/colors'

export default StyleSheet.create({
  topView: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    backgroundColor: white,
    padding: 10
  },
  text: {
    textAlign: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 20,
    fontSize: 24,
    fontWeight: '200'
  },
  italic: {
    textAlign: 'center',
    marginTop: 35,
    fontSize: 24,
    fontWeight: '200'
  },
  italicOnly: {
    fontStyle: 'italic'
  },
  horizontial: {
    flexDirection: 'row'
  },
  topSpacing: {
    marginTop: '10%'
  }
} as any)
