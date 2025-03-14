import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { getItems, getMovies, getShows } from './api'
import { useNavigate } from 'react-router-dom'
import '../globals.css'

const API_URL = process.env.REACT_APP_API_URL
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN

const HomePage = () => {
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [shows, setShows] = useState([])
  const [movies, setMovies] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const fetchItems = async () => {
      const mediaItems = await getItems()
      const showItems = await getShows()
      const moviesItems = await getMovies()
      setItems(mediaItems)
      setShows(showItems)
      setMovies(moviesItems)
    }

    fetchItems()
  }, [])

  const printItem = (item) => {
    console.log(item)
    console.log('Selected Item:', item)
    console.log('ID:', item.Id)
    console.log('Name:', item.Name)
    console.log('Type:', item.Type)
    console.log('Media Stream URL:', `${API_URL}/Videos/${item.Id}/stream?api_key=${ACCESS_TOKEN}`)
    console.log(
      'Thumbnail URL:',
      `${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`
    )
  }

  const handleSelectItem = (item) => {
    navigate(`/media/${item.Id}`, { state: { media: item } })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
    console.log('logged out')
  }

  if (Platform.OS === 'web') {
    return (
      <>
        {/* Navbar with Logout Button */}
        <div style={webStyles.navBar}>
          <h1 style={webStyles.Logo}>DomainFilms</h1>
          <button style={webStyles.Button} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div style={styles.container}>
          <h2>All Items</h2>
          <div className="media-list" style={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>
            {items.map((item) => (
              <div
                key={item.Id}
                className="media-item"
                onClick={() => {
                  setSelectedItem(item)
                  printItem(item)
                }}
                style={{ display: 'inline-block', marginRight: '10px', cursor: 'pointer' }}
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
          <div className="media-list" style={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>
            {movies.map((item) => (
              <div
                key={item.Id}
                className="media-item"
                onClick={() => handleSelectItem(item)}
                style={{ display: 'inline-block', marginRight: '10px', cursor: 'pointer' }}
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
          <div className="media-list" style={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>
            {shows.map((item) => (
              <div
                key={item.Id}
                className="media-item"
                onClick={() => handleSelectItem(item)}
                style={{ display: 'inline-block', marginRight: '10px', cursor: 'pointer' }}
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
              <h2 style={{ color: 'white', fontSize: '16px' }}>Now Playing: {selectedItem.Name}</h2>
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
      </>
    )
  }

  // Fallback for non-web platforms (e.g., mobile)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
    </View>
  )
}

// Styles
const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#121212',
    padding: '20px',
    minHeight: '100vh',
  },
  mediaList: {
    display: 'flex',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    padding: '10px',
    gap: '10px',
  },
  mediaItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ccc',
    textAlign: 'center',
    maxWidth: '150px',
    height: '300px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  videoPlayer: {
    position: 'fixed',
    top: '10px',
    right: '10px',
    width: '300px',
    background: 'rgba(0, 0, 0, 0.8)',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
  },
})

const webStyles = {
  navBar: {
    top: 0,
    left: 0,
    padding: '5px',
    width: '100%',
    backgroundColor: 'var(--background-color)',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    alignItems: 'center',
    position: 'fixed',
  },
  Logo: {
    justifyContent: 'left',
    color: 'var(--primary-color)',
    marginLeft: '20px',
  },
  Button: {
    width: '10%',
    height: '20%',
    color: 'var(--text-color)',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    backgroundColor: 'var(--primary-color)',
    cursor: 'pointer',
    marginRight: '20px',
  },
}

export default HomePage
