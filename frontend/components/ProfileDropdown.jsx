import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import Icon from 'react-native-vector-icons/MaterialIcons'

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredButton, setHoveredButton] = useState(null)
  const [username, setUsername] = useState('User')
  const navigation = useNavigation()

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token')
      navigation.navigate('Login')
    } catch (error) {
      console.error('Logout failed:', error)
      Alert.alert('Error', 'Failed to logout')
    }
  }

  const handleSelectProfile = () => {
    setIsOpen(false)
    navigation.navigate('Profile')
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        if (!token) {
          console.log('No token found')
          return
        }

        const decodedToken = jwtDecode(token)
        setUsername(decodedToken.name || 'User')
      } catch (error) {
        console.error('Failed to fetch username:', error)
      }
    }

    fetchUsername()
  }, [])

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileButton} onPress={toggleDropdown} activeOpacity={0.8}>
        <Text style={styles.profileButtonText}>Welcome, {username}</Text>
        <Icon name={isOpen ? 'arrow-drop-up' : 'arrow-drop-down'} size={18} color="#fff" />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              hoveredButton === 'profile' && styles.dropdownButtonHovered,
            ]}
            onPress={handleSelectProfile}
            onMouseEnter={() => setHoveredButton('profile')}
            onMouseLeave={() => setHoveredButton(null)}
            activeOpacity={0.8}
          >
            <Icon name="person" size={18} color="#fff" style={styles.icon} />
            <Text style={styles.dropdownButtonText}>Profile</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[
              styles.dropdownButton,
              hoveredButton === 'logout' && styles.dropdownButtonHovered,
            ]}
            onPress={handleLogout}
            onMouseEnter={() => setHoveredButton('logout')}
            onMouseLeave={() => setHoveredButton(null)}
            activeOpacity={0.8}
          >
            <Icon name="logout" size={18} color="#fff" style={styles.icon} />
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
    zIndex: 1000,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#333',
    borderRadius: 4,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 8,
    overflow: 'hidden',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownButtonHovered: {
    backgroundColor: 'var(--primary-color)',
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 12,
  },
  icon: {
    width: 20,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
})

export default ProfileDropdown
