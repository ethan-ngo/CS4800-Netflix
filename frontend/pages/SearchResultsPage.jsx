import React from 'react'
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image } from 'react-native'
import { API_URL, ACCESS_TOKEN } from '../pages/api'
import { useNavigation } from '@react-navigation/native'
import HomeNavbar from '../components/HomeNavbar'

const SearchResultsPage = ({ route }) => {
  const { searchTerm, filteredMovies = [], filteredShows = [], userID } = route.params
  const navigation = useNavigation()

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
      <HomeNavbar userID={userID} />
      <View style={styles.container}>
        <Image
          source={{
            uri:
              'https://static.vecteezy.com/system/resources/thumbnails/013/630/282/small/interesting-gradient-design-purple-black-free-photo.jpg',
          }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <Text style={styles.mainTitle}>Search Results for "{searchTerm}"</Text>

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
      </View>
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
