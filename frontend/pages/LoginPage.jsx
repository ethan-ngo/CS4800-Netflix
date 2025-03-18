import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Platform, Alert } from 'react-native'
import { useNavigate } from 'react-router-dom'
import { validateEmail } from '../utils/validateEmail'
import '../globals.css'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isHoveringLogin, setIsHoveringLogin] = useState(false)
  const [isHoveringForgotPassword, setIsHoveringForgotPassword] = useState(false)
  const [isHoveringSignUpLink, setIsHoveringSignUpLink] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    console.log('Login Attempt', `Email: ${email}\nPassword: ${password}`)
    console.log(process.env.APP_URL);
    // Check if login credentials exist in db with "login"
    try {
      //const res = await fetch(`http://localhost:5050/users/login`, {
      const res = await fetch(process.env.APP_URL + 'users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
      Alert.alert('Login successful')
      const data = await res.json()
      console.log('Data:', data)
      // Store token
      localStorage.setItem('token', data.token)
      // Navigate to homepage
      navigate('/home')
    } catch (error) {
      console.error('Error (unable to login): ', error)
      Alert.alert('Login failed', 'Invalid email or password')
    }
  }

  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.container}>
        <div style={webStyles.form}>
          <h1 style={webStyles.title}>Login to DomainFilms</h1>
          <input
            style={webStyles.input}
            placeholder="Email"
            type="email"
            value={email || ''}
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
            value={password || ''}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ width: '75%', textAlign: 'right' }}>
            <a
              style={{
                ...webStyles.link,
                textDecoration: isHoveringForgotPassword ? 'underline' : 'none',
              }}
              onMouseEnter={() => setIsHoveringForgotPassword(true)}
              onMouseLeave={() => setIsHoveringForgotPassword(false)}
              onClick={() => navigate('/forgot')}
            >
              Forgot Password?
            </a>
          </div>
          <button
            onClick={handleLogin}
            style={{
              ...webStyles.LoginButton,
              backgroundColor: isHoveringLogin
                ? 'var(--dark-primary-color)'
                : 'var(--primary-color)',
            }}
            onMouseEnter={() => setIsHoveringLogin(true)}
            onMouseLeave={() => setIsHoveringLogin(false)}
          >
            Login
          </button>
          <p>
            <span>Don't have an account yet? </span>
            <a
              style={{
                ...webStyles.link,
                textDecoration: isHoveringSignUpLink ? 'underline' : 'none',
              }}
              onMouseEnter={() => setIsHoveringSignUpLink(true)}
              onMouseLeave={() => setIsHoveringSignUpLink(false)}
              onClick={() => navigate('/signUp')}
            >
              Sign up!
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderWidth: '2px',
    borderColor: 'black',
    borderStyle: 'solid',
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
  link: {
    justifyContent: 'right',
    color: 'blue',
    cursor: 'pointer',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: 30,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    width: '75%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingLeft: 8,
  },
  LoginButton: {
    padding: 10,
    color: 'var(--text-color)',
    backgroundColor: 'var(--primary-color)',
    border: 'none',
    height: '40',
    width: '75%',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: '16px',
  },
}

export default LoginPage
