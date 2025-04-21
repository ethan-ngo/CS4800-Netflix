/**
 * SearchResultsPage Component
 * 
 * This component displays the search results for a given search term. It shows
 * filtered movies and TV shows in separate sections, allowing users to navigate
 * to the details page of a selected media item.
 * 
 * Props (via route parameters):
 * - searchTerm: The search term entered by the user.
 * - filteredMovies: An array of movie objects that match the search term.
 * - filteredShows: An array of TV show objects that match the search term.
 * - userID: The ID of the current user.
 */

import React from 'react'
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image } from 'react-native'
import { API_URL, ACCESS_TOKEN } from '../pages/api'
import { useNavigation } from '@react-navigation/native'
import HomeNavbar from '../components/HomeNavbar'
import { LinearGradient } from 'expo-linear-gradient'
import theme from '../utils/theme'

const SearchResultsPage = ({ route }) => {
  const { searchTerm, filteredMovies = [], filteredShows = [], userID } = route.params
  const navigation = useNavigation()

  /**
   * handleSelectItem - Navigates to the Media Details screen for the selected item.
   * 
   * @param {Object} item - The selected media item (movie or show).
   */
  const handleSelectItem = (item) => {
    navigation.navigate('MediaDetailsNative', { media: item })
  }

  /**
   * renderMediaItem - Renders a single media item (movie or show) in the FlatList.
   * 
   * @param {Object} item - The media item to render.
   * @returns {JSX.Element|null} - A TouchableOpacity containing the media item's image and name.
   */
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
      {/* Navigation bar */}
      <HomeNavbar userID={userID} />
      <LinearGradient colors={theme.gradient} style={styles.container}>
        {/* Search results title */}
        <Text style={styles.mainTitle}>Search Results for "{searchTerm}"</Text>

        {/* Movies section */}
        {filteredMovies.length > 0 && (
          <View style={styles.mediaSection}>
            <Text style={styles.sectionTitle}>Movies</Text>
            <FlatList
              data={filteredMovies}
              keyExtractor={(item) => item.Id}
              renderItem={renderMediaItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mediaList}
            />
          </View>
        )}

        {/* Shows section */}
        {filteredShows.length > 0 && (
          <View style={styles.mediaSection}>
            <Text style={styles.sectionTitle}>Shows</Text>
            <FlatList
              data={filteredShows}
              keyExtractor={(item) => item.Id}
              renderItem={renderMediaItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mediaList}
            />
          </View>
        )}
      </LinearGradient>
    </ScrollView>
  )
}

// Styles for the component
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  mediaSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    marginLeft: 5,
  },
  mediaList: {
    paddingLeft: 5,
  },
  mediaItem: {
    marginRight: 15,
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

export default SearchResultsPage
