import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Button, FlatList, StyleSheet, Platform } from 'react-native'

function DisplayUserMovieInfo() {
  const [movieID, setMovieID] = useState('')
  const [numWatched, setNumWatched] = useState('')
  const [timeStamp, setTimeStamp] = useState('')
  const [userMovieRating, setUserMovieRating] = useState('')
  const [userID, setUserID] = useState('')
  const [response, setResponse] = useState(null)
  const [userMovieInfo, setUserMovieInfo] = useState([])

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    try {
      const res = await fetch('https://cs4800netflix.vercel.app/user-movie-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, email, password }),
      })
      const data = await res.json()
      setResponse(data)
      fetchUsers() // Fetch user-movie-info again to update the list
    } catch (error) {
      console.error('Error:', error)
      setResponse({ error: 'Failed to submit user data' })
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://cs4800netflix.vercel.app/users')
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (Platform.OS === 'web') {
    return (
      <div style={webStyles.container}>
        <h1 style={webStyles.title}>User Database</h1>
        <div style={webStyles.form}>
          <h2 style={webStyles.subtitle}>Add User</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Username:
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={webStyles.input}
                />
              </label>
            </div>
            <div>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={webStyles.input}
                />
              </label>
            </div>
            <div>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={webStyles.input}
                />
              </label>
            </div>
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
        <div style={webStyles.users}>
          <h2 style={webStyles.subtitle}>All Users</h2>
          {users.length > 0 ? (
            <ul style={webStyles.userList}>
              {users.map((user) => (
                <li key={user._id} style={webStyles.userItem}>
                  {user.name} - {user.email} - {user.password}
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Database</Text>
      <View style={styles.form}>
        <Text style={styles.subtitle}>Add User</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          required
        />
        <Button title="Submit" onPress={handleSubmit} />
        {response && (
          <View style={styles.response}>
            <Text>Response:</Text>
            <Text>{JSON.stringify(response, null, 2)}</Text>
          </View>
        )}
      </View>
      <Text style={styles.subtitle}>All Users</Text>
      {users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Text>
              {item.name} - {item.email} - {item.password}
            </Text>
          )}
          ListHeaderComponent={<View style={{ height: 20 }} />}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      ) : (
        <Text>No users found.</Text>
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
  users: {
    marginTop: 20,
  },
})

const webStyles = {
  container: {
    padding: 20,
    maxWidth: 800,
    margin: '0 auto',
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
  users: {
    marginTop: 20,
  },
  userList: {
    listStyleType: 'none',
    padding: 0,
  },
  userItem: {
    padding: 10,
    borderBottom: '1px solid #ccc',
  },
}

export default DisplayUserMovieInfo
