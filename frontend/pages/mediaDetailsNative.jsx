/**
 * MediaDetailsNative Component
 * 
 * This component displays detailed information about a selected media item (movie or show).
 * It includes features such as video playback, user ratings, bookmarking, and cast information.
 * 
 * Props (via route parameters):
 * - media: The selected media object containing details like Name, Id, ProductionYear, etc.
 * - userID: The ID of the current user.
 */

import React, { useRef, useEffect, useState } from 'react';
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
import { addRatings } from '../utils/calcRatings'

const API_URL = process.env.REACT_APP_API_URL;
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

const MediaDetailsNative = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const media = route.params?.media; // Media details passed via navigation
  const userID = route.params?.userID; // User ID passed via navigation

  // References and state variables
  const videoRef = useRef(null); // Reference to the video player
  const [movieData, setMovieData] = useState(null); // Detailed movie data from TMDb
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [cast, setCast] = useState([]); // Cast information
  const [timeStamp, setTimeStamp] = useState(0); // Current playback timestamp
  const [isBookmarked, setBookmarked] = useState(false); // Bookmark status
  const [userRating, setUserRating] = useState(0); // User's rating for the media
  const [movieRating, setMovieRating] = useState(null)
  const [userMovieID, setUserMovieID] = useState(null); // ID of the user's movie record
  const [numWatched, setNumWatched] = useState(0); // Number of times the media has been watched

  /**
   * useEffect - Fetches movie details and initializes the video player when the media changes.
   */
  useEffect(() => {
    if (media?.Name) {
      fetchMovieInfo(media.Name);
    }
    player.currentTime = timeStamp; // Set the video player's current time
  }, [media, timeStamp]);

  /**
   * useEffect - Periodically logs the current playback timestamp.
   */
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (player && player.currentTime != null) {
  //       setTimeStamp(player.currentTime)
  //       handlePause();
  //     }
  //   }, 10000); // Log every 10 seconds

  //   return () => clearInterval(interval);
  // });

  /**
   * fetchMovieInfo - Fetches detailed movie information and cast data from the API.
   * 
   * @param {string} movieName - The name of the movie to fetch details for.
   */
  const fetchMovieInfo = async (movieName) => {
    const data = await getMovieDetails(movieName);
    if (data) {
      setMovieData(data.movieDetails);
      setCast(data.cast);
    }
    setLoading(false);
  };

  /**
   * handleNewUserMovieInfo - Fetches or creates user-specific movie information.
   * 
   * This function checks if the user has already interacted with the media.
   * If not, it creates a new record for the user.
   */
  const handleNewUserMovieInfo = async () => {
    const rating = await addRatings(media.Id, 'userMovieInfo')
    setMovieRating(rating)
    const userMovieInfo = await getUserMovieByIDS(userID, media.Id)
    // user has watched movie and will update timestamp, rating, bookmark
    if (userMovieInfo) {
      // User has watched the movie; update state with existing data
      setUserMovieID(userMovieInfo._id);
      setBookmarked(userMovieInfo.isBookmarked);
      setUserRating(userMovieInfo.userMovieRating);
      setTimeStamp(userMovieInfo.timeStamp);
      setNumWatched(userMovieInfo.numWatched);
    } else {
      // User has not watched the movie; create a new record
      const response = await newUserMovie(userID, media.Id, 0, 0, false, 0);
      setUserMovieID(response.insertedId);
    }
  };

  /**
   * useEffect - Initializes user-specific movie information when the component mounts.
   */
  useEffect(() => {
    handleNewUserMovieInfo();
  }, []);

  // Video source URL for streaming
  const videoSource = {
    uri: `${API_URL}/Videos/${media.Id}/stream?api_key=${ACCESS_TOKEN}&DirectPlay=true&Static=true`,
  };

  // Video player instance
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  // Event listener for playback state changes
  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  /**
   * handlePause - Saves the current playback state when the video is paused.
   */
  const handlePause = async () => {
    if (!userMovieID) return;

    const data = setUserMovieInfo(
      userMovieID,
      userID,
      media.Id,
      numWatched,
      player.currentTime,
      isBookmarked,
      userRating
    );
  };

  /**
   * useEffect - Triggers handlePause when the video playback state changes to paused.
   */
  useEffect(() => {
    if (!isPlaying) {
      handlePause();
    }
  }, [isPlaying]);

  if (!media) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>⬅ Go Back</Text>
      </TouchableOpacity>

      {/* Media Details */}
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
              setBookmarked(!isBookmarked);
              const data = setUserMovieInfo(
                userMovieID,
                userID,
                media.Id,
                numWatched,
                player.currentTime,
                !isBookmarked,
                userRating
              );
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
            <Text style={styles.bold}>Maturity:</Text> {media.OfficialRating || 'Not Rated'}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Community Rating: </Text> {movieRating || 'Be the first to Rate!'} {movieRating ? '/ 10.00' : ''}
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

      {/* Video Player */}
      <Text style={styles.subtitle}>Now Playing:</Text>
      <VideoView
        style={Platform.OS === 'web' ? styles.videoContainer : styles.videoContainerMobile}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />

      {/* User Rating Buttons */}
      <UserRatingButtons
        userID={userID}
        mediaID={media.Id}
        defaultRating={userRating}
        onSetRating={(newRating) => {
          setUserRating(newRating);
          setUserMovieInfo(
            userMovieID,
            userID,
            media.Id,
            numWatched,
            player.currentTime,
            isBookmarked,
            newRating
          );
        }}
      />

      {/* TMDb Information */}
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

      {/* Cast Information */}
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
  );
};

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
});

export default MediaDetailsNative;
