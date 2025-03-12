import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, TextInput, Button, FlatList, StyleSheet, Platform } from 'react-native'

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLogin = () => {
      Alert.alert('Login Attempt', `Email: ${email}\nPassword: ${password}`);
    };
    
    const handleSignUp = () => {
      Alert.alert('Sign Up Attempt', `Email: ${email}\nPassword: ${password}`);
    };

    const handleUsernameOrEmailChange = (field, value) => {
      setEmail({
        ...email,
        [field]: value,
      })
    }

    const handlePasswordChange = (field, value) => {
      setPassword({
        ...password,
        [field]: value,
      })
    }

    if (Platform.OS === 'web') {
      return (
        <div style={webStyles.container}>
          <h1 style={webStyles.title}>Login</h1>
          <div style={webStyles.form}>
          <input
            style={webStyles.input}
            placeholder="Email"
            type="email-address"
            value={email || ''}
            onChange={(e) => handleUsernameOrEmailChange(email, e.target.value)}
          />
          <br />
          <input
            style={webStyles.input}
            placeholder="Password"
            securetextentry="true"
            value={password || ''}
            onChange={(e) => handlePasswordChange(password, e.target.value)}
          />
          <div style={{width: "100%", textAlign: "right"}}>
            <a href="https://www.google.com">Forgot Password?</a>
          </div>
          <button onClick={handleLogin}
            style={webStyles.LoginButton}> 
            Login
          </button>
          <p>Don't have an account yet? Sign up!</p>
          <button onClick={handleSignUp}
            style={webStyles.SignUpButton}> 
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
      width: '100',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 8,
    },
})
const webStyles = {
  link:{
    justifyContent: 'right',
    cursor: "pointer",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px", 
  },
    subtitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
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
    SignUpButton:{
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
    response: {
      marginTop: 20,
    },
    items: {
      marginTop: 20,
    },
    itemList: {
      listStyleType: 'none',
      padding: 0,
    },
    item: {
      padding: 10,
      borderBottom: '1px solid #ccc',
    },
}
export default LoginPage