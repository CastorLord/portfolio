"use client";
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  // Add other properties as needed
}

const Home: React.FC = () => {
  const [users, setUsers] = useState<{ id: number; name: string; email: string }[]>([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  const addUser = async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });
    const data = await response.json();
    setUsers([...users, data]);
    setName('');
    setEmail('');
  };

  const deleteUser = async (userId: number) => {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>User Management</h1>
      <form>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Email:
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={addUser}>
          Add User
        </button>
      </form>
      <ul>
        {/* {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button type="button" onClick={() => deleteUser(user.id)}>
              Delete
            </button>
          </li>
        ))} */}
      </ul>
    </div>
  );
};

export default Home;
