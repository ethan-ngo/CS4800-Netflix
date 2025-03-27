import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { validateEmail } from '../utils/validateEmail'
import theme from '../utils/theme'
import Header from '../components/Header'
import LoadingOverlay from '../components/LoadingOverlay'

const LoginPageNative = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const app_url = process.env.APP_URL

  const authUser = async () => {
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
    const response = await fetch(app_url + 'users/auth-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    })
    if (response.ok) {
      const data = await response.json()
      navigation.navigate('Home', { userID: data.userId })
    }
    setLoading(false)
  }

  useEffect(() => {
    authUser()
  }, [])

  const handleLogin = async () => {
    console.log('Login Attempt', `Email: ${email}\nPassword: ${password}`)
    setLoading(true)
    try {
      const res = await fetch(app_url + 'users/login', {
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
      await AsyncStorage.setItem('token', data.token)
      await AsyncStorage.setItem('email', email)

      // Navigate to homepage
      navigation.navigate('Home', { userID: data.userID })
    } catch (error) {
      console.error('Error (unable to login): ', error)
      Alert.alert('Login failed', 'Invalid email or password')
    }
    setLoading(false)
  }

  const handleSignUp = () => {
    navigation.navigate('SignUp')
  }

  return (
    <View style={styles.container}>
      {loading && <LoadingOverlay visible={loading} />}
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.title}>Login</Text>
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
            onSubmitEditing={handleLogin} // after password is enterd, submit on enter
          />
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.loginButton}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.signUpText}>
            Don't have an account yet?{' '}
            <Text style={styles.signUpLink} onPress={handleSignUp}>
              Sign up!
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  form: {
    width: '100%',
    maxWidth: 500,
    padding: 50,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 10,
  },
  title: {
    fontSize: 26,
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
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  forgotPassword: {
    color: '#007BFF',
    textAlign: 'right',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: theme.primaryColor,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  signUpLink: {
    textDecorationLine: 'underline',
    color: '#007BFF',
  },
  buttonText: {
    color: theme.textColor,
    fontWeight: 'bold',
    fontSize: 16,
  },
  signUpText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    color: 'gray',
  },
})

export default LoginPageNative
