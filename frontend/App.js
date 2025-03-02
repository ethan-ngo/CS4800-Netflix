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
        </div>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <DisplayDB collectionName="users" fields={['name', 'email', 'password']} />
          <DisplayDB
            collectionName="userMovieInfo"
            fields={['userID', 'movieID', 'numWatched', 'timeStamp', 'userMovieRating']}
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
