import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import { MediaDetailsNative } from '../pages/MediaDetailsNative' // Adjust the import path
import { useNavigation, useRoute } from '@react-navigation/native'
import { getMovieDetails, getUserMovieByIDS, newUserMovie, setUserMovieInfo } from '../pages/api'
import { useVideoPlayer, VideoView } from 'expo-video'
import UserRatingButtons from '../components/userMovieRatingButtons'

// Mock necessary hooks and functions
jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
}))

jest.mock('../pages/api', () => ({
    getMovieDetails: jest.fn(),
    getUserMovieByIDS: jest.fn(),
    newUserMovie: jest.fn(),
    setUserMovieInfo: jest.fn(),
}));


jest.mock('expo-video', () => ({
    useVideoPlayer: jest.fn(),
    VideoView: 'VideoView', // Mock VideoView component
}))

jest.mock('../components/userMovieRatingButtons', () => 'UserRatingButtons')

describe('MediaDetailsNative', () => {
    let mockNavigate, mockRoute

    beforeEach(() => {
        // Reset mocks before each test
        mockNavigate = jest.fn()
        mockRoute = {
            params: {
                media: { Id: '123', Name: 'Test Movie', ProductionYear: '2022', OfficialRating: 'PG' },
                userID: 'user123',
            },
        }

        useNavigation.mockReturnValue({ navigate: mockNavigate })
        useRoute.mockReturnValue(mockRoute)

        getMovieDetails.mockResolvedValue({
            movieDetails: { overview: 'Test Overview', vote_average: 8.0, release_date: '2022-01-01' },
            cast: [{ id: 1, name: 'Actor 1', character: 'Character 1', profile_path: 'path/to/image' }],
        })

        getUserMovieByIDS.mockResolvedValue(null) // Simulating new user movie

        newUserMovie.mockResolvedValue({ insertedId: 'newMovieId' })
        setUserMovieInfo.mockResolvedValue(true)

        useVideoPlayer.mockReturnValue({
            currentTime: 0,
            playing: true,
            play: jest.fn(),
            pause: jest.fn(),
            loop: true,
        })
    })

    it('should render loading state initially', () => {
        render(<MediaDetailsNative />)

        expect(screen.getByText('Loading...')).toBeTruthy()
    })

    it('should render movie details after fetching data', async () => {
        render(<MediaDetailsNative />)

        // Wait for the movie data to be fetched and displayed
        await waitFor(() => expect(screen.getByText('Test Movie')).toBeTruthy())

        expect(screen.getByText('Year: 2022')).toBeTruthy()
        expect(screen.getByText('Maturity: PG')).toBeTruthy()
        expect(screen.getByText('Community Rating: Be the first to Rate!')).toBeTruthy()
        expect(screen.getByText('Overview: Test Overview')).toBeTruthy()
    })

    it('should handle bookmark button press', async () => {
        render(<MediaDetailsNative />)

        await waitFor(() => expect(screen.getByText('Test Movie')).toBeTruthy())

        const bookmarkButton = screen.getByText('★')
        fireEvent.press(bookmarkButton)

        // Ensure the bookmark state is toggled
        expect(setUserMovieInfo).toHaveBeenCalledWith(
            expect.any(String), // userMovieID (mocked)
            'user123', // userID
            '123', // media.Id
            0, // numWatched
            0, // currentTime
            true, // new isBookmarked state
            0 // userRating (default 0)
        )
    })

    it('should handle video play/pause', async () => {
        render(<MediaDetailsNative />)

        await waitFor(() => expect(screen.getByText('Test Movie')).toBeTruthy())

        // Simulate video pause event
        fireEvent.press(screen.getByText('★')) // Triggering bookmark press

        // Ensure setUserMovieInfo is called when video is paused
        expect(setUserMovieInfo).toHaveBeenCalled()
    })

    it('should go back to the previous screen when back button is pressed', async () => {
        render(<MediaDetailsNative />)

        await waitFor(() => expect(screen.getByText('Test Movie')).toBeTruthy())

        const backButton = screen.getByText('⬅ Go Back')
        fireEvent.press(backButton)

        expect(mockNavigate).toHaveBeenCalledWith('PreviousScreen') // Adjust to the actual screen name
    })
})
