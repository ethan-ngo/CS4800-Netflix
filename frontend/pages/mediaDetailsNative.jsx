import React, { useRef } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import {useVideoPlayer, VideoView} from 'expo-video'

const API_URL = process.env.REACT_APP_API_URL
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN

const MediaDetailsNative = ({navigation, route}) => {
    const media = route.params.media

    const videoRef = useRef(null)
    const videoSource = {
        uri: `${API_URL}/Videos/${media.Id}/stream?api_key=${ACCESS_TOKEN}`,
    };
    const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
        player.play();
      });
      
    if (!media) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>⬅ Go Back</Text>
            </TouchableOpacity>
            <View style={styles.detailsContainer}>
                <Image
                    source={{
                        uri: `${API_URL}/Items/${media.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`,
                    }}
                    style={styles.poster}
                />

                <View style={styles.info}>
                    <Text style={styles.title}>{media.Name}</Text>
                    <Text style={styles.detail}><Text style={styles.bold}>Year:</Text> {media.ProductionYear}</Text>
                    <Text style={styles.detail}><Text style={styles.bold}>Rating:</Text> {media.OfficialRating || 'Not Rated'}</Text>
                    <Text style={styles.detail}><Text style={styles.bold}>Community Rating:</Text> {media.CommunityRating || 'N/A'}</Text>
                    <Text style={styles.detail}><Text style={styles.bold}>Container:</Text> {media.Container || 'Unknown'}</Text>
                    <Text style={styles.detail}><Text style={styles.bold}>Run Time:</Text> {Math.floor(media.RunTimeTicks / 600000000)} min</Text>
                </View>
            </View>
            <Text style={styles.subtitle}>Now Playing:</Text>

            <View style={{ width: "70%", height: "50%", alignItems: 'center' }}>
                <VideoView style={styles.videoPlayer} player={player} allowsFullscreen allowsPictureInPicture />
            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    videoPlayer: {
        width: "70%",
        height: 250,
        borderRadius: 10,
    },

    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    controlButton: {
        backgroundColor: '#008CBA',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    controlButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
})

export default MediaDetailsNative
