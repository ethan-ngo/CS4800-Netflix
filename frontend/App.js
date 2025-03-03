import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Platform, ScrollView } from 'react-native'
import DisplayDB from './pages/DisplayDB'

export default function App() {
  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
          <DisplayDB collectionName="users" fields={['name', 'email', 'password']} />
          <DisplayDB
            collectionName="userMovieInfo"
            fields={['userID', 'movieID', 'numWatched', 'timeStamp', 'userMovieRating']}
          />
          <DisplayDB collectionName="actors" fields={['actor_name', 'DOB', 'movies_appeared']} />
          <DisplayDB
            collectionName="directors"
            fields={['director_name', 'DOB', 'movies_directed']}
          />
          <DisplayDB
            collectionName="movies"
            fields={['title', 'overall_rating', 'genres', 'movie_length', 'actors', 'directors']}
          />
        </div>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <DisplayDB collectionName="users" fields={['name', 'email', 'password']} />
          <DisplayDB
            collectionName="userMovieInfo"
            fields={['userID', 'movieID', 'numWatched', 'timeStamp', 'userMovieRating']}
          />
          <DisplayDB collectionName="actors" fields={['actor_name', 'DOB', 'movies_appeared']} />
          <DisplayDB
            collectionName="directors"
            fields={['director_name', 'DOB', 'movies_directed']}
          />
          <DisplayDB
            collectionName="movies"
            fields={['title', 'overall_rating', 'genres', 'movie_length', 'actors', 'directors']}
          />
        </ScrollView>
      )}
    </View>
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
