import React from 'react';
import { useState, useEffect } from 'react';

function DisplayDB() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState(null);
  const [users, setUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://cs4800netflix.vercel.app/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username, email: email, password: password}),
      });
      const data = await res.json();
      setResponse(data);
      fetchUsers(); // Fetch users again to update the list
    } catch (error) {
      console.error("Error:", error);
      setResponse({ error: "Failed to submit user data" });
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://cs4800netflix.vercel.app/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <h1>User Database</h1>
      <div>
        <h2>Add User</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
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
              />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
        {response && (
          <div>
            <h3>Response:</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
      <div>
        <h2>All Users</h2>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                {user.name} - {user.email} - {user.password}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </>
  );
}

export default DisplayDB;
