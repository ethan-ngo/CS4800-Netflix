import React, { useState } from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import ProfileDropdown from './ProfileDropdown'
import '../globals.css'
import Icon from 'react-native-vector-icons/EvilIcons'

const HomeNavbar = () => {
  const [hoveredButton, setHoveredButton] = useState(null)

  return (
    <View style={styles.header}>
      {/* leftmost: title */}
      <View style={styles.leftGroup}>
        <Text style={styles.title}>DomainFilms</Text>
      </View>

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
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="search" size={24} color={'white'} />
        </TouchableOpacity>
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
  searchButton: {
    padding: 10,
    cursor: 'pointer',
    color: 'var(--text-color)',
  },
})

export default HomeNavbar
