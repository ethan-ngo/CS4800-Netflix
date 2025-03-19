import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { getItems, getMovies, getShows } from './api'
import { useNavigation } from '@react-navigation/native'

const API_URL = process.env.REACT_APP_API_URL
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN

const HomePageNative = () => {
  const [items, setItems] = useState([])
  const [shows, setShows] = useState([])
  const [movies, setMovies] = useState([])

  const navigation = useNavigation()

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const mediaItems = await getItems()
        const showItems = await getShows()
        const movieItems = await getMovies()
        setItems(mediaItems)
        setShows(showItems)
        setMovies(movieItems)
      } catch (error) {
        console.error('Error fetching media items:', error)
        Alert.alert('Error', 'Failed to fetch media items.')
      }
    }

    fetchItems()
  }, [])

  const handleSelectItem = (item) => {
    // Navigate to the correct MediaDetailsNative component
    navigation.navigate('MediaDetailsNative', { media: item })
  }

  const handleLogout = () => {
    navigation.navigate('Login')
  }

  const handleSelectProfile = () => {
    navigation.navigate('Profile')
  }

  const renderMediaItem = ({ item }) => (
    <TouchableOpacity style={styles.mediaItem} onPress={() => handleSelectItem(item)}>
      <Image
        source={{
          uri: `${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`,
        }}
        style={styles.mediaImage}
      />
      <Text style={styles.mediaName}>{item.Name}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileButton} onPress={handleSelectProfile}>
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Media Lists */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.Id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderMediaItem}
        ListHeaderComponent={<Text style={styles.sectionTitle}>All Items</Text>}
        contentContainerStyle={styles.mediaList}
      />

      <FlatList
        data={movies}
        keyExtractor={(item) => item.Id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderMediaItem}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Movies</Text>}
        contentContainerStyle={styles.mediaList}
      />

      <FlatList
        data={shows}
        keyExtractor={(item) => item.Id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderMediaItem}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Shows</Text>}
        contentContainerStyle={styles.mediaList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logoutButton: {
    backgroundColor: '#E50914',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  mediaList: {
    marginBottom: 20,
  },
  mediaItem: {
    marginRight: 10,
    alignItems: 'center',
    width: 120,
  },
  mediaImage: {
    width: 120,
    height: 180,
    borderRadius: 5,
    marginBottom: 5,
  },
  mediaName: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    width: '100%',
  },
})

export default HomePageNative
