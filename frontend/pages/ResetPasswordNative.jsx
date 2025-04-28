/**
 * ResetPasswordNative Component
 * 
 * This component provides a user interface for users to reset their account password.
 * It allows users to enter a new password and confirm it. The component validates the
 * input and sends the updated password to the backend API.
 * 
 * Props:
 * - navigation: React Navigation object for navigating between screens.
 * - route: Object containing parameters passed to this screen, including:
 *   - _id: The user ID of the account being reset.
 *   - email: The email address of the user.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import theme from '../utils/theme';

const ResetPasswordNative = ({ navigation, route }) => {
  // State variables
  const [password, setPassword] = useState(''); // New password input
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirm password input

  /**
   * handleSubmit - Handles the password reset process.
   * 
   * This function validates the user's input to ensure the passwords match and are not empty.
   * If valid, it sends the new password to the backend API to update the user's account.
   * On success, the user is navigated back to the Login screen with a success message.
   */
  const handleSubmit = async () => {
    // Validate password and confirm password
    if (confirmPassword !== password || confirmPassword === '' || password === '') {
      Alert.alert('Invalid password', 'Passwords must match and cannot be empty.');
      return;
    }

    try {
      // Send the new password to the backend API
      const response = await fetch(`${process.env.APP_URL}users/${route.params._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: password }),
      });

      if (response.ok) {
        // Navigate to the Login screen on success
        navigation.navigate('Login');
        Alert.alert('Success', 'Password reset successfully.');
      } else {
        Alert.alert('Error', 'Failed to reset password.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert('Error', 'An error occurred while resetting the password.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Reset Account Password</Text>
        <Text style={styles.message}>Enter a new password for {route.params.email}.</Text>
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
        />
        {/* Submit button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
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
});

export default ResetPasswordNative;
