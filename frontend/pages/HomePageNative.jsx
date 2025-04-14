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
import { getItems, getMovies, getShows, API_URL, ACCESS_TOKEN } from './api'
import { useNavigation } from '@react-navigation/native'
import HomeNavbar from '../components/HomeNavbar'
import LoadingOverlay from '../components/LoadingOverlay'
import { LinearGradient } from 'expo-linear-gradient'
import theme from '../utils/theme'
import { generateRecommendations } from '../utils/recommendations'

const screenWidth = Dimensions.get('window').width
const itemWidth = 120
const horizontalSpacing = 10
const itemsPerRow = Math.floor(screenWidth / (itemWidth + horizontalSpacing))

const HomePageNative = ({ route }) => {
  const [items, setItems] = useState([])
  const [shows, setShows] = useState([])
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [recommendedMovies, setRecommendedMovies] = useState([])
  const [recommendedShows, setRecommendedShows] = useState([])
  const [mode, setMode] = useState('all')

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
        setItems(mediaItems)
        setShows(showItems)
        setMovies(movieItems)

        const { movies: recMovies, shows: recShows } = await generateRecommendations(userID)

        // if no recommendations, use all items
        if (recMovies && recMovies.length > 0) {
          const movieMap = new Map(movieItems.map((m) => [m.Id, m]))
          const matchedMovies = recMovies.map((rec) => movieMap.get(rec.movieID)).filter(Boolean)
          setRecommendedMovies(matchedMovies)
        } else {
          setRecommendedMovies(movieItems)
        }

        if (recShows && recShows.length > 0) {
          const showMap = new Map(showItems.map((s) => [s.Id, s]))
          const matchedShows = recShows.map((rec) => showMap.get(rec.showID)).filter(Boolean)
          setRecommendedShows(matchedShows)
        } else {
          setRecommendedShows(showItems)
        }

        console.log('Recommended Movies:', recMovies)
        console.log('Recommended Shows:', recShows)
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

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      {loading && <LoadingOverlay visible={loading} />}
      <HomeNavbar userID={userID} />
      <LinearGradient colors={theme.gradient} style={styles.container}>
        {mode === 'all' && (
          <>
            <View style={styles.mediaSection}>
              <Text style={styles.sectionTitle}>Recommended Movies</Text>
              <FlatList
                data={recommendedMovies}
                keyExtractor={(item) => item.Id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderMediaItem}
                contentContainerStyle={styles.mediaList}
              />
            </View>

            <View style={styles.mediaSection}>
              <Text style={styles.sectionTitle}>Recommended Shows</Text>
              <FlatList
                data={recommendedShows}
                keyExtractor={(item) => item.Id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderShowItem}
                contentContainerStyle={styles.mediaList}
              />
            </View>

            <View style={styles.mediaSection}>
              <Text style={styles.sectionTitle}>All Movies</Text>
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
              <Text style={styles.sectionTitle}>All Shows</Text>
              <FlatList
                data={shows}
                keyExtractor={(item) => item.Id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderShowItem}
                contentContainerStyle={styles.mediaList}
              />
            </View>

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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  gridItem: {
    marginRight: horizontalSpacing,
    marginBottom: 15,
  },
})

export default HomePageNative
