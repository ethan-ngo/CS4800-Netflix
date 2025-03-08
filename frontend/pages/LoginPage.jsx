import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, TextInput, Button, FlatList, StyleSheet, Platform } from 'react-native'

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLogin = () => {
      Alert.alert('Login Attempt', `Email: ${email}\nPassword: ${password}`);
    };
    
    if (Platform.OS === 'web') {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <View style={styles.formContainer}>
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
      </View>
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
      width: '100%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 8,
    },
})
const webStyles = {
    container: {
      padding: 20,
      maxWidth: '100%',
      margin: '0 auto',
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    form: {
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
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