import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // validations and confirmation for sign-up
  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      if (Platform.OS === 'web') {
        alert('Error', 'Please fill in all fields');
      } else {
        Alert.alert('Error', 'Please fill in all fields');
      }
    return;
  }

    if (password !== confirmPassword) {
      if (Platform.OS === 'web') {
      alert('Error', 'Passwords do not match');
    } else {
      Alert.alert('Error', 'Passwords do not match');
    }
    return;
  }

  if (Platform.OS === 'web') {
      alert('Profile Created', `Email: ${email}\nPassword: ${password}`);
  } else {
    Alert.alert('Profile Created', `Email: ${email}\nPassword: ${password}`);
  }
};

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
          <button style={webStyles.button} onClick={handleSignUp}>Sign Up</button>
          <p>Already have an account? <a href="/Login"> Sign in</a></p>
        </div>
      </div>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign-up</Text>
      <TextInput
        style={styles.input}
        placeholder="name"
        value={name}
        onChangeText={setName}
      />
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
  );
};

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
});

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
};

export default SignUpPage;

