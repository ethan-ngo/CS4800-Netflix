import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Platform, ScrollView } from 'react-native'
import DisplayDB from './pages/DisplayDB'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/signUpPage'

export default function App() {
  return (
    <div style={styles.container}>
      {Platform.OS === 'web' ? (
        <div>
          {/* <SignUpPage /> */}
          <LoginPage />
        </div>
      ) : (
        <div style={styles.container}>
          {/* <SignUpPage /> */}
          <LoginPage />
        </div>
      )}
    </div>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
