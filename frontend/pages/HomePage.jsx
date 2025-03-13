import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native'
import { getItems, getMovies, getShows } from "./api";
import { useNavigate, Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

const HomePage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    console.log(API_URL);
    console.log(ACCESS_TOKEN);
    const fetchItems = async () => {
      const mediaItems = await getItems();
      const showItems = await getShows();
      const moviesItems = await getMovies();
      setItems(mediaItems);
      setShows(showItems);
      setMovies(moviesItems);
      console.log(mediaItems);
      console.log(moviesItems);
      console.log(showItems);
    };

    fetchItems();
  }, []);

  const printItem = (item) => {
    console.log(item);
    console.log("Selected Item:", item);
    console.log("ID:", item.Id);
    console.log("Name:", item.Name);
    console.log("Type:", item.Type);
    console.log("Media Stream URL:", `${API_URL}/Videos/${item.Id}/stream?api_key=${ACCESS_TOKEN}`);
    console.log("Thumbnail URL:", `${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`);
  };

  const handleSelectItem = (item) => {
    navigate(`/media/${item.Id}`, { state: { media: item } });
  };
  
  if (Platform.OS === 'web') {
    return(
      <div style={webStyles.navBar}>
        <h1 style={webStyles.Logo}>
          DomainFilms
        </h1>
      </div>
    <div>
      <h1>Media Library</h1>

      <h2>All Items</h2>
      <div className="media-list" style={{ overflowX: "scroll", whiteSpace: "nowrap" }}>
        {items.map((item) => (
          <div
            key={item.Id}
            className="media-item"
            onClick={() => { setSelectedItem(item); printItem(item); }}
            style={{ display: "inline-block", marginRight: "10px" }}
          >
            <img
              src={`${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`}
              alt={item.Name}
              width={150}
            />
            <h5>{item.Name}</h5>
          </div>
        ))}
      </div>

      <h2>Movies</h2>
      <div className="media-list" style={{ overflowX: "scroll", whiteSpace: "nowrap" }}>
        {movies.map((item) => (
          <div
            className="media-item"
            key={item.Id}
            onClick={() => handleSelectItem(item)}
            style={{ display: "inline-block", marginRight: "10px", cursor: "pointer" }}
          >
            <img
              src={`${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`}
              alt={item.Name}
              width={150}
            />
            <h5>{item.Name}</h5>
          </div>
        ))}
      </div>

      <h2>Shows</h2>
      <div className="media-list" style={{ overflowX: "scroll", whiteSpace: "nowrap" }}>
        {shows.map((item) => (
          <div
            className="media-item"
            key={item.Id}
            onClick={() => handleSelectItem(item)}
            style={{ display: "inline-block", marginRight: "10px", cursor: "pointer" }}
          >
            <img
              src={`${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`}
              alt={item.Name}
              width={150}
            />
            <h5>{item.Name}</h5>
          </div>
        ))}
      </div>

      {/* Video Player Section */}
      {selectedItem && (
        <div className="video-player">
          <h2 style={{ color: "white", fontSize: "16px" }}>Now Playing: {selectedItem.Name}</h2>
          <video
            controls
            src={`${API_URL}/Videos/${selectedItem.Id}/stream?api_key=${ACCESS_TOKEN}`}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
          >
            Your browser does not support the video tag.
          </video>
          <button onClick={() => setSelectedItem(null)}>Close</button>
        </div>
      )}
    </div>
  );
return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
    </View>
  )
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 48,
    color: 'black',
  },
})
const webStyles={
  navBar:{
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%', 
  backgroundColor: 'black', 
  display: 'flex',
  justifyContent: 'space-between', 
  gap: '20px', 
  //boxshadow:w 0 4px 6px rgba(0, 0, 0, 0.1),
  //z-index: 1000, /* Ensures it stays above other content */
  },
  Logo:{
    justifyContent: 'left',
    color: 'purple',
  },
}
};

export default HomePage;

