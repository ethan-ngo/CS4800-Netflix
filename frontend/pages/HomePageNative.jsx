import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native'
import { getItems, getMovies, getShows } from './api'
import Video from 'react-native-video'
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from "react-native-vector-icons/AntDesign"

const API_URL = process.env.REACT_APP_API_URL
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN

const HomePageNative = ({navigation, route}) => {
  const [items, setItems] = useState([])
  const [shows, setShows] = useState([])
  const [movies, setMovies] = useState([])
  const userID = route.params.userID;


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
    console.log('User ID: ' + userID);
    fetchItems()
    
  }, [])

  const renderItem = (item) => (
      <TouchableOpacity
        style={[styles.item, { backgroundColor: item.color }]}
        onPress={() => item.action()}
      >
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    )

  const handleSelectItem = (item) => {
    // Navigate to the correct MediaDetailsNative component
    navigation.navigate('MediaDetailsNative', { media: item })
  }

  const handleLogout = () => {
    if(Platform.OS === "web"){
      localStorage.clear();
    }
    navigation.navigate('Login');
  }

  const handleSelectProfile = () => {
    navigation.navigate('Profile')
  }
  const dropdownMenuItems = [
    { id: 1, name: "Profile", color: "green", action: handleSelectProfile, },
    { id: 3, name: "Logout", color: "red", action: handleLogout },
  ];
  const renderMediaItem = ({ item }) => (
    <TouchableOpacity style={styles.mediaItem} onPress={() => handleSelectItem(item)}>
      <Image
        source={{
          uri: `${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`,
        }}
        style={styles.mediaImage}
      />
      <Text style={styles.mediaName} numberOfLines={2} ellipsizeMode="tail">
        {item.Name}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navBar}>
        <Dropdown
              style={styles.dropdownButton}
              containerStyle={styles.dropdownMenu}
              data={dropdownMenuItems}
              renderItem={renderItem} 
              renderRightIcon={() => (
                  <AntDesign name="down" size={20} color="white" /> // Custom arrow icon
                )}
        />
        </View>
      {/*<View style={styles.navBar}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileButton} onPress={handleSelectProfile}>
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>}*/}

      {/* Media Lists */}
      <Text style={styles.sectionTitle}>All Items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.Id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderMediaItem}
        contentContainerStyle={styles.mediaList}
      />

      <Text style={styles.sectionTitle}>Movies</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.Id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderMediaItem}
        contentContainerStyle={styles.mediaList}
      />

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
    alignItems: 'right',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',

    color: 'var(--primary-color)',
  },
  dropdown:{
    width: 45, 
    height: 45,
    borderRadius: 30, 
    backgroundColor: "#3498db", // Blue circle
    justifyContent: "center",
    alignItems: "center",
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
  dropdownButton: {
    width: 45, 
    height: 45,
    borderRadius: 25, 
    backgroundColor: "#6200ea", 
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenu: {
    width: 200, 
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    ShadowColor: "#000",
    ShadowOpacity: 0.2,
    ShadowRadius: 4,
    elevation: 5,
  },
  item: {
    width: "100%",
    height: 50,
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  itemText: {
    color: "white",
    fontSize: 16,
  },
  selected: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default HomePageNative
