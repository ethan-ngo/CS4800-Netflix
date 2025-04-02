import React, { useState, useEffect } from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import { getItems, getMovies, getShows, API_URL, ACCESS_TOKEN } from '../pages/api'
import { useNavigation } from '@react-navigation/native'
import '../globals.css'
import MediaDetailsNative from '../pages/mediaDetailsNative'

const Searchbar = ({ userID }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchBarOpen, setSearchBarOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [filteredMovies, setFilteredMovies] = useState([])
  const [filteredShows, setFilteredShows] = useState([])
  const [filteredMedia, setFilteredMedia] = useState([])
  const navigation = useNavigation()

  const onClickSearch = () => {
    setSearchBarOpen(!searchBarOpen)
    setSearchTerm('')
    console.log('Search bar clicked')
  }

  const onClickSearchResult = (item) => {
    console.log('Search result clicked:', item)
    navigation.navigate('MediaDetailsNative', { media: item })
  }

  const handleType = async (text) => {
    console.log('Search term:', text)
    setSearchTerm(text)
    const movieItems = await getMovies()
    const showItems = await getShows()
    const mediaItems = await getItems()

    const filteredMovies = movieItems.filter((item) =>
      item.Name.toLowerCase().includes(text.toLowerCase())
    )
    const filteredShows = showItems.filter((item) =>
      item.Name.toLowerCase().includes(text.toLowerCase())
    )
    const filteredMedia = mediaItems.filter((item) =>
      item.Name.toLowerCase().includes(text.toLowerCase())
    )
    // console.log('Filtered Movies:', filteredMovies)
    // console.log('Filtered Shows:', filteredShows)
    // console.log('Filtered Media:', filteredMedia)

    setFilteredMovies(filteredMovies)
    setFilteredShows(filteredShows)
    setFilteredMedia(filteredMedia)
  }

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      console.log('Search initiated for:', searchTerm)
      console.log('Filtered Movies:', filteredMovies)
      console.log('Filtered Shows:', filteredShows)
      console.log('Filtered Media:', filteredMedia)
      // when enter is pressed, navigate to the search results page with the movies, shows, and images from the search
      navigation.navigate('SearchResultsPage', {
        searchTerm,
        filteredMovies,
        filteredShows,
        filteredMedia,
        userID: userID,
      })
    }
  }

  return (
    <View style={styles.container}>
      {searchBarOpen && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBarInput}
            placeholder="Search"
            value={searchTerm}
            onChangeText={handleType}
            onKeyPress={handleSearch}
          />
          {searchTerm && (
            <View style={styles.searchResultContainer}>
              {filteredMovies.length > 0 && (
                <View>
                  <Text style={styles.searchResultCategory}> Movies </Text>
                  {filteredMovies.map((item) => (
                    <TouchableOpacity
                      key={item.Id}
                      style={[
                        styles.searchResultItem,
                        hoveredItem === item.Id && styles.hoveredSearchResultItem,
                      ]}
                      onMouseEnter={() => setHoveredItem(item.Id)}
                      onMouseExit={() => setHoveredItem(null)}
                      onPress={() => onClickSearchResult(item)}
                    >
                      <Text style={[hoveredItem === item.Id && styles.hoveredSearchResultItemText]}>
                        {item.Name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {filteredShows.length > 0 && (
                <View>
                  <Text style={styles.searchResultCategory}> Shows </Text>
                  {filteredShows.map((item) => (
                    <TouchableOpacity
                      key={item.Id}
                      style={[
                        styles.searchResultItem,
                        hoveredItem === item.Id && styles.hoveredSearchResultItem,
                      ]}
                      onMouseEnter={() => setHoveredItem(item.Id)}
                      onMouseExit={() => setHoveredItem(null)}
                    >
                      <Text style={[hoveredItem === item.Id && styles.hoveredSearchResultItemText]}>
                        {item.Name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      )}
      <TouchableOpacity style={styles.searchButton} onPress={onClickSearch}>
        <Icon name="search" size={24} color="white" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    position: 'relative',
  },
  searchButton: {
    padding: 10,
    margin: 10,
    cursor: 'pointer',
    color: 'var(--text-color)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarInput: {
    height: 40,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    fontSize: 16,
    paddingLeft: 20,
  },
  searchResultContainer: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    zIndex: 1001,
    overflow: 'hidden',
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  hoveredSearchResultItem: {
    backgroundColor: 'rgba(98, 0, 234, 0.1)',
  },
  hoveredSearchResultItemText: {
    fontWeight: 'bold',
  },
  searchResultCategory: {
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'var(--background-color)',
    width: '100%',
  },
})

export default Searchbar
