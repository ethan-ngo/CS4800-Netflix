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
import { getItems, getMovies, getShows, API_URL, ACCESS_TOKEN, getMoviesByGenre, getUserMovieInfoByUserID } from './api'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import HomeNavbar from '../components/HomeNavbar'
import LoadingOverlay from '../components/LoadingOverlay'
import { LinearGradient } from 'expo-linear-gradient'
import theme from '../utils/theme'
import { generateRecommendations } from '../utils/recommendations'

const screenWidth = Dimensions.get('window').width
const itemWidth = 120
const horizontalSpacing = 10
const itemsPerRow = Math.floor(screenWidth / (itemWidth + horizontalSpacing))
const APP_URL = process.env.APP_URL

/**
 * HomePageNative Component
 * 
 * This component serves as the main home page for the application. It displays
 * recommended movies, shows, and genre-based sections in a scrollable layout.
 * The data is fetched from the backend API and dynamically rendered.
 * 
 * Props:
 * - route: Object containing navigation parameters, including `userID` and `mode`.
 */

const HomePageNative = ({ route }) => {

  // State variables to manage media items, loading state, and recommendations.
  const [items, setItems] = useState([]); // All media items
  const [shows, setShows] = useState([]); // TV shows
  const [movies, setMovies] = useState([]); // Movies
  const [loading, setLoading] = useState(false); // Loading indicator
  const [recommendedMovies, setRecommendedMovies] = useState([]); // Recommended movies
  const [recommendedShows, setRecommendedShows] = useState([]); // Recommended shows
  const [mode, setMode] = useState('all'); // Display mode ('all', 'movies', 'shows')
  const [genreSection, setGenreSection] = useState([]); // Movies grouped by genre
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]) // Bookmarked movies
  const [bookmarkedShows, setBookmarkedShows] = useState([]) // Bookmarked shows
  const [recentlyWatched, setRecentlyWatched] = useState([]); // Recently watched movies/shows

  // Extract userID from navigation route parameters.
  const userID = route.params.userID;

  // Navigation object for navigating between screens.
  const navigation = useNavigation();

  /**
   * Effect to sync screen mode from navigation parameters.
   */
  useEffect(() => {
    if (route.params?.mode) {
      setMode(route.params.mode);
    }
  }, [route.params?.mode]);

  /**
   * Fetches all user movie data, then filters for:
   * 1. Bookmarked movies
   * 2. Recently watched movies (with timeStamp)
   * Sets state for both categories.
   */
  const fetchBookmarkedMovies = async () => {
    try {
      // Get all movie interaction data for the user
      const watchedMovieItems = await getUserMovieInfoByUserID(userID);

      // Filter for bookmarked movies and find their full info in `items`
      const bookmarkedMovies = watchedMovieItems
        .filter((movie) => movie.isBookmarked === true)
        .map((watchedMovie) => {
          return items.find((movie) => movie.Id === watchedMovie.movieID);
        });

      setBookmarkedMovies(bookmarkedMovies);

      // Filter for recently watched movies (has timeStamp)
      const recentlyWatchedItems = watchedMovieItems
        .filter((movie) => movie.timeStamp).reverse()
        .map((watchedMovie) => {
          return items.find((movie) => movie.Id === watchedMovie.movieID);
        });

      setRecentlyWatched(recentlyWatchedItems);
    } catch (error) {
      console.error('Error fetching bookmarked movies:', error);
    }
  };

  /**
   * Fetches bookmarked TV shows for the user.
   * Retrieves full show objects from `items`.
   */
  const fetchBookmarkedShows = async () => {
    try {
      const response = await fetch(`${APP_URL}userShowInfo/user/${userID}`);

      if (response.ok) {
        const watchedShowItems = await response.json();

        // Filter for bookmarked shows and find their full info in `items`
        const bookmarkedShows = watchedShowItems
          .filter((show) => show.isBookmarked === true)
          .map((watchedShow) => {
            return items.find((show) => show.Id === watchedShow.showID);
          });

        setBookmarkedShows(bookmarkedShows);
      }
    } catch (error) {
      console.error('Error fetching bookmarked shows:', error);
    }
  };

  /**
   * Fetch user data when screen is focused.
   * Ensures bookmarks and recently watched are updated live.
   */
  useFocusEffect(
    React.useCallback(() => {
      if (items) {
        fetchBookmarkedMovies();
        fetchBookmarkedShows();
      }
    }, [items])
  );

  /**
   * useEffect - Fetches media items and recommendations when the component mounts.
   * 
   * This effect fetches movies, shows, and genre-based data from the API.
   * It also generates recommendations for the user based on their preferences.
   */
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const mediaItems = await getItems();
        const showItems = await getShows();
        const movieItems = await getMovies();
        const genreData = await getMoviesByGenre();

        setItems(mediaItems);
        setShows(showItems);
        setMovies(movieItems);
        setGenreSection(genreData);

        const { movies: recMovies, shows: recShows } = await generateRecommendations(userID);

        // If no recommendations are available, use all items.
        if (recMovies && recMovies.length > 0) {
          const movieMap = new Map(movieItems.map((m) => [m.Id, m]));
          const matchedMovies = recMovies.map((rec) => movieMap.get(rec.movieID)).filter(Boolean);
          setRecommendedMovies(matchedMovies);
        } else {
          setRecommendedMovies(movieItems);
        }

        if (recShows && recShows.length > 0) {
          const showMap = new Map(showItems.map((s) => [s.Id, s]));
          const matchedShows = recShows.map((rec) => showMap.get(rec.showID)).filter(Boolean);
          setRecommendedShows(matchedShows);
        } else {
          setRecommendedShows(showItems);
        }
      } catch (error) {
        console.error('Error fetching media items:', error);
        Alert.alert('Error', 'Failed to fetch media items.');
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  /**
   * handleSelectShow - Navigates to the Show Details screen.
   * 
   * @param {Object} show - The selected show object.
   */
  const handleSelectShow = (show) => {
    navigation.navigate('ShowDetailsNative', { userID: userID, show });
  };

  /**
   * handleSelectItem - Navigates to the Media Details screen.
   * 
   * @param {Object} item - The selected media item (movie or show).
   */
  const handleSelectItem = (item) => {
    navigation.navigate('MediaDetailsNative', { userID: userID, media: item });
  };

  /**
   * renderMediaItem - Renders a single media item (movie or show) in a FlatList.
   * 
   * @param {Object} item - The media item to render.
   * @returns {JSX.Element|null} - A TouchableOpacity containing the media item's image and name.
   */
  const renderMediaItem = ({ item }) => {
    const hasImage = item.ImageTags?.Primary;
    const imageUrl = `${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`;

    if (!hasImage) {
      return null;
    }

    return (
      <TouchableOpacity style={styles.mediaItem} onPress={() => handleSelectItem(item)}>
        <Image source={{ uri: imageUrl }} style={styles.mediaImage} />
        <Text style={styles.mediaName} numberOfLines={2} ellipsizeMode="tail">
          {item.Name}
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * renderShowItem - Renders a single show item in a FlatList.
   * 
   * @param {Object} item - The show item to render.
   * @returns {JSX.Element|null} - A TouchableOpacity containing the show's image and name.
   */
  const renderShowItem = ({ item }) => {
    const hasImage = item.ImageTags?.Primary;
    const imageUrl = `${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`;

    if (!hasImage) {
      return null;
    }

    return (
      <TouchableOpacity style={styles.mediaItem} onPress={() => handleSelectShow(item)}>
        <Image source={{ uri: imageUrl }} style={styles.mediaImage} />
        <Text style={styles.mediaName} numberOfLines={2} ellipsizeMode="tail">
          {item.Name}
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * renderGenreSections - Renders carousels for each genre.
   * 
   * @returns {JSX.Element[]} - An array of genre sections, each containing a FlatList of movies.
   */
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
            <View style={styles.mediaSection}>
              <Text style={styles.sectionTitle}>Recommended Movies</Text>
              <FlatList
                data={recommendedMovies}
                keyExtractor={(item) => item.Id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={[styles.gridItem, { width: itemWidth }]}>
                    {renderMediaItem({ item })}
                  </View>
                )}
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
                renderItem={({ item }) => (
                  <View style={[styles.gridItem, { width: itemWidth }]}>
                    {renderShowItem({ item })}
                  </View>
                )}
                contentContainerStyle={styles.mediaList}
              />
            </View>
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
        {mode === 'bookmarked' && (
          <View style={styles.mediaSection}>
            <Text style={styles.sectionTitle}>Bookmarked Movies</Text>
            <View style={styles.gridContainer}>
              {bookmarkedMovies.map((item) => (
                <View key={item.Id} style={[styles.gridItem, { width: itemWidth }]}>
                  {renderMediaItem({ item })}
                </View>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Bookmarked Shows</Text>
            <View style={styles.gridContainer}>
              {bookmarkedShows.map((item) => (
                <View key={item.Id} style={[styles.gridItem, { width: itemWidth }]}>
                  {renderShowItem({ item })}
                </View>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Recently Watched</Text>
            <View style={styles.gridContainer}>
              {recentlyWatched
                .filter(item => item) 
                .map((item) => (
                  <View key={item.Id} style={[styles.gridItem, { width: itemWidth }]}>
                    {item.Type === 'Movie'
                      ? renderMediaItem({ item })
                      : renderShowItem({ item })}
                  </View>
                ))}
            </View>
          </View>
        )}
      </LinearGradient>
    </ScrollView>
  );
};

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
})

export default HomePageNative