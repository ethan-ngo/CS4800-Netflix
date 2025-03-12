import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native'
import { useNavigate, Link } from 'react-router-dom'

const HomePage = () => {
  
  if (Platform.OS === 'web') {
    return(
      <div style={webStyles.navBar}>
        <h1 style={webStyles.Logo}>
          DomainFilms
        </h1>
      </div>
    )
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 48,
    color: 'black',
  },
})
const webStyles={
  navBar:{
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%', 
  backgroundColor: 'black', 
  display: 'flex',
  justifyContent: 'space-between', 
  gap: '20px', 
  //boxshadow:w 0 4px 6px rgba(0, 0, 0, 0.1),
  //z-index: 1000, /* Ensures it stays above other content */
  },
  Logo:{
    justifyContent: 'left',
    color: 'purple',
  },
}
export default HomePage
