/**
 * LoginPageNative Component
 * 
 * This component provides a user interface for users to log in to their accounts.
 * It includes fields for email and password, and provides options for navigating
 * to the "Forgot Password" and "Sign Up" screens. The component also handles
 * authentication and session management.
 * 
 * Props:
 * - navigation: React Navigation object for navigating between screens.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail } from '../utils/validateEmail';
import theme from '../utils/theme';
import Header from '../components/Header';
import LoadingOverlay from '../components/LoadingOverlay';
import Popup from '../components/popup'; // Import your Popup component

const LoginPageNative = ({ navigation }) => {
  // State variables
  const [email, setEmail] = useState(''); // User's email input
  const [password, setPassword] = useState(''); // User's password input
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [popupVisible, setPopupVisible] = useState(false); // State to control popup visibility
  const [popupMessage, setPopupMessage] = useState(''); // State for popup message
  const app_url = process.env.APP_URL; // Backend API URL

  /**
   * authUser - Authenticates the user session using a stored token.
   * 
   * This function checks if a valid session token exists in AsyncStorage.
   * If the token is valid, the user is automatically logged in and navigated
   * to the Home screen.
   */
  const authUser = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(app_url + 'users/auth-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    });
    if (response.ok) {
      const data = await response.json();
      navigation.navigate('Home', { userID: data.userId });
    }
    setLoading(false);
  };

  // Automatically authenticate the user session on component mount
  useEffect(() => {
    authUser();
  }, []);

  /**
   * handleLogin - Handles the login process.
   * 
   * This function sends the user's email and password to the backend API for authentication.
   * If the login is successful, the session token is stored in AsyncStorage, and the user
   * is navigated to the Home screen. If the login fails, an error message is displayed.
   */
  const handleLogin = async () => {
    console.log('Login Attempt', `Email: ${email}\nPassword: ${password}`);
    setLoading(true);
    try {
      const res = await fetch(app_url + 'users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      setPopupMessage('Login successful');
      setPopupVisible(true); // Show the popup
      const data = await res.json();
      console.log('Data:', data);

      // Store token and user details in AsyncStorage
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('userID', data.userID);

      // Navigate to the Home screen
      navigation.navigate('Home', { userID: data.userID });
    } catch (error) {
      console.error('Error (unable to login): ', error);
      setPopupMessage('Login failed: Invalid email or password');
      setPopupVisible(true); // Show the popup
    }
    setLoading(false);
  };

  /**
   * handleSignUp - Navigates to the Sign Up screen.
   */
  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      {/* Loading overlay */}
      {loading && <LoadingOverlay visible={loading} />}
      <View style={styles.overlay} />
      <Image
        source={{
          uri: 'https://wallpapers.com/images/hd/movie-poster-background-wg5mxe6b7djul0a8.jpg',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.title}>Login</Text>
          {/* Email input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            onBlur={() => {
              if (email && !validateEmail(email)) {
                setPopupMessage('Invalid Email: Please enter a valid email address');
                setPopupVisible(true); // Show the popup
              }
            }}
          />
          {/* Password input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin} // Submit on Enter key
          />
          {/* Forgot Password link */}
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          {/* Login button */}
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.loginButton}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          {/* Sign Up link */}
          <Text style={styles.signUpText}>
            Don't have an account yet?{' '}
            <Text style={styles.signUpLink} onPress={handleSignUp}>
              Sign up!
            </Text>
          </Text>
        </View>
      </ScrollView>

      {/* Popup Component */}
      <Popup
        visible={popupVisible}
        title="Notification"
        message={popupMessage}
        onClose={() => setPopupVisible(false)} // Close the popup
      />
    </View>
  );
};

// Styles for the component
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
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.7,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});

export default LoginPageNative;
