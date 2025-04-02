import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, FlatList, Platform } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { getItems } from './api'
import { useVideoPlayer, VideoView } from 'expo-video'

const API_URL = process.env.REACT_APP_API_URL
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN

const ShowDetailsNative = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const show = route.params?.show

    const [seasons, setSeasons] = useState({})
    const [selectedSeason, setSelectedSeason] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedEpisode, setSelectedEpisode] = useState(null)

    const videoSource = selectedEpisode ? {
        uri: `${API_URL}/Videos/${selectedEpisode}/stream?api_key=${ACCESS_TOKEN}&DirectPlay=true&Static=true`,
    } : null;

    const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
        player.play();
    });

    useEffect(() => {
        if (show?.Name) {
            fetchEpisodes(show.Name)
        }
    }, [show])

    const fetchEpisodes = async (showName) => {
        const allItems = await getItems()

        // Filter items related to the given show name
        const filteredItems = allItems.filter(item => item.SeriesName === showName)

        // Group episodes by season
        const seasonMap = {}
        filteredItems.forEach(item => {
            if (item.Type === "Episode" && item.ParentIndexNumber) {
                if (!seasonMap[item.ParentIndexNumber]) {
                    seasonMap[item.ParentIndexNumber] = {
                        seasonName: `Season ${item.ParentIndexNumber}`,
                        episodes: []
                    }
                }
                seasonMap[item.ParentIndexNumber].episodes.push(item)
            }
        })

        Object.values(seasonMap).forEach(season => {
            season.episodes.sort((a, b) => a.IndexNumber - b.IndexNumber)
        })

        setSeasons(seasonMap)
        setSelectedSeason(Object.keys(seasonMap)[0]) // Set the first season as default
        setLoading(false)
    }

    const handleEpisodeSelect = (episodeId) => {
        setSelectedEpisode(episodeId)
    }

    if (!show) return (
        <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
    )

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>⬅ Go Back</Text>
            </TouchableOpacity>

            <View style={styles.detailsContainer}>
                <Image
                    source={{ uri: `${API_URL}/Items/${show.Id}/Images/Primary?api_key=${ACCESS_TOKEN}` }}
                    style={styles.poster}
                />

                <View style={styles.info}>
                    <Text style={styles.title}>{show.Name}</Text>
                    <Text style={styles.detail}><Text style={styles.bold}>Year:</Text> {show.ProductionYear}</Text>
                    <Text style={styles.detail}><Text style={styles.bold}>Rating:</Text> {show.OfficialRating || 'Not Rated'}</Text>
                    <Text style={styles.detail}><Text style={styles.bold}>Community Rating:</Text> {show.CommunityRating || 'N/A'}</Text>
                    <Text style={styles.detail}><Text style={styles.bold}>Run Time:</Text> {Math.floor(show.RunTimeTicks / 600000000)} min</Text>
                </View>
            </View>

            <Text style={styles.subtitle}>Seasons:</Text>

            {/* Buttons for each season */}
            <View style={styles.seasonButtonContainer}>
                {Object.keys(seasons).map((seasonNumber) => (
                    <TouchableOpacity
                        key={seasonNumber}
                        style={[
                            styles.seasonButton,
                            selectedSeason === seasonNumber && styles.selectedSeasonButton
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
                                    selectedEpisode === item.Id && styles.selectedEpisodeItem
                                ]}
                                onPress={() => handleEpisodeSelect(item.Id)}
                            >
                                <Image
                                    source={{ uri: `${API_URL}/Items/${item.Id}/Images/Primary?api_key=${ACCESS_TOKEN}` }}
                                    style={styles.episodeImage}
                                />
                                <Text style={styles.episodeName}>{item.IndexNumber}. {item.Name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            <Text style={styles.subtitle}>Now Playing:</Text>

            <View style={Platform.OS === "web" ? styles.videoContainer : styles.videoContainerMobile}>
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
        width: "100%",
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
        aspectRatio: 16/9, 
        backgroundColor: 'black',
        marginVertical: 10,
    },
    videoContainerMobile: {
        width: '100%',
        height: 200,
        aspectRatio: 16/9, 
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
});

export default ShowDetailsNative;