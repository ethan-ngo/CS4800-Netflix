import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native'
import { useNavigate, Link } from 'react-router-dom'
import { validateEmail } from '../utils/validateEmail'
import '../globals.css'

const SignUpPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [response, setResponse] = useState(null)
  const navigate = useNavigate()
  const [isHoveringLink, setIsHoveringLink] = useState(false)
  const [isHoveringSignUp, setIsHoveringSignup] = useState(false)

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
      const res = await fetch(process.env.APP_URL + 'users?email=${email}')
      //const res = await fetch(`http://localhost:5050/users?email=${email}`)
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
      //const res = await fetch(`http://localhost:5050/users`, {
      const res = await fetch(process.env.APP_URL + 'users', {
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
      navigate('/login')
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
          <h1 style={webStyles.title}>Sign-up to DomainFilms</h1>
          {/* <img src="path/to/your/image.jpg" alt="Profile" style={webStyles.profilePic} />
          <div style={webStyles.uploadContainer}>
            <label htmlFor="profilePicUpload" style={webStyles.uploadLabel}>
              Upload Image
            </label>
            <input
              id="profilePicUpload"
              type="file"
              accept="image/*"
              style={webStyles.uploadInput}
            />
          </div> */}
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
            onBlur={() => {
              if (email && !validateEmail(email)) {
                alert('Please enter a valid email address')
              }
            }}
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
          <button
            onClick={handleSignUp}
            style={{
              ...webStyles.button,
              backgroundColor: isHoveringSignUp
                ? 'var(--dark-primary-color)'
                : 'var(--primary-color)',
            }}
            onMouseEnter={() => setIsHoveringSignup(true)}
            onMouseLeave={() => setIsHoveringSignup(false)}
          >
            Sign Up
          </button>
          <p>
            <span>Already have an account? </span>
            <a
              style={{ ...webStyles.link, textDecoration: isHoveringLink ? 'underline' : 'none' }}
              onMouseEnter={() => setIsHoveringLink(true)}
              onMouseLeave={() => setIsHoveringLink(false)}
              onClick={() => navigate('/login')}
            >
              Log in
            </a>
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: '100%',
    objectFit: 'cover',
    margin: 20,
    border: '1px solid #ccc',
  },
  uploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '10px',
  },
  uploadLabel: {
    cursor: 'pointer',
    padding: '8px 16px',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--text-color)',
    display: 'inline-block',
    fontSize: '14px',
    borderRadius: 50,
  },
  uploadInput: {
    display: 'none',
  },
  formContainer: {
    border: '1px solid #ccc',
    padding: 30,
    borderRadius: 10,
    marginBottom: 20,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    alignItems: 'center',
  },
  input: {
    fontSize: 12,
    width: '75%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    margin: 10,
  },
  button: {
    padding: 10,
    margin: 10,
    backgroundColor: 'var(--primary-color)',
    color: 'var(--text-color)',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    width: '75%',
    fontSize: '16px',
  },
  link: {
    color: 'blue',
    cursor: 'pointer',
  },
}

export default SignUpPage
