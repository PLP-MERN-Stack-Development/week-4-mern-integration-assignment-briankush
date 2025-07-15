import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService, userService } from '../../services/api';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsData, usersData] = await Promise.all([
          postService.getAllPosts(),
          userService.getAllUsers()
        ]);
        setPosts(postsData.data);
        setUsers(usersData.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      await postService.deletePost(id);
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      setError('Failed to delete post');
    }
  };
  
  if (loading) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading dashboard data...</p>;
  }
  
  if (error) {
    return <p style={{ textAlign: 'center', padding: '2rem', color: '#b91c1c' }}>{error}</p>;
  }
  
  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1.5rem' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '8px',
          padding: '0.5rem'
        }}>
          <button
            onClick={() => setActiveTab('posts')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === 'posts' ? '#4338ca' : 'transparent',
              color: activeTab === 'posts' ? 'white' : '#4b5563',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === 'users' ? '#4338ca' : 'transparent',
              color: activeTab === 'users' ? 'white' : '#4b5563',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Users
          </button>
        </div>
      </div>
      
      {activeTab === 'posts' ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Posts Management</h2>
            <Link
              to="/create"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#4338ca',
                color: 'white',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Add New Post
            </Link>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Author</th>
                  <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>
                      No posts found
                    </td>
                  </tr>
                ) : (
                  posts.map(post => (
                    <tr key={post._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem' }}>{post.title}</td>
                      <td style={{ padding: '1rem' }}>{post.author?.username || 'Unknown'}</td>
                      <td style={{ padding: '1rem' }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link
                            to={`/edit/${post._id}`}
                            style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              borderRadius: '4px',
                              textDecoration: 'none',
                              fontSize: '0.875rem'
                            }}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              borderRadius: '4px',
                              border: 'none',
                              fontSize: '0.875rem',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Users Management</h2>
          
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Username</th>
                  <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Role</th>
                  <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem' }}>{user.username}</td>
                      <td style={{ padding: '1rem' }}>{user.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          backgroundColor: user.role === 'admin' ? '#c7d2fe' : '#e0e7ff',
                          color: user.role === 'admin' ? '#4338ca' : '#1e40af',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          textTransform: 'uppercase'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
