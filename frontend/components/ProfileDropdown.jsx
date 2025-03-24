import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const ProfileDropdown = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredButton, setHoveredButton] = useState(null)
  const navigation = useNavigation()

  const handleLogout = () => {
    navigation.navigate('Login')
  }

  const handleSelectProfile = () => {
    navigation.navigate('Profile')
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.profileButton}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Text style={styles.profileButtonText}>Profile</Text>
      </TouchableOpacity>
      {isHovered && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              hoveredButton === 'profile' && styles.dropdownButtonHovered,
            ]}
            onPress={handleSelectProfile}
            onMouseEnter={() => {
              setIsHovered(true), setHoveredButton('profile')
            }}
            onMouseLeave={() => {
              setIsHovered(false)
              setHoveredButton(null)
            }}
          >
            <Text style={styles.dropdownButtonText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              hoveredButton === 'logout' && styles.dropdownButtonHovered,
            ]}
            onPress={handleLogout}
            onMouseEnter={() => {
              setIsHovered(true), setHoveredButton('logout')
            }}
            onMouseLeave={() => {
              setIsHovered(false)
              setHoveredButton(null)
            }}
          >
            <Text style={styles.dropdownButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1002,
  },
  profileButton: {
    backgroundColor: 'transparent',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
    zIndex: 1003, // dropdown is on top of everything
  },
  dropdownButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  dropdownButtonHovered: {
    backgroundColor: 'var(--primary-color)',
  },
  dropdownButtonText: {
    color: '#fff',
  },
})

export default ProfileDropdown
