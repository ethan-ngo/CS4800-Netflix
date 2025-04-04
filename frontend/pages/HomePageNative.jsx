import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getItems, getMovies, getShows, API_URL, ACCESS_TOKEN } from './api'
import { useNavigation } from '@react-navigation/native'
import HomeNavbar from '../components/HomeNavbar'
import LoadingOverlay from '../components/LoadingOverlay'
import { LinearGradient } from 'expo-linear-gradient'
import theme from '../utils/theme'

const HomePageNative = ({ route }) => {
  const [items, setItems] = useState([])
  const [shows, setShows] = useState([])
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

  const userID = route.params.userID
  const navigation = useNavigation()

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const mediaItems = await getItems()
        const showItems = await getShows()
        const movieItems = await getMovies()
        setItems(mediaItems)
        setShows(showItems)
        setMovies(movieItems)
        console.log(mediaItems)
      } catch (error) {
        console.error('Error fetching media items:', error)
        Alert.alert('Error', 'Failed to fetch media items.')
      }
      setLoading(false)
    }

    fetchItems()
  }, [])

  const handleSelectItem = (item) => {
    navigation.navigate('MediaDetailsNative', { media: item })
  }

  const renderMediaItem = ({ item }) => {
    const hasImage = item.ImageTags?.Primary
    const imageUrl = `${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`

    if (!hasImage) {
      return null
    }

    return (
      <TouchableOpacity style={styles.mediaItem} onPress={() => handleSelectItem(item)}>
        <Image source={{ uri: imageUrl }} style={styles.mediaImage} />
        <Text style={styles.mediaName} numberOfLines={2} ellipsizeMode="tail">
          {item.Name}
        </Text>
      </TouchableOpacity>
    )
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      {loading && <LoadingOverlay visible={loading} />}
      <HomeNavbar userID={userID} />
      <LinearGradient colors={theme.gradient} style={styles.container}>
        <View style={styles.mediaSection}>
          <Text style={styles.sectionTitle}>All Items</Text>
          <FlatList
            data={items}
            keyExtractor={(item) => item.Id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderMediaItem}
            contentContainerStyle={styles.mediaList}
          />
        </View>

        <View style={styles.mediaSection}>
          <Text style={styles.sectionTitle}>Movies</Text>
          <FlatList
            data={movies}
            keyExtractor={(item) => item.Id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderMediaItem}
            contentContainerStyle={styles.mediaList}
          />
        </View>

        <View style={styles.mediaSection}>
          <Text style={styles.sectionTitle}>Shows</Text>
          <FlatList
            data={shows}
            keyExtractor={(item) => item.Id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderMediaItem}
            contentContainerStyle={styles.mediaList}
          />
        </View>
      </LinearGradient>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
    overflowy: 'auto',
    overflowx: 'auto',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    marginLeft: '1%',
  },
  mediaSection: {
    minHeight: '15%',
  },
  mediaList: {
    marginBottom: 20,
  },
  mediaItem: {
    marginRight: 10,
    alignItems: 'center',
    width: 120,
    margin: 15,
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
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
})

export default HomePageNative
