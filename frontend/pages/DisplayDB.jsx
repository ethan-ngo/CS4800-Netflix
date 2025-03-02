import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, TextInput, Button, FlatList, StyleSheet, Platform } from 'react-native'

function DisplayDB({ collectionName, fields }) {
  const [formData, setFormData] = useState({})
  const [response, setResponse] = useState(null)
  const [items, setItems] = useState([])

  // useCallback memoizes fetchItems so it only rerenders when collectionName changes
  const fetchItems = useCallback(async () => {
    try {
      console.log()
      //const res = await fetch(`https://cs4800netflix.vercel.app/${collectionName}`)
      const res = await fetch(`http://localhost:5050/${collectionName}`)
      const data = await res.json()
      console.log(`Raw response of ${collectionName}:`, data)
      setItems(data)
    } catch (error) {
      console.error(`Error fetching items in ${collectionName}:`, error)
    }
  }, [collectionName])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    try {
      //const res = await fetch(`https://cs4800netflix.vercel.app/${collectionName}`, {
      const res = await fetch(`http://localhost:5050/${collectionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      setResponse(data)
      fetchItems() // Fetch items again to update the list
    } catch (error) {
      console.error('Error:', error)
      setResponse({ error: 'Failed to submit data' })
    }
  }

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.container}>
        <h1 style={webStyles.title}>{collectionName} Database</h1>
        <div style={webStyles.form}>
          <h2 style={webStyles.subtitle}>Add {collectionName}</h2>
          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field}>
                <label>
                  {field}:
                  <input
                    type="text"
                    value={formData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    required
                    style={webStyles.input}
                  />
                </label>
              </div>
            ))}
            <button type="submit" style={webStyles.button}>
              Submit
            </button>
          </form>
          {response && (
            <div style={webStyles.response}>
              <h3>Response:</h3>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </div>
        <div style={webStyles.items}>
          <h2 style={webStyles.subtitle}>All {collectionName}</h2>
          {items.length > 0 ? (
            <ul style={webStyles.itemList}>
              {items.map((item) => (
                <li key={item._id} style={webStyles.item}>
                  {fields.map((field) => (
                    <span key={field}>{item[field]} - </span>
                  ))}
                </li>
              ))}
            </ul>
          ) : (
            <p>No items found.</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{collectionName} Database</Text>
      <View style={styles.form}>
        <Text style={styles.subtitle}>Add {collectionName}</Text>
        {fields.map((field) => (
          <TextInput
            key={field}
            style={styles.input}
            placeholder={field}
            value={formData[field] || ''}
            onChangeText={(text) => handleInputChange(field, text)}
            required
          />
        ))}
        <Button title="Submit" onPress={handleSubmit} />
        {response && (
          <View style={styles.response}>
            <Text>Response:</Text>
            <Text>{JSON.stringify(response, null, 2)}</Text>
          </View>
        )}
      </View>
      <Text style={styles.subtitle}>All {collectionName}</Text>
      {items.length > 0 ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Text>
              {fields.map((field) => (
                <span key={field}>{item[field]} - </span>
              ))}
            </Text>
          )}
          ListHeaderComponent={<View style={{ height: 20 }} />}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      ) : (
        <Text>No items found.</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  response: {
    marginTop: 20,
  },
  items: {
    marginTop: 20,
  },
})

const webStyles = {
  container: {
    padding: 20,
    maxWidth: '100%',
    margin: '0 auto',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
  response: {
    marginTop: 20,
  },
  items: {
    marginTop: 20,
  },
  itemList: {
    listStyleType: 'none',
    padding: 0,
  },
  item: {
    padding: 10,
    borderBottom: '1px solid #ccc',
  },
}

export default DisplayDB
