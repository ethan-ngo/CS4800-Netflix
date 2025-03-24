import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { getItems, getMovies, getShows, API_URL, ACCESS_TOKEN } from './api';
import { useNavigation } from '@react-navigation/native';

const HomePageNative = ({navigation, route}) => {
  const [items, setItems] = useState([])
  const [shows, setShows] = useState([])
  const [movies, setMovies] = useState([])
  const userID = route.params.userID;


  useEffect(() => {
    const fetchItems = async () => {
      try {
        const mediaItems = await getItems();
        const showItems = await getShows();
        const movieItems = await getMovies();
        setItems(mediaItems);
        setShows(showItems);
        setMovies(movieItems);
      } catch (error) {
        console.error('Error fetching media items:', error);
        Alert.alert('Error', 'Failed to fetch media items.');
      }
    };

    fetchItems();
  }, []);

  const renderItem = (item) => (
      <TouchableOpacity
        style={[styles.item, { backgroundColor: item.color }]}
        onPress={() => item.action()}
      >
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    )

  const handleSelectItem = (item) => {
    navigation.navigate('MediaDetailsNative', { media: item });
  };

  const handleLogout = () => {
    if(Platform.OS === "web"){
      localStorage.clear();
    }
    navigation.navigate('Login');
  }

  const handleSelectProfile = () => {
    navigation.navigate('Profile');
  };

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
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
          /></View>

        <View style={styles.mediaSection}>
          <Text style={styles.sectionTitle}>Shows</Text>
          <FlatList
            data={shows}
            keyExtractor={(item) => item.Id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderMediaItem}
            contentContainerStyle={styles.mediaList}
          /></View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    marginLeft: "1%",
  },
  mediaSection: {
    minHeight: "15%",
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
});

export default HomePageNative;
