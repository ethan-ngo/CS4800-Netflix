import React, { useState, useEffect } from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchBarOpen, setSearchBarOpen] = useState(false)

  const onClickSearch = () => {
    setSearchBarOpen(!searchBarOpen)
    console.log('Search bar clicked')
  }

  //   useEffect(() => {
  //     const delayDebounceFn = setTimeout(() => {
  //       handleSearch()
  //     }, 300)

  //     return () => clearTimeout(delayDebounceFn)
  //   }, [searchTerm])

  return (
    <TouchableOpacity style={styles.searchButton}>
      <Icon name="search" size={24} color="white" style={styles.icon} onPress={onClickSearch} />

      {searchBarOpen && (
        <TextInput
          style={styles.searchBarInput}
          placeholder="Search"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  searchButton: {
    padding: 10,
    margin: 10,
    cursor: 'pointer',
    color: 'var(--text-color)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarInput: {
    position: 'absolute',
    height: 40,
    width: 300,
    right: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
})

export default Searchbar
