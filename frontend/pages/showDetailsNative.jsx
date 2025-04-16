/**
 * ShowDetailsNative Component
 * 
 * This component displays detailed information about a selected TV show, including its seasons,
 * episodes, cast, and additional metadata. It also allows users to play episodes, rate the show,
 * and bookmark it for later viewing.
 * 
 * Props (via route parameters):
 * - show: The selected show object containing details like Name, Id, ProductionYear, etc.
 * - userID: The ID of the current user.
 */

import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import UserRatingButtons from '../components/userMovieRatingButtons';
import { getItems, getShowDetails, getUserShowByIDS, newUserShow, setUserShowInfo } from './api';

const API_URL = process.env.REACT_APP_API_URL;
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

const ShowDetailsNative = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const show = route.params?.show; // Show details passed via navigation

  // State variables
  const [seasons, setSeasons] = useState({}); // Map of seasons and their episodes
  const [selectedSeason, setSelectedSeason] = useState(null); // Currently selected season
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [selectedEpisode, setSelectedEpisode] = useState(null); // Currently selected episode
  const [cast, setCast] = useState([]); // Cast information
  const [showDetails, setShowDetails] = useState(null); // Additional show details from TMDb

  // User-specific state variables
  const [userShowID, setUserShowID] = useState(null); // ID of the user's show record
  const [userRating, setUserRating] = useState(null); // User's rating for the show
  const [numWatched, setNumWatched] = useState(0); // Number of times the show has been watched
  const [timeStamp, setTimeStamp] = useState(0); // Current playback timestamp
  const [isBookmarked, setIsBookmarked] = useState(false); // Bookmark status

  // Video source for the selected episode
  const videoSource = selectedEpisode
    ? {
        uri: `${API_URL}/Videos/${selectedEpisode}/stream?api_key=${ACCESS_TOKEN}&DirectPlay=true&Static=true`,
      }
    : null;

  // Video player instance
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  /**
   * useEffect - Fetches episodes and show details when the component mounts or the show changes.
   */
  useEffect(() => {
    if (show?.Name) {
      fetchEpisodes(show.Name);
      fetchShowDetails(show.Name);
    }
    handleNewUserShowInfo();
  }, [show]);

  /**
   * useEffect - Logs the current playback timestamp periodically.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (player && player.currentTime != null) {
        console.log(`Current Timestamp for ${selectedEpisode}:`, player.currentTime);
      }
    }, 10000); // Log every 10 seconds
    return () => clearInterval(interval);
  });

  /**
   * fetchEpisodes - Fetches all episodes of the show and organizes them by season.
   * 
   * @param {string} showName - The name of the show to fetch episodes for.
   */
  const fetchEpisodes = async (showName) => {
    const allItems = await getItems();
    const filteredItems = allItems.filter((item) => item.SeriesName === showName);

    const seasonMap = {};
    filteredItems.forEach((item) => {
      if (item.Type === 'Episode' && item.ParentIndexNumber) {
        if (!seasonMap[item.ParentIndexNumber]) {
          seasonMap[item.ParentIndexNumber] = {
            seasonName: `Season ${item.ParentIndexNumber}`,
            episodes: [],
          };
        }
        seasonMap[item.ParentIndexNumber].episodes.push(item);
      }
    });

    Object.values(seasonMap).forEach((season) => {
      season.episodes.sort((a, b) => a.IndexNumber - b.IndexNumber);
    });

    setSeasons(seasonMap);
    setSelectedSeason(Object.keys(seasonMap)[0]);
    setLoading(false);
  };

  /**
   * fetchShowDetails - Fetches additional details and cast information for the show.
   * 
   * @param {string} showName - The name of the show to fetch details for.
   */
  const fetchShowDetails = async (showName) => {
    try {
      const data = await getShowDetails(showName);
      if (data) {
        setShowDetails(data.showDetails);
        setCast(data.cast);
      }
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  /**
   * handleEpisodeSelect - Sets the selected episode for playback.
   * 
   * @param {string} episodeId - The ID of the selected episode.
   */
  const handleEpisodeSelect = (episodeId) => {
    setSelectedEpisode(episodeId);
  };

  /**
   * handleNewUserShowInfo - Fetches or creates user-specific show information.
   * 
   * This function checks if the user has already interacted with the show.
   * If not, it creates a new record for the user.
   */
  const handleNewUserShowInfo = async () => {
    const userID = route.params?.userID;
    const showID = show?.Id;
    if (!userID || !showID) return;

    const userShowInfo = await getUserShowByIDS(userID, showID);
    if (userShowInfo) {
      setUserShowID(userShowInfo._id);
      setUserRating(userShowInfo.userShowRating);
      setTimeStamp(userShowInfo.timeStamp);
      setIsBookmarked(userShowInfo.isBookmarked);
      setNumWatched(userShowInfo.numWatched);
    } else {
      const response = await newUserShow(userID, showID, 0, 0, false, 0);
      if (response?.insertedId) {
        setUserShowID(response.insertedId);
      }
    }
  };

  if (!show)
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>⬅ Go Back</Text>
      </TouchableOpacity>

      {/* Show Details */}
      <View style={styles.detailsContainer}>
        <Image
          source={{ uri: `${API_URL}/Items/${show.Id}/Images/Primary?api_key=${ACCESS_TOKEN}` }}
          style={styles.poster}
          alt="Show Thumbnail"
        />

        <View style={styles.info}>
          <Text style={styles.title}>{show.Name}</Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Year:</Text> {show.ProductionYear}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Rating:</Text> {show.OfficialRating || 'Not Rated'}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Community Rating:</Text> {show.CommunityRating || 'N/A'}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Run Time:</Text> {Math.floor(show.RunTimeTicks / 600000000)}{' '}
            min
          </Text>
        </View>
      </View>

      {/* Seasons and Episodes */}
      <Text style={styles.subtitle}>Seasons:</Text>
      <View style={styles.seasonButtonContainer}>
        {Object.keys(seasons).map((seasonNumber) => (
          <TouchableOpacity
            key={seasonNumber}
            style={[
              styles.seasonButton,
              selectedSeason === seasonNumber && styles.selectedSeasonButton,
            ]}
            onPress={() => setSelectedSeason(seasonNumber)}
          >
            <Text style={styles.seasonButtonText}>{seasons[seasonNumber].seasonName}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedSeason && (
        <View style={styles.episodesContainer}>
          <Text style={styles.subtitle}>{seasons[selectedSeason].seasonName} - Episodes:</Text>
          <FlatList
            data={seasons[selectedSeason].episodes}
            keyExtractor={(item) => item.Id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.episodeItem,
                  selectedEpisode === item.Id && styles.selectedEpisodeItem,
                ]}
                onPress={() => handleEpisodeSelect(item.Id)}
              >
                <Image
                  source={{
                    uri: `${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`,
                  }}
                  style={styles.episodeImage}
                  alt="Episode Thumbnail"
                />
                <Text style={styles.episodeName}>
                  {item.IndexNumber}. {item.Name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Video Player */}
      <Text style={styles.subtitle}>Now Playing:</Text>
      <View style={Platform.OS === 'web' ? styles.videoContainer : styles.videoContainerMobile}>
        {selectedEpisode ? (
          <VideoView
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            style={styles.videoPlayer}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Select an episode to play</Text>
          </View>
        )}
      </View>

      {/* User Rating Buttons */}
      <UserRatingButtons
        defaultRating={userRating}
        onSetRating={(newRating) => {
          setUserRating(newRating);
          const userID = route.params?.userID;
          const showID = show?.Id;
          if (userShowID && userID && showID) {
            setUserShowInfo(
              userShowID,
              userID,
              showID,
              numWatched,
              player.currentTime,
              isBookmarked,
              newRating
            );
          }
        }}
      />

      {/* Additional Show Details */}
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
      ) : showDetails ? (
        <View style={styles.tmdbContainer}>
          <Text style={styles.subtitle}>More Info from TMDb:</Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Overview:</Text> {showDetails.overview}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>TMDb Rating:</Text> {showDetails.vote_average}/10
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Release Date:</Text> {showDetails.release_date}
          </Text>
        </View>
      ) : (
        <Text style={styles.subtitle}>No Additional Info</Text>
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
                  source={{
                    uri: item.profile_path
                      ? `https://image.tmdb.org/t/p/w500/${item.profile_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image',
                  }}
                  style={styles.castImage}
                  alt="Cast Thumbnail"
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
  poster: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginRight: 15,
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
    alignSelf: 'flex-start',
  },
  seasonButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 15,
    width: '100%',
  },
  seasonButton: {
    padding: 10,
    backgroundColor: '#333',
    margin: 5,
    borderRadius: 5,
  },
  selectedSeasonButton: {
    backgroundColor: '#FF4500',
  },
  seasonButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  episodesContainer: {
    width: '100%',
    marginBottom: 20,
  },
  episodeItem: {
    width: 250,
    margin: 10,
    alignItems: 'center',
  },
  selectedEpisodeItem: {
    borderColor: '#FF4500',
  },
  episodeImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 5,
  },
  episodeName: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  videoContainer: {
    width: '60%',
    height: 500,
    aspectRatio: 16 / 9,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  videoContainerMobile: {
    width: '100%',
    height: 200,
    aspectRatio: 16 / 9,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
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

export default ShowDetailsNative;
