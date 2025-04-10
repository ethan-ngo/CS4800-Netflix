import React, { useRef, useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Platform,
  Button,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { getMovieDetails, getUserMovieByIDS, newUserMovie, setUserMovieInfo } from './api'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useEvent } from 'expo'
import UserRatingButtons from '../components/userMovieRatingButtons'

const API_URL = process.env.REACT_APP_API_URL
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN

const MediaDetailsNative = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const media = route.params?.media
  const userID = route.params?.userID

  const videoRef = useRef(null)
  const [movieData, setMovieData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cast, setCast] = useState([]) // State for the cast
  const [timeStamp, setTimeStamp] = useState(0)
  const [isBookmarked, setBookmarked] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [userMovieID, setUserMovieID] = useState(null)
  const [numWatched, setNumWatched] = useState(0)

  useEffect(() => {
    if (media?.Name) {
      fetchMovieInfo(media.Name)
    }
    console.log(media)
    player.currentTime = timeStamp
  }, [media, timeStamp])

  // for time stamp saving
  useEffect(() => {
    const interval = setInterval(() => {
      if (player && player.currentTime != null) {
        console.log('Current Timestamp:', player.currentTime)
      }
    }, 10000) // log every 10 seconds

    return () => clearInterval(interval)
  })

  const fetchMovieInfo = async (movieName) => {
    const data = await getMovieDetails(movieName)
    if (data) {
      setMovieData(data.movieDetails)
      setCast(data.cast)
    }
    setLoading(false)
  }

  const handleNewUserMovieInfo = async () => {
    const userMovieInfo = await getUserMovieByIDS(userID, media.Id)
    // user has watched movie and will update timestamp, rating, bookmark
    if (userMovieInfo) {
      setUserMovieID(userMovieInfo._id)
      setBookmarked(userMovieInfo.isBookmarked)
      setUserRating(userMovieInfo.userMovieRating)
      setTimeStamp(userMovieInfo.timeStamp)
      setNumWatched(userMovieInfo.numWatched)
    }
    // user has not watched and will create userMovieInfo
    else {
      const response = await newUserMovie(userID, media.Id, 0, 0, false, 0)
      setUserMovieID(response.insertedId)
    }
  }

  useEffect(() => {
    handleNewUserMovieInfo()
  }, [])

  const videoSource = {
    uri: `${API_URL}/Videos/${media.Id}/stream?api_key=${ACCESS_TOKEN}&DirectPlay=true&Static=true`,
  }

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true
    player.play()
  })

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  })

  const handlePause = async () => {
    const data = setUserMovieInfo(
      userMovieID,
      userID,
      media.Id,
      numWatched,
      player.currentTime,
      isBookmarked,
      userRating
    )
  }
  useEffect(() => {
    if (!isPlaying) {
      handlePause()
    }
  }, [isPlaying])

  if (!media) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>⬅ Go Back</Text>
      </TouchableOpacity>

      <View style={styles.detailsContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: `${API_URL}/Items/${media.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`,
            }}
            style={styles.poster}
            alt="Movie Poster"
          />
          <TouchableOpacity
            style={styles.starButton}
            onPress={() => {
              setBookmarked(!isBookmarked)
              const data = setUserMovieInfo(
                userMovieID,
                userID,
                media.Id,
                numWatched,
                player.currentTime,
                !isBookmarked,
                userRating
              )
            }}
          >
            <Text style={[styles.star, isBookmarked ? styles.starSelected : styles.starUnselected]}>
              ★
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>{media.Name}</Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Year:</Text> {media.ProductionYear}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Rating:</Text> {media.OfficialRating || 'Not Rated'}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Community Rating:</Text> {media.CommunityRating || 'N/A'}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Container:</Text> {media.Container || 'Unknown'}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Run Time:</Text> {Math.floor(media.RunTimeTicks / 600000000)}{' '}
            min
          </Text>
        </View>
      </View>

      <Text style={styles.subtitle}>Now Playing:</Text>

      <VideoView
        style={Platform.OS === 'web' ? styles.videoContainer : styles.videoContainerMobile}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />

      <UserRatingButtons />

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
      ) : (
        movieData && (
          <View style={styles.tmdbContainer}>
            <Text style={styles.subtitle}>More Info from TMDb:</Text>
            <Text style={styles.detail}>
              <Text style={styles.bold}>Overview:</Text> {movieData.overview}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.bold}>TMDb Rating:</Text> {movieData.vote_average}/10
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.bold}>Release Date:</Text> {movieData.release_date}
            </Text>
          </View>
        )
      )}

      {/* Display Cast */}
      {cast.length > 0 && (
        <View style={styles.castContainer}>
          <Text style={styles.subtitle}>Cast:</Text>
          <FlatList
            data={cast}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.castItem}>
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500/${item.profile_path}` }}
                  style={styles.castImage}
                  alt="Cast Image"
                />
                <Text style={styles.castName}>{item.name}</Text>
                <Text style={styles.castCharacter}>{item.character}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
          />
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  backButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginRight: 15,
  },
  starButton: {
    position: 'absolute',
    top: 5,
    right: 20,
  },
  star: {
    fontSize: 40,
  },
  starSelected: {
    color: '#FFD700',
  },
  starUnselected: {
    color: 'black',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    color: '#D3D3D3',
  },
  bold: {
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  videoPlayer: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  videoContainer: {
    width: '60%',
    height: 500,
    aspectRatio: 16 / 9,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  videoContainerMobile: {
    width: '60%',
    height: 200,
    aspectRatio: 16 / 9,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  controlsContainer: {
    padding: 10,
  },
  tmdbContainer: {
    marginTop: 20,
    width: '100%',
  },
  castContainer: {
    marginTop: 20,
    width: '100%',
  },
  castItem: {
    marginRight: 10,
    alignItems: 'center',
    width: 120,
  },
  castImage: {
    width: 120,
    height: 180,
    borderRadius: 5,
    marginBottom: 5,
  },
  castName: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    width: '100%',
  },
  castCharacter: {
    color: '#D3D3D3',
    textAlign: 'center',
  },
})

export default MediaDetailsNative
