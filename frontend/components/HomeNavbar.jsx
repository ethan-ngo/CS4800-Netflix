import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import ProfileDropdown from './ProfileDropdown'
import '../globals.css'

const HomeNavbar = () => {
  return (
    <View style={styles.header}>
      {/* leftmost: title */}
      <Text style={styles.title}>DomainFilms</Text>

      {/* middle: home, shows, movies */}
      <View style={styles.middleGroup}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Home</Text>
        </View>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Shows</Text>
        </View>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Movies</Text>
        </View>
      </View>

      {/* rightmost: search, profile icon image */}
      <View style={styles.rightGroup}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </View>
        <View style={styles.button}>
          <ProfileDropdown />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    padding: 10,
    backgroundColor: 'var(--background-color)',
    borderColor: 'var(--text-color)',
    borderStyle: 'solid',
    borderBottomWidth: 0.1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    zIndex: 1000,
  },
  title: {
    fontSize: 20,
    padding: 5,
    fontWeight: 'bold',
    color: '#fff',
  },
  middleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    position: 'relative',
    zIndex: 1001,
  },
  buttonText: {
    color: 'var(--text-color)',
    fontSize: 16,
  },
})

export default HomeNavbar
