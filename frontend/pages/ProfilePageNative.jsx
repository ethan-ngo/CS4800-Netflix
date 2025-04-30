import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { validateEmail } from '../utils/validateEmail';
import theme from '../utils/theme';
import { s3, BUCKET_NAME } from '../aws-config';
import HomeNavbar from '../components/HomeNavbar';
import { LinearGradient } from 'expo-linear-gradient';
import Popup from '../components/popup';

const ProfilePageNative = ({ navigation }) => {
  const [profilePic, setProfilePic] = useState(null)
  const [profilePicURI, setProfilePicURI] = useState(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('1')
  const [originalProfilePic, setOriginalProfilePic] = useState(null)
  const [originalUsername, setOriginalUsername] = useState('')
  const [originalEmail, setOriginalEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [confirmPopupVisible, setConfirmPopupVisible] = useState(false)

  /**
   * fetchUserData - Loads the current user's profile information.
   * Fetches the user's data using the stored email from AsyncStorage.
   * Sets state with username, email, profile picture, and userId.
   */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = await AsyncStorage.getItem('email');
        if (!email) {
          console.error('Error: Email is missing');
          setPopupMessage('You are not authenticated');
          setPopupVisible(true);
          setLoading(false);
          return;
        }
        console.log('Fetched email:', email);

        const userResponse = await fetch(`${process.env.APP_URL}users/getUserByEmail/${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          console.error('Error fetching user details:', errorData.message);
          setPopupMessage(errorData.message || 'Failed to fetch user details');
          setPopupVisible(true);
          setLoading(false);
          return;
        }

        const user = await userResponse.json();
        console.log('Fetched user details:', user);

        setUserId(user.userId);
        setProfilePicURI(user.profilePic);
        setUsername(user.name);
        setEmail(user.email);

        setOriginalProfilePic(user.profilePic);
        setOriginalUsername(user.name);
        setOriginalEmail(user.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setPopupMessage('An error occurred while fetching user data');
        setPopupVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  /**
   * pickImage - Opens the image picker for user to select a new profile picture.
   * If the user selects an image, the URI and asset object are stored in state.
   */
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0]);
      setProfilePicURI(result.assets[0].uri);
    }
  };

  /**
   * getBlobFromUri - Converts an image URI into a blob.
   * @param {string} uri - The image URI
   * @returns {Promise<Blob>} - A blob representing the image file
   */
  const getBlobFromUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  /**
   * handleUpdateProfile - Handles submission of updated profile data.
   * Validates email, optionally uploads a new profile picture to S3,
   * and sends PATCH request to update the user's profile in the backend.
   * Displays success or error messages accordingly.
   */
  const handleUpdateProfile = async () => {
    if (!validateEmail(email)) {
      setPopupMessage('Invalid Email: Please enter a valid email address');
      setPopupVisible(true);
      return;
    }

    const updatedUserData = {};
    if (username) updatedUserData.name = username;
    if (email) updatedUserData.email = email;

    try {
      // Upload profile picture if it has been changed
      if (profilePic && profilePic.uri !== originalProfilePic) {
        const blob = await getBlobFromUri(profilePic.uri);
        const params = {
          Bucket: BUCKET_NAME,
          Key: userId,
          Body: blob,
          ContentType: profilePic.mimeType,
        };

        const { Location } = await s3.upload(params).promise();
        updatedUserData.profilePic = Location;
      }

      // Send the updated profile data to the backend
      const response = await fetch(`${process.env.APP_URL}users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setPopupMessage('Profile updated successfully');
        setPopupVisible(true);
        console.log('Updated user data:', responseData);
      } else {
        const errorData = await response.json();
        setPopupMessage(errorData.message || 'Failed to update profile');
        setPopupVisible(true);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setPopupMessage('An error occurred while updating the profile');
      setPopupVisible(true);
    }
  };

  /**
   * proceedWithUpdate - Confirms the update and proceeds with profile update.
   */
  const proceedWithUpdate = () => {
    setConfirmPopupVisible(false);
    handleUpdateProfile();
  };

  /**
   * handleReset - Resets the form fields to their original values.
   */
  const handleReset = () => {
    setProfilePicURI(originalProfilePic);
    setUsername(originalUsername);
    setEmail(originalEmail);
  };

  /**
   * handleNavigateToForgotPassword - Navigates to the ForgotPasswordNative screen.
   */
  const handleNavigateToForgotPassword = () => {
    navigation.navigate('ForgotPasswordNative'); // Navigate to Forgot Password page
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <LinearGradient colors={theme.gradient} style={styles.backgroundcontainer}>
      <HomeNavbar userID={userId} />
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {profilePicURI ? (
              <Image source={{ uri: profilePicURI }} style={styles.profileImage} />
            ) : (
              <Text style={styles.imageText}>Upload profile picture</Text>
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder={originalUsername}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder={originalEmail}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          {/* Link to Forgot Password Page */}
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} activeOpacity={0.8}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.updateButton} onPress={() => setConfirmPopupVisible(true)} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.8}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Popup */}
      <Popup
        visible={popupVisible}
        title="Notification"
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />

      {/* Confirmation Popup */}
      <Popup
        visible={confirmPopupVisible}
        title="Confirm Update"
        message="Are you sure you want to update your profile information?"
        onClose={() => setConfirmPopupVisible(false)} 
        onConfirm={proceedWithUpdate} // Proceed with the update
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  backgroundcontainer: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 0,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
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
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageText: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
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
  updateButton: {
    backgroundColor: theme.primaryColor,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 1,
    marginBottom: 10,
  },
  resetButtonText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPasswordLink: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});

export default ProfilePageNative;
