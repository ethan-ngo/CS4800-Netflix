import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Platform, Alert } from 'react-native'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isHoveringLogin, setIsHoveringLogin] = useState(false)
  const [isHoveringSignUp, setIsHoveringSignUp] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    console.log('Login Attempt', `Email: ${email}\nPassword: ${password}`)

    // Check if login credentials exist in db with "login"
    try {
      //const res = await fetch(`http://localhost:5050/users/login`, {
      const res = await fetch(`https://cs4800netflix.vercel.app/users/login`, {
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

  const handleSignUp = () => {
    navigate('/signUp')
  }

  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.container}>
        <h1 style={webStyles.title}>Login</h1>
        <div style={webStyles.form}>
          <input
            style={webStyles.input}
            placeholder="Email"
            type="email"
            value={email || ''}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            style={webStyles.input}
            placeholder="Password"
            type="password"
            value={password || ''}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ width: '100%', textAlign: 'right' }}>
            <a href="https://www.google.com">Forgot Password?</a>
          </div>
          <button 
            onClick={handleLogin} 
            style={{
              ...webStyles.LoginButton,
              backgroundColor: isHoveringLogin ? '#0056b3' : '#007BFF',
            }}
            onMouseEnter={() => setIsHoveringLogin(true)}
            onMouseLeave={() => setIsHoveringLogin(false)}>
              Login
          </button>
          <p>Don't have an account yet? Sign up!</p>
          <button onClick={handleSignUp} style={{
              ...webStyles.SignUpButton,
              backgroundColor: isHoveringSignUp ? '#00006b' : '#00008B',
            }}
            onMouseEnter={() => setIsHoveringSignUp(true)}
            onMouseLeave={() => setIsHoveringSignUp(false)}>
            Sign Up
          </button>
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
    marginBottom: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  input: {
    width: 250,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  LoginButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    height: 40,
    width: 200,
    borderRadius: 5,
    marginLeft: '100',
    cursor: 'pointer',
  },
  SignUpButton: {
    padding: 10,
    backgroundColor: '#00008B',
    color: 'white',
    border: 'none',
    height: 40,
    width: 200,
    borderRadius: 5,
    marginLeft: '100',
    cursor: 'pointer',
  },
}

export default LoginPage
