import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

const LoadingOverlay = ({ visible }) => {
  if (!visible) return null

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="var(--primary-color)" />
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // slightly darker background when loading
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
})

export default LoadingOverlay
