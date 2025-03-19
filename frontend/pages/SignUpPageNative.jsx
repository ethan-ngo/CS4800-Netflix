import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import { validateEmail } from '../utils/validateEmail'

const SignUpPageNative = ({ navigation }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    try {
      // Check if email is already in use
      const res = await fetch(`${process.env.APP_URL}users?email=${email}`)
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)

      const users = await res.json()
      const usersWithMatchingEmail = users.filter((user) => user.email === email)

      if (usersWithMatchingEmail.length > 0) {
        Alert.alert('Error', 'Email is already in use')
        return
      }
    } catch (error) {
      console.error('Error checking email:', error)
      Alert.alert('Error', 'Failed to check email')
      return
    }

    try {
      // Create a new user
      const res = await fetch(`${process.env.APP_URL}users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, profilePic: null }),
      })

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)

      const data = await res.json()
      console.log('New user created:', data)

      Alert.alert('Success', 'Account created successfully')
      navigation.navigate('Login') // Navigate to the login page
    } catch (error) {
      console.error('Error creating user:', error)
      Alert.alert('Error', 'Failed to create account')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onBlur={() => {
            if (email && !validateEmail(email)) {
              Alert.alert('Invalid Email', 'Please enter a valid email address')
            }
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleSignUp} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.8}>
          <Text style={styles.forgotPassword}>Already have an account? Log in</Text>
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
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  forgotPassword: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: 'var(--primary-color)',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
})

export default SignUpPageNative
