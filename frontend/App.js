import { View } from 'react-native'
import SignUpPageNative from './pages/SignUpPageNative'
import LoginPageNative from './pages/LoginPageNative'
import ForgotPasswordNative from './pages/ForgotPasswordNative'
import HomePageNative from './pages/HomePageNative'
import ResetPasswordNative from './pages/ResetPasswordNative'
import ProfilePageNative from './pages/ProfilePageNative'
import MediaDetailsNative from './pages/mediaDetailsNative'
import SearchResultsPage from './pages/SearchResultsPage'
import ShowDetailsNative from './pages/showDetailsNative'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Header from './components/Header'

export default function App() {
  const Stack = createNativeStackNavigator()

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        {/* <Header /> */}
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginPageNative} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordNative} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordNative} />
          <Stack.Screen name="SignUp" component={SignUpPageNative} />
          <Stack.Screen name="Profile" component={ProfilePageNative} />
          <Stack.Screen name="Home" component={HomePageNative} />
          <Stack.Screen name="MediaDetailsNative" component={MediaDetailsNative} />
          <Stack.Screen name="SearchResultsPage" component={SearchResultsPage} />
          <Stack.Screen name="ShowDetailsNative" component={ShowDetailsNative} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  )
}
