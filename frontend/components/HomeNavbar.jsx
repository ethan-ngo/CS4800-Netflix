import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity, useWindowDimensions } from 'react-native'
import ProfileDropdown from './ProfileDropdown'
import '../globals.css'
import Icon from 'react-native-vector-icons/EvilIcons'
import Searchbar from './Searchbar'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const HomeNavbar = ({ userID, onClick }) => {
  const [hoveredButton, setHoveredButton] = useState(null)
  const navigation = useNavigation()
  const { width } = useWindowDimensions()
  const isMobile = width < 768
  const handleClickHome = () => {
    navigation.navigate('Home', { userID, mode: 'all' })
  }

  const handleClickMovies = () => {
    navigation.navigate('Home', { userID, mode: 'movies' })
  }

  const handleClickShows = () => {
    navigation.navigate('Home', { userID, mode: 'shows' })
  }

  const handleClickBookmark = () => {
    navigation.navigate('Home', { userID, mode: 'bookmarked' })
    if(onClick) {
      onClick();
    }
  }

  return (
    <View style={styles.header}>
      {/* leftmost: title */}
      <TouchableOpacity style={styles.leftGroup} onPress={handleClickHome}>
        <Text style={styles.title}>DomainFilms</Text>
      </TouchableOpacity>

      {/* middle: home, shows, movies */}
      <View style={[styles.middleGroup, isMobile && styles.middleGroupMobile]}>
        <TouchableOpacity
          style={styles.button}
          onMouseEnter={() => setHoveredButton('home')}
          onMouseLeave={() => setHoveredButton(null)}
          onPress={handleClickHome}
        >
          <Text style={[styles.buttonText, hoveredButton === 'home' && styles.hoveredButtonText]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onMouseEnter={() => setHoveredButton('movies')}
          onMouseLeave={() => setHoveredButton(null)}
          onPress={handleClickMovies}
        >
          <Text style={[styles.buttonText, hoveredButton === 'movies' && styles.hoveredButtonText]}>
            Movies
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onMouseEnter={() => setHoveredButton('shows')}
          onMouseLeave={() => setHoveredButton(null)}
          onPress={handleClickShows}
        >
          <Text style={[styles.buttonText, hoveredButton === 'shows' && styles.hoveredButtonText]}>
            Shows
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onMouseEnter={() => setHoveredButton('bookmarked')}
          onMouseLeave={() => setHoveredButton(null)}
          onPress={handleClickBookmark}
        >
          <Text style={[styles.buttonText, hoveredButton === 'bookmarked' && styles.hoveredButtonText]}>
            My Stuff
          </Text>
        </TouchableOpacity>
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
    position: 'relative',
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
  middleGroupMobile:{
    position: 'absolute',
    bottom: -40, // Adjust depending on navbar height
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'var(--background-color)',
    paddingVertical: 10,
    zIndex: 999,
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
