import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getItems, getMovies, getShows } from "./api";

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
    const fetchItems = async () => {
      const mediaItems = await getItems();
      const showItems = await getShows();
      const moviesItems = await getMovies();
      setItems(mediaItems);
      setShows(showItems);
      setMovies(moviesItems);
    };

    fetchItems();
  }, []);

  const handleSelectItem = (item) => {
    navigate(`/media/${item.Id}`, { state: { media: item } });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>DomainFilms</h1>
      <h2>All Items</h2>
      <div style={styles.mediaList}>
        {items.map((item) => (
          <div
            key={item.Id}
            style={styles.mediaItem}
            onClick={() => setSelectedItem(item)}
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
      <div style={styles.mediaList}>
        {movies.map((item) => (
          <div
            key={item.Id}
            style={styles.mediaItem}
            onClick={() => handleSelectItem(item)}
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
      <div style={styles.mediaList}>
        {shows.map((item) => (
          <div
            key={item.Id}
            style={styles.mediaItem}
            onClick={() => handleSelectItem(item)}
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

      {selectedItem && (
        <div style={styles.videoPlayer}>
          <h2 style={{ color: "white", fontSize: "16px" }}>Now Playing: {selectedItem.Name}</h2>
          <video
            controls
            src={`${API_URL}/Videos/${selectedItem.Id}/stream?api_key=${ACCESS_TOKEN}`}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
            style={styles.video}
          >
            Your browser does not support the video tag.
          </video>
          <button style={styles.closeButton} onClick={() => setSelectedItem(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  title: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#800080",
    textShadow: "2px 2px 5px white",
    backgroundColor: "black",
    padding: "10px 20px",
    borderRadius: "10px",
    display: "inline-block",
    display: "block",
  },
  container: {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#121212",
    padding: "20px",
    minHeight: "100vh",
    color: "white",
  },
  mediaList: {
    display: "flex",
    flexwrap: "nowrap",
    overflowX: "auto",
    whiteSpace: "nowrap",
    padding: "10px",
    gap: "10px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  mediaItem: {
    display: "flex",
    display: "inline-block",
    minWidth: "150px",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
    maxWidth: "150px",
    height: "300px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    cursor: "pointer",
    border: "none",
  },
  videoPlayer: {
    position: "fixed",
    top: "10px",
    right: "10px",
    width: "300px",
    background: "rgba(0, 0, 0, 0.8)",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
  },
  video: {
    width: "100%",
    height: "auto",
  },
  closeButton: {
    marginTop: "10px",
    padding: "5px 10px",
    backgroundColor: "#FF4500",
    border: "none",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default HomePage;