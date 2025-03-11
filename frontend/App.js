import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Platform, ScrollView } from 'react-native'
import DisplayDB from './pages/DisplayDB'
import LoginPage from './pages/LoginPage'
import ForgotPassword from './pages/ForgotPassword'
import { SafeAreaView } from 'react-native-web'

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ForgotPassword/>
    </SafeAreaView>
   /* <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <ScrollView>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
            <div style={{ maxWidth: '20%' }}>
              <DisplayDB collectionName="users" fields={['name', 'email', 'password']} />
            </div>
            <div style={{ maxWidth: '20%' }}>
              <DisplayDB
                collectionName="userMovieInfo"
                fields={['userID', 'movieID', 'numWatched', 'timeStamp', 'userMovieRating']}
              />
            </div>
            <div style={{ maxWidth: '20%' }}>
              <DisplayDB
                collectionName="actors"
                fields={['actor_name', 'DOB', 'movies_appeared']}
              />
            </div>
            <div style={{ maxWidth: '20%' }}>
              <DisplayDB
                collectionName="directors"
                fields={['director_name', 'DOB', 'movies_directed']}
              />
            </div>
            <div style={{ maxWidth: '20%' }}>
              <DisplayDB
                collectionName="movies"
                fields={[
                  'title',
                  'overall_rating',
                  'genres',
                  'movie_length',
                  'actors',
                  'directors',
                ]}
              />
            </div>
          </div>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <DisplayDB collectionName="users" fields={['name', 'email', 'password']} />
        </ScrollView>
      )}
    </View>*/
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
