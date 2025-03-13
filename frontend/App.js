import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Platform, ScrollView } from 'react-native'
import DisplayDB from './pages/DisplayDB'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/signUpPage'
import HomePage from './pages/HomePage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MediaDetails from './pages/mediaDetails'

export default function App() {
  return (
    <Router>
      <div style={styles.container}>
        {Platform.OS === 'web' ? (
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/signUp" element={<SignUpPage/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/media/:id" element={<MediaDetails />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/signUp" element={<signUpPage/>} />
            <Route path="/login" element={<LoginPage/>} />
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
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
