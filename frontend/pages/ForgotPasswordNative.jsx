/**
 * ForgotPasswordNative Component
 * 
 * This component provides a user interface for users to reset their account password.
 * It allows users to submit their email to receive a verification token and validate the token
 * to proceed to the password reset screen.
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
} from 'react-native';
import theme from '../utils/theme';
import Popup from '../components/popup'; // Import your Popup component

const ForgotPasswordNative = ({ navigation }) => {
  // State variables
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState('');
  const [userID, setUserID] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false); // State to control popup visibility
  const [popupMessage, setPopupMessage] = useState(''); // State for popup message

  /**
   * handleEmailSubmit - Handles the email submission process.
   * 
   * This function checks if the entered email exists in the database. If it does,
   * it sends a verification email to the user and updates the state to indicate
   * that the email has been submitted.
   */
  const handleEmailSubmit = async () => {
    try {
      const res = await fetch(`${process.env.APP_URL}users`);
      const users = await res.json();
      const usersWithMatchingEmail = users.filter((user) => user.email === email);

      if (usersWithMatchingEmail.length === 0) {
        setPopupMessage(`${email} doesn't exist.`);
        setPopupVisible(true); // Show the popup
      } else {
        try {
          const response = await fetch(`${process.env.APP_URL}users/send-email/${email}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          setUserID(data._id);
          setSubmitted(true);
        } catch (error) {
          console.error(error);
          setPopupMessage('Failed to send email.');
          setPopupVisible(true); // Show the popup
        }
      }
    } catch (error) {
      console.error(error);
      setPopupMessage('Failed to fetch users.');
      setPopupVisible(true); // Show the popup
    }
  };

  /**
   * handleTokenSubmit - Handles the token submission process.
   * 
   * This function validates the entered token by sending it to the backend.
   * If the token is valid, the user is navigated to the ResetPassword screen.
   */
  const handleTokenSubmit = async () => {
    try {
      const response = await fetch(`${process.env.APP_URL}users/validate-token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token }),
      });
      if (response.ok) {
        navigation.navigate('ResetPassword', { _id: userID, email: email });
      } else {
        setPopupMessage('Invalid token.');
        setPopupVisible(true); // Show the popup
      }
    } catch (error) {
      console.error(error);
      setPopupMessage('Failed to validate token.');
      setPopupVisible(true); // Show the popup
    }
  };

  return (
    <View style={styles.container}>
      {submitted ? (
        <View style={styles.form}>
          <Text style={styles.title}>Thank you!</Text>
          <Text style={styles.message}>An email with the token has been sent to {email}.</Text>
          <TextInput
            style={styles.input}
            placeholder="Token"
            value={token}
            onChangeText={setToken}
          />
          <TouchableOpacity style={styles.button} onPress={handleTokenSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.hyperlink}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.title}>Forgot Account Password</Text>
          <Text style={styles.message}>Please enter an email for us to send a verification code.</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.button} onPress={handleEmailSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.hyperlink}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Popup Component */}
      <Popup
        visible={popupVisible}
        title="Error"
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'gray',
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
  button: {
    backgroundColor: theme.primaryColor,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: theme.textColor,
    fontWeight: 'bold',
    fontSize: 16,
  },
  hyperlink: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

export default ForgotPasswordNative;