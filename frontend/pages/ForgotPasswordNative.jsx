import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';

const ForgotPasswordNative = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState('');

  const handleEmailSubmit = async () => {
    try {
      const res = await fetch(`${process.env.APP_URL}users`);
      const users = await res.json();
      const usersWithMatchingEmail = users.filter((user) => user.email === email);

      if (usersWithMatchingEmail.length === 0) {
        Alert.alert('Error', `${email} doesn't exist.`);
      } else {
        setSubmitted(true);

        try {
          const response = await fetch(`${process.env.APP_URL}users/send-email/${email}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          console.log(data);
          Alert.alert('Success', 'An email with the token has been sent.');
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to send email.');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch users.');
    }
  };

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
        Alert.alert('Success', 'Token validated successfully.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', 'Invalid token.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to validate token.');
    }
  };

  return (
    <View style={styles.container}>
      {submitted ? (
        <View style={styles.form}>
          <Text style={styles.title}>Thank you!</Text>
          <Text style={styles.message}>An email with the token has been sent to {email}</Text>
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
    </View>
  );
};

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
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
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