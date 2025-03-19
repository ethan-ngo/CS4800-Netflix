import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native'
import { getItems, getMovies, getShows } from './api'
import Video from 'react-native-video'

const API_URL = process.env.REACT_APP_API_URL
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN

const HomePageNative = ({ navigation }) => {
  const [items, setItems] = useState([])
  const [shows, setShows] = useState([])
  const [movies, setMovies] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

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
    setSelectedItem(item) // Set the selected item to display in the modal
  }

  const handleLogout = async () => {
    try {
      navigation.navigate('Login')
      console.log('Logged out')
    } catch (error) {
      console.error('Error logging out:', error)
    }
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

      {/* Modal for Selected Item */}
      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedItem}
          onRequestClose={() => setSelectedItem(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedItem.Name}</Text>
              <Video
                source={{
                  uri: `${API_URL}/Videos/${selectedItem.Id}/stream?api_key=${ACCESS_TOKEN}`,
                }}
                style={styles.mediaVideo}
                resizeMode="none"
                muted={true} // Mute the video by default
                repeat={true} // Loop the video
              />
              <Text style={styles.modalDescription}>
                Description: {selectedItem.Description || 'No description available.'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedItem(null)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'var(--background-color)',
    padding: 10,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    color: 'var(--primary-color)',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'var(--text-color)',
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
    width: 120, // Set a fixed width for the media item
  },
  mediaImage: {
    width: 120, // Adjust the width of the image
    height: 180, // Adjust the height of the image
    borderRadius: 5,
    marginBottom: 5, // Add space between the image and the title
  },
  mediaName: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#2F2F2F',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  mediaVideo: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#D3D3D3',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#E50914',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})

export default HomePageNative
