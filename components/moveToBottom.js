import React from 'react'
import { View, StyleSheet } from 'react-native'

import check from './check'


function moveToBottom(component) {
  return (
    <View style={styles.container}>
      {component}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: check.isAndroid ? 14 : 0
  }
});

export default moveToBottom