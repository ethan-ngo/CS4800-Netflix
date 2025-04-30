/**
 * SignUpPageNative Component
 * 
 * This component provides a user interface for users to create a new account.
 * It includes fields for entering a name, email, password, and confirming the password.
 * The component validates the input fields and sends the data to the backend API to create
 * a new user account. It also provides navigation to the Login page for existing users.
 * 
 * Props:
 * - navigation: React Navigation object for navigating between screens.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { validateEmail } from '../utils/validateEmail';
import theme from '../utils/theme';
import Header from '../components/Header';
import LoadingOverlay from '../components/LoadingOverlay';
import Popup from '../components/popup'; // Import your Popup component

const SignUpPageNative = ({ navigation }) => {
  // State variables
  const [name, setName] = useState(''); // User's name input
  const [email, setEmail] = useState(''); // User's email input
  const [password, setPassword] = useState(''); // User's password input
  const [confirmPassword, setConfirmPassword] = useState(''); // User's confirm password input
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [popupVisible, setPopupVisible] = useState(false); // State to control popup visibility
  const [popupMessage, setPopupMessage] = useState(''); // State for popup message

  /**
   * handleSignUp - Handles the sign-up process.
   * 
   * This function validates the input fields to ensure all fields are filled,
   * the email is valid, and the passwords match. If valid, it checks if the email
   * is already in use and sends the data to the backend API to create a new user account.
   * On success, the user is navigated to the Login page.
   */
  const handleSignUp = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      setPopupMessage('Please fill in all fields');
      setPopupVisible(true); // Show the popup
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setPopupMessage('Passwords do not match');
      setPopupVisible(true); // Show the popup
      setLoading(false);
      return;
    }

    try {
      // Check if email is already in use
      const res = await fetch(`${process.env.APP_URL}users?email=${email}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const users = await res.json();
      const usersWithMatchingEmail = users.filter((user) => user.email === email);

      if (usersWithMatchingEmail.length > 0) {
        setPopupMessage('Email is already in use');
        setPopupVisible(true); // Show the popup
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setPopupMessage('Failed to check email');
      setPopupVisible(true); // Show the popup
      setLoading(false);
      return;
    }

    try {
      // Create a new user
      const res = await fetch(`${process.env.APP_URL}users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, profilePic: null }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      console.log('New user created:', data);

      setPopupMessage('Account created successfully');
      setPopupVisible(true); // Show the popup
      navigation.navigate('Login'); // Navigate to the login page
    } catch (error) {
      console.error('Error creating user:', error);
      setPopupMessage('Failed to create account');
      setPopupVisible(true); // Show the popup
    }
    setLoading(false);
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
          <Text style={styles.title}>Sign Up</Text>
          {/* Name input */}
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
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
          />
          {/* Confirm password input */}
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onSubmitEditing={handleSignUp} // Submit on Enter key
          />
          {/* Sign Up button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleSignUp} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          {/* Navigate to Login link */}
          <Text style={styles.signUpText}>
            Already have an account?{' '}
            <Text style={styles.signUpLink} onPress={() => navigation.navigate('Login')}>
              Log In!
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
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: theme.primaryColor,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: theme.textColor,
    fontWeight: 'bold',
    fontSize: 16,
  },
  signUpLink: {
    textDecorationLine: 'underline',
    color: '#007BFF',
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

export default SignUpPageNative;
