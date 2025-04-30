// __tests__/SearchResultsPage.test.js
import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import SearchResultsPage from '../../pages/SearchResultsPage'

// stub out navigation
const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}))

// stub out HomeNavbar and LinearGradient
jest.mock('../../components/HomeNavbar', () => () => null)
jest.mock('expo-linear-gradient', () => {
  const React = require('react')
  const { View } = require('react-native')
  return { LinearGradient: ({ children }) => <View>{children}</View> }
})

describe('SearchResultsPage', () => {
  const baseRoute = {
    params: {
      searchTerm: 'MyTerm',
      filteredMovies: [],
      filteredShows: [],
      userID: 'user1',
    },
  }

  it('renders the title and no sections when there are no movies or shows', () => {
    const { queryByText, getByText } = render(
      <SearchResultsPage route={baseRoute} />
    )

    // title always shown
    expect(getByText('Search Results for "MyTerm"')).toBeTruthy()
    // no Movies or Shows sections
    expect(queryByText('Movies')).toBeNull()
    expect(queryByText('Shows')).toBeNull()
  })

  it('renders a Movies section when filteredMovies is non-empty', () => {
    const movies = [
      { Id: 'm1', Name: 'Movie One', ImageTags: { Primary: 'imgtag1' } },
      { Id: 'm2', Name: 'Movie Two', ImageTags: { Primary: 'imgtag2' } },
    ]
    const route = {
      params: { ...baseRoute.params, filteredMovies: movies },
    }

    const { getByText, queryByText } = render(
      <SearchResultsPage route={route} />
    )

    // section header
    expect(getByText('Movies')).toBeTruthy()
    // each movie name appears
    expect(getByText('Movie One')).toBeTruthy()
    expect(getByText('Movie Two')).toBeTruthy()
    // Shows section still absent
    expect(queryByText('Shows')).toBeNull()
  })

  it('renders a Shows section when filteredShows is non-empty', () => {
    const shows = [
      { Id: 's1', Name: 'Show One', ImageTags: { Primary: 'imgtagA' } },
    ]
    const route = {
      params: { ...baseRoute.params, filteredShows: shows },
    }

    const { getByText, queryByText } = render(
      <SearchResultsPage route={route} />
    )

    expect(getByText('Shows')).toBeTruthy()
    expect(getByText('Show One')).toBeTruthy()
    expect(queryByText('Movies')).toBeNull()
  })

  it('navigates to MediaDetailsNative when an item is pressed', () => {
    const movies = [
      { Id: 'm1', Name: 'Nav Movie', ImageTags: { Primary: 'imgtagX' } },
    ]
    const route = {
      params: { ...baseRoute.params, filteredMovies: movies },
    }

    const { getByText } = render(
      <SearchResultsPage route={route} />
    )

    fireEvent.press(getByText('Nav Movie'))
    expect(mockNavigate).toHaveBeenCalledWith('MediaDetailsNative', {
      media: movies[0],
    })
  })

  it('skips items without an ImageTags.Primary', () => {
    const mixed = [
      { Id: 'a1', Name: 'HasNoImage', ImageTags: {} },
      { Id: 'b1', Name: 'HasImage', ImageTags: { Primary: 'yes' } },
    ]
    const route = {
      params: { ...baseRoute.params, filteredMovies: mixed },
    }

    const { queryByText, getByText } = render(
      <SearchResultsPage route={route} />
    )

    expect(queryByText('HasNoImage')).toBeNull()
    expect(getByText('HasImage')).toBeTruthy()
  })
})
