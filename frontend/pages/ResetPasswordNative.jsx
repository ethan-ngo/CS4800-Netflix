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
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleSubmit = async () => {
		
		if (confirmPassword !== password || confirmPassword === "" || password === ""){
			Alert.alert("Invalid password")
			return
		}
		try {
			const response = await fetch(`${process.env.APP_URL}users/${route.params._id}`, {
				method: 'PATCH',
				headers: {
				  'Content-Type': 'application/json',
				},
				body: JSON.stringify({ password: password }),
			  });
			  if(response.ok) {
				navigation.navigate("Login")
				Alert.alert("Successfully reset password")
			  }
		} catch(error){
			console.error(error)
		}
	}
	return(
		<View style={styles.container}>
			<View style={styles.form}>
				<Text style={styles.title}>Reset Account Password</Text>
				<Text style={styles.message}>Enter a new password for {route.params.email}.</Text>
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
				<TouchableOpacity style={styles.button} onPress={handleSubmit}>
					<Text style={styles.buttonText}>Submit</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

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
