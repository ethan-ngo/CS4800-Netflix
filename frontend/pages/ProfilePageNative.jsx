import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import { validateEmail } from '../utils/validateEmail'

const ProfilePageNative = () => {
  const [profilePic, setProfilePic] = useState(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userId, setUserId] = useState('1')
  const [originalProfilePic, setOriginalProfilePic] = useState(null)
  const [originalUsername, setOriginalUsername] = useState('')
  const [originalEmail, setOriginalEmail] = useState('')
  const [loading, setLoading] = useState(true)
  // use email to fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = await AsyncStorage.getItem('email')
        if (!email) {
          console.error('Error: Email is missing')
          Alert.alert('Error', 'You are not authenticated')
          setLoading(false)
          return
        }
        console.log('Fetched email:', email)

        //const userResponse = await fetch(`http://localhost:5050/users/getUserByEmail/${encodeURIComponent(email)}`,{
        const userResponse = await fetch(`${process.env.APP_URL}users/getUserByEmail/${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!userResponse.ok) {
          const errorData = await userResponse.json()
          console.error('Error fetching user details:', errorData.message)
          Alert.alert('Error', errorData.message || 'Failed to fetch user details')
          setLoading(false)
          return
        }

        const user = await userResponse.json()
        console.log('Fetched user details:', user)

        setUserId(user.userId)
        setProfilePic(user.profilePic)
        setUsername(user.name)
        setEmail(user.email)

        setOriginalProfilePic(user.profilePic)
        setOriginalUsername(user.name)
        setOriginalEmail(user.email)
      } catch (error) {
        console.error('Error fetching user data:', error)
        Alert.alert('Error', 'An error occurred while fetching user data')
      } finally {
        setLoading(false) // Ensure loading is set to false in all cases
      }
    }

    fetchUserData()
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri)
    }
  }

  const handleUpdateProfile = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address')
      return
    }

    const updatedUserData = {}
    if (username) updatedUserData.name = username
    if (email) updatedUserData.email = email
    if (password) updatedUserData.password = password
    if (profilePic) updatedUserData.profilePic = profilePic

    //use userId to update the user data
    try {
      const response = await fetch(`${process.env.APP_URL}users/${userId}`, {
        //const response = await fetch(`http://localhost:5050/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      })

      if (response.ok) {
        const responseData = await response.json()
        Alert.alert('Success', 'Profile updated successfully')
        console.log('Updated user data:', responseData)
      } else {
        const errorData = await response.json()
        Alert.alert('Error', errorData.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      Alert.alert('Error', 'An error occurred while updating the profile')
    }
  }

  const handleReset = () => {
    setProfilePic(originalProfilePic)
    setUsername(originalUsername)
    setEmail(originalEmail)
    setPassword('')
  }
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    )
  }

  //uses user data from the database to populate the form
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profileImage} />
          ) : (
            <Text style={styles.imageText}>Upload profile picture</Text>
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder={originalUsername}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder={originalEmail}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder={'Enter your password'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateProfile}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.8}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageText: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  updateButton: {
    backgroundColor: 'var(--primary-color)',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 1,
  },
  resetButtonText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
})

export default ProfilePageNative
