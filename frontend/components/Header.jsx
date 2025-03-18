import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>DomainFilms</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    padding: 10,
    backgroundColor: '#8A2BE2',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
	padding: 5,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Header;