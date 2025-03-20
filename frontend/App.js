import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Platform, ScrollView } from 'react-native'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/signUpPage'
import HomePage from './pages/HomePage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MediaDetails from './pages/mediaDetails'

import ForgotPassword from './pages/ForgotPassword'
import SignUpPageNative from './pages/SignUpPageNative'
import LoginPageNative from './pages/LoginPageNative'
import ForgotPasswordNative from './pages/ForgotPasswordNative'
import HomePageNative from './pages/HomePageNative'
import ResetPasswordNative from './pages/ResetPasswordNative'
import ProfilePageNative from './pages/ProfilePageNative'
import MediaDetailsNative from './pages/mediaDetailsNative'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Header from './components/Header';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Header/>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}
        >
          <Stack.Screen name="Home" component={HomePageNative} />
          <Stack.Screen name="Login" component={LoginPageNative} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordNative} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordNative} />
          <Stack.Screen name="SignUp" component={SignUpPageNative} />
          <Stack.Screen name="Profile" component={ProfilePageNative} />
          <Stack.Screen name="MediaDetailsNative" component={MediaDetailsNative} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );

  return (
    <Router>
      <div style={styles.container}>
        {Platform.OS === 'web' ? (
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/signUp" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/media/:id" element={<MediaDetails />} />
            <Route path="/forgot" element={<ForgotPassword />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/signUp" element={<signUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot" element={<ForgotPassword />} />
          </Routes>
        )}
      </div>
    </Router>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    overflowX: 'auto',
    overflowY: 'auto',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
