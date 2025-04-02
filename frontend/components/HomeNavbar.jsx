import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import ProfileDropdown from './ProfileDropdown'
import '../globals.css'
import Icon from 'react-native-vector-icons/EvilIcons'
import Searchbar from './Searchbar'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const HomeNavbar = ({ userID }) => {
  const [hoveredButton, setHoveredButton] = useState(null)
  const navigation = useNavigation()

  const handleClickHome = () => {
    console.log('Home button clicked')
    navigation.navigate('Home', { userID: userID })
  }

  return (
    <View style={styles.header}>
      {/* leftmost: title */}
      <TouchableOpacity style={styles.leftGroup} onPress={handleClickHome}>
        <Text style={styles.title}>DomainFilms</Text>
      </TouchableOpacity>

      {/* middle: home, shows, movies */}
      <View style={styles.middleGroup}>
        <View
          style={styles.button}
          onMouseEnter={() => setHoveredButton('home')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <Text style={[styles.buttonText, hoveredButton === 'home' && styles.hoveredButtonText]}>
            Home
          </Text>
        </View>
        <View
          style={styles.button}
          onMouseEnter={() => setHoveredButton('movies')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <Text style={[styles.buttonText, hoveredButton === 'movies' && styles.hoveredButtonText]}>
            Movies
          </Text>
        </View>
        <View
          style={styles.button}
          onMouseEnter={() => setHoveredButton('shows')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <Text style={[styles.buttonText, hoveredButton === 'shows' && styles.hoveredButtonText]}>
            Shows
          </Text>
        </View>
      </View>

      {/* rightmost: search, profile icon image */}
      <View style={styles.rightGroup}>
        <Searchbar userID={userID} />
        <ProfileDropdown userID={userID} />
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
    fontSize: 24,
    padding: 5,
    fontWeight: 'bold',
    color: 'var(--text-color)',
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 10,
  },
  middleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 10,
  },
  button: {
    position: 'relative',
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 10,
    zIndex: 1001,
    cursor: 'pointer',
  },
  buttonText: {
    color: 'var(--text-color)',
    fontSize: 18,
  },
  hoveredButtonText: {
    transform: [{ scale: 1.2 }],
  },
})

export default HomeNavbar
