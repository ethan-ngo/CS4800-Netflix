import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native'

const SignUpPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [response, setResponse] = useState(null)

  // validations and confirmation for sign-up
  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      if (Platform.OS === 'web') {
        alert('Error', 'Please fill in all fields')
      } else {
        Alert.alert('Error', 'Please fill in all fields')
      }

      return
    }

    if (password !== confirmPassword) {
      if (Platform.OS === 'web') {
        alert('Error', 'Passwords do not match')
      } else {
        Alert.alert('Error', 'Passwords do not match')
      }
      return
    }

    // check if email is already in use
    try {
      // const res = await fetch(`https://cs4800netflix.vercel.app/users?email=${email}`)
      const res = await fetch(`http://localhost:5050/users?email=${email}`)
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)

      const users = await res.json()
      const usersWithMatchingEmail = users.filter((user) => user.email === email)
      console.log('Number of users with that email: ', usersWithMatchingEmail.length)

      if (usersWithMatchingEmail.length > 0) {
        if (Platform.OS === 'web') {
          alert('Error: Email is already in use')
        } else {
          Alert.alert('Error: Email is already in use')
        }
        return
      }
    } catch (error) {
      console.error('Error:', error)
      setResponse({ error: 'Failed to submit data' })
    }

    // if the email is not in use, create a new user
    try {
      const res = await fetch(`http://localhost:5050/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, profilePic: null }),
      })

      if (!res.ok) {
        const errorResponse = await res.text()
        console.error('Server error response:', errorResponse)
        throw new Error(`HTTP error! Status: ${res.status}`)
      }

      const data = await res.json()
      setResponse(data)
      console.log('New user with username: ' + name + ' and email: ' + email + ' has been created')
    } catch (error) {
      console.error('Error:', error)
      setResponse({ error: 'Failed to submit data' })
    }

    if (Platform.OS === 'web') {
      //alert('Profile Created', `Email: ${email}\nPassword: ${password}`)
      console.log('Profile Created', `Email: ${email}\nPassword: ${password}`)
    } else {
      //Alert.alert('Profile Created', `Email: ${email}\nPassword: ${password}`)
      console.log('Profile Created', `Email: ${email}\nPassword: ${password}`)
    }
  }

  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.container}>
        <div style={webStyles.formContainer}>
          <h1 style={webStyles.title}>Sign-up</h1>
          <input
            style={webStyles.input}
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            style={webStyles.input}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={webStyles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            style={webStyles.input}
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button style={webStyles.button} onClick={handleSignUp}>
            Sign Up
          </button>
          <p>
            Already have an account? <a href="/Login"> Sign in</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign-up</Text>
      <TextInput style={styles.input} placeholder="name" value={name} onChangeText={setName} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
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
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
})

const webStyles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '100%',
    margin: '0 auto',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    border: '1px solid #ccc',
    padding: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
}

export default SignUpPage
