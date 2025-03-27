import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, Pressable, Image} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import Icon from 'react-native-vector-icons/MaterialIcons'
import theme from '../utils/theme'

const ProfileDropdown = ({userID}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredButton, setHoveredButton] = useState(null)
  const [username, setUsername] = useState('+')
  const [PFP, setPFP] = useState(null)
  const navigation = useNavigation()
  const dropdownRef = useRef(null)

  const app_url = process.env.APP_URL;

  const fetchImage = async (userID) => {
    try {
      const results = await fetch(app_url + "users/" + userID);
      if(results.ok) {
        const data = await results.json();
        setPFP(data.profilePic)
        setUsername(data.name[0].toUpperCase())
      }
    } catch(error) {
      console.log(error);
    }
  }

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
    fetchImage(userID);
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen])

  return (
    <View style={styles.container} ref={dropdownRef}>
      <View style={styles.profileButton}>
        <TouchableOpacity style={styles.imagePicker} onPress={toggleDropdown} activeOpacity={0.8}>
          {PFP ? (
            <Image source={{ uri: PFP}} style={styles.profileImage} />
          ) : (
            <Text style={styles.imageText}>{username}</Text>
          )}
        </TouchableOpacity>
        <Icon name={isOpen ? 'arrow-drop-up' : 'arrow-drop-down'} size={18} color="#fff" />
      </View>
      

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
    cursor: 'pointer',
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
  imagePicker: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: theme.textColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: theme.textColor,
  },
  imageText: {
    fontSize: 20,
    color: theme.textColor,
    textAlign: 'center',
  },
})

export default ProfileDropdown
