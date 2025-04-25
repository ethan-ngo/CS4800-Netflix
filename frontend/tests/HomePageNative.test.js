import React from 'react'
import { render, waitFor } from '@testing-library/react-native'
import HomePageNative from '../pages/HomePageNative'
import * as api from '../api'

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useFocusEffect: jest.fn().mockImplementation((cb) => cb()),
}))

jest.mock('../components/HomeNavbar', () => () => <></>)
jest.mock('../components/LoadingOverlay', () => () => <></>)
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }) => children,
}))

jest.mock('../utils/recommendations', () => ({
  generateRecommendations: jest.fn(() => ({
    movies: [],
    shows: [],
  })),
}))

describe('HomePageNative', () => {
  const mockItems = [
    { Id: '1', Name: 'Movie 1', ImageTags: { Primary: 'img1' } },
    { Id: '2', Name: 'Show 1', ImageTags: { Primary: 'img2' } },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(api, 'getItems').mockResolvedValue(mockItems)
    jest.spyOn(api, 'getMovies').mockResolvedValue(mockItems)
    jest.spyOn(api, 'getShows').mockResolvedValue(mockItems)
    jest.spyOn(api, 'getMoviesByGenre').mockResolvedValue({
      Action: mockItems,
      Drama: [],
    })
    jest.spyOn(api, 'getUserMovieInfoByUserID').mockResolvedValue([
      { isBookmarked: true, movieID: '1' },
    ])
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ isBookmarked: true, showID: '2' }]),
    })
  })

  it('renders recommended and genre sections', async () => {
    const route = { params: { userID: 'test-user', mode: 'all' } }
    const { getByText } = render(<HomePageNative route={route} />)

    await waitFor(() => {
      expect(getByText('Recommended Movies')).toBeTruthy()
      expect(getByText('Recommended Shows')).toBeTruthy()
      expect(getByText('Action')).toBeTruthy()
    })
  })

  it('renders bookmarked section when mode is bookmarked', async () => {
    const route = { params: { userID: 'test-user', mode: 'bookmarked' } }
    const { getByText } = render(<HomePageNative route={route} />)

    await waitFor(() => {
      expect(getByText('Bookmarked Movies')).toBeTruthy()
      expect(getByText('Bookmarked Shows')).toBeTruthy()
    })
  })

  it('handles empty genre section', async () => {
    jest.spyOn(api, 'getMoviesByGenre').mockResolvedValue({})
    const route = { params: { userID: 'test-user', mode: 'all' } }
    const { getByText } = render(<HomePageNative route={route} />)

    await waitFor(() => {
      expect(getByText('No genres available')).toBeTruthy()
    })
  })
})
