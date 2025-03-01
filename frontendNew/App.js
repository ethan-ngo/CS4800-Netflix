import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Platform, ScrollView } from 'react-native'
import DisplayDB from './pages/DisplayDB'

export default function App() {
  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <DisplayDB collectionName="users" fields={['name', 'email', 'password']} />
          <DisplayDB
            collectionName="userMovieInfo"
            fields={['userID', 'movieID', 'numWatched', 'timeStamp', 'userRating']}
          />
        </ScrollView>
      ) : (
        <div>
          <DisplayDB collectionName="users" fields={['name', 'email', 'password']} />
          <DisplayDB
            collectionName="userMovieInfo"
            fields={['userID', 'movieID', 'numWatched', 'timeStamp', 'userRating']}
          />
        </div>
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
