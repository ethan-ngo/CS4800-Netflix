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
  Dimensions,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getItems, getMovies, getShows, API_URL, ACCESS_TOKEN, getMoviesByGenre } from './api'
import { useNavigation } from '@react-navigation/native'
import HomeNavbar from '../components/HomeNavbar'
import LoadingOverlay from '../components/LoadingOverlay'
import { LinearGradient } from 'expo-linear-gradient'
import theme from '../utils/theme'

const screenWidth = Dimensions.get('window').width
const itemWidth = 120 // or whatever works for your item
const horizontalSpacing = 10
const itemsPerRow = Math.floor(screenWidth / (itemWidth + horizontalSpacing))

const HomePageNative = ({ route }) => {
  const [items, setItems] = useState([])
  const [shows, setShows] = useState([])
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [watchedMovies, setWatchedMovies] = useState([])
  const [isStarred, setIsStarred] = useState(false)
  const [mode, setMode] = useState('all') // default to show everything
  const [genreSection, setGenreSection] = useState([])

  useEffect(() => {
    if (route.params?.mode) {
      setMode(route.params.mode)
    }
  }, [route.params?.mode])

  const userID = route.params.userID
  const navigation = useNavigation()

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const mediaItems = await getItems()
        const showItems = await getShows()
        const movieItems = await getMovies()
        const genreData = await getMoviesByGenre()
        setItems(mediaItems)
        setShows(showItems)
        setMovies(movieItems)
        setGenreSection(genreData)
        console.log(mediaItems)
        console.log(genreData)
      } catch (error) {
        console.error('Error fetching media items:', error)
        Alert.alert('Error', 'Failed to fetch media items.')
      }
      setLoading(false)
    }

    fetchItems()
  }, [])

  const handleSelectShow = (show) => {
    navigation.navigate('ShowDetailsNative', { userID: userID, show })
  }

  const handleSelectItem = (item) => {
    navigation.navigate('MediaDetailsNative', { userID: userID, media: item })
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

  const renderShowItem = ({ item }) => {
    const hasImage = item.ImageTags?.Primary
    const imageUrl = `${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`

    if (!hasImage) {
      return null
    }

    return (
      <TouchableOpacity style={styles.mediaItem} onPress={() => handleSelectShow(item)}>
        <Image source={{ uri: imageUrl }} style={styles.mediaImage} />
        <Text style={styles.mediaName} numberOfLines={2} ellipsizeMode="tail">
          {item.Name}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderGenreSections = () => {
    if (!genreSection || typeof genreSection !== 'object' || Object.keys(genreSection).length === 0) {
      return (
        <View style={styles.mediaSection}>
          <Text style={styles.sectionTitle}>No genres available</Text>
        </View>
      );
    }

    return Object.entries(genreSection).map(([genre, genreMovies]) => {
      if (!genreMovies || !Array.isArray(genreMovies) || genreMovies.length === 0) {
        return null;
      }

      return (
        <View key={genre} style={styles.mediaSection}>
          <Text style={styles.sectionTitle}>{genre}</Text>
          <FlatList
            data={genreMovies}
            keyExtractor={(item) => item.movieID || item.Id || Math.random().toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              const mediaItem = item.embyInfo || item;
              return (
                <View style={[styles.gridItem, { width: itemWidth }]}>
                  {renderMediaItem({ item: mediaItem })}
                </View>
              );
            }}
            contentContainerStyle={styles.mediaList}
          />
        </View>
      );
    });
  };


  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      {loading && <LoadingOverlay visible={loading} />}
      <HomeNavbar userID={userID} />
      <LinearGradient colors={theme.gradient} style={styles.container}>
        {mode === 'all' && (
          <>
            {/* Temporary debug view - remove after fixing */}
            {/* <View style={{ backgroundColor: 'red', padding: 10 }}>
              <Text style={{ color: 'white' }}>Genre Data Debug:</Text>
              <Text style={{ color: 'white' }}>{JSON.stringify(Object.keys(genreSection || {}))}</Text>
              <Text style={{ color: 'white' }}>Movies length: {movies.length}</Text>
              <Text style={{ color: 'white' }}>Shows length: {shows.length}</Text>
            </View> */}
            {/* Render carousels for each genre */}
            {renderGenreSections()}
          </>

        )}

        {mode === 'movies' && (
          <View style={styles.mediaSection}>
            <Text style={styles.sectionTitle}>Movies</Text>
            <View style={styles.gridContainer}>
              {movies.map((item) => (
                <View key={item.Id} style={[styles.gridItem, { width: itemWidth }]}>
                  {renderMediaItem({ item })}
                </View>
              ))}
            </View>
          </View>
        )}

        {mode === 'shows' && (
          <View style={styles.mediaSection}>
            <Text style={styles.sectionTitle}>Shows</Text>
            <View style={styles.gridContainer}>
              {shows.map((item) => (
                <View key={item.Id} style={[styles.gridItem, { width: itemWidth }]}>
                  {renderShowItem({ item })}
                </View>
              ))}
            </View>
          </View>
        )}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    marginLeft: '1%',
  },
  mediaSection: {
    minHeight: 150,
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  gridItem: {
    marginRight: horizontalSpacing,
    marginBottom: 15,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
})

export default HomePageNative
