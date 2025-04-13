import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import theme from '../utils/theme'
import '../globals.css'

const UserRatingButtons = ({ defaultRating, onSetRating }) => {
  const [selectedButton, setSelectedButton] = useState(defaultRating)

  useEffect(() => {
    setSelectedButton(defaultRating)
  }, [defaultRating])

  const handleButtonPress = (button) => {
    setSelectedButton(button)
    console.log(`Button pressed: ${button}`)
    if (onSetRating) {
      onSetRating(button)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, selectedButton === 'dislike' && styles.selectedRatingButton]}
        onPress={() => handleButtonPress('dislike')}
      >
        <Text style={styles.buttonText}>Not for me</Text>
        <Icon name="thumbs-down" size={18} color="#fff" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, selectedButton === 'like' && styles.selectedRatingButton]}
        onPress={() => handleButtonPress('like')}
      >
        <Text style={styles.buttonText}>Like it</Text>
        <Icon name="thumbs-up" size={18} color="#fff" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, selectedButton === 'love' && styles.selectedRatingButton]}
        onPress={() => handleButtonPress('love')}
      >
        <Text style={styles.buttonText}>Love this!</Text>
        <Icon name="heart" size={18} color="#fff" style={styles.icon} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'var(--background-color)',
    width: '30%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexShrink: 1,
    width: '30%',
  },
  selectedRatingButton: {
    backgroundColor: 'var(--primary-color)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 6,
  },
  icon: {
    marginLeft: 2,
  },
})

export default UserRatingButtons
