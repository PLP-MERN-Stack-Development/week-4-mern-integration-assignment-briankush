import React, { useEffect, useState } from 'react';
import { postService } from '../services/api';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [isServerDown, setIsServerDown] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postService.getAllPosts();
        const data = response.data || response;
        setPosts(Array.isArray(data) ? data : []);
        setIsServerDown(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message || 'Failed to load posts');
        // Check if this might be a server connection issue
        if (err.message.includes('server') || err.toString().includes('SyntaxError')) {
          setIsServerDown(true);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [location.key]);

  if (loading) return <p style={{textAlign: 'center', padding: '20px', fontSize: '18px'}}>Loading posts...</p>;
  
  if (isServerDown) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        margin: '40px auto',
        maxWidth: '700px'
      }}>
        <h2 style={{fontSize: '24px', color: '#b91c1c', marginBottom: '16px'}}>
          Server Connection Error
        </h2>
        <p style={{fontSize: '16px', color: '#4b5563', marginBottom: '12px'}}>
          Unable to connect to the API server. Please make sure:
        </p>
        <ul style={{
          listStyleType: 'disc',
          padding: '0 20px',
          margin: '20px auto',
          textAlign: 'left',
          maxWidth: '500px',
          color: '#4b5563'
        }}>
          <li style={{marginBottom: '8px'}}>Your backend server is running</li>
          <li style={{marginBottom: '8px'}}>The API URL is configured correctly in api.js</li>
          <li style={{marginBottom: '8px'}}>CORS is enabled on your server if running on different ports</li>
          <li>Check your browser console for more details</li>
        </ul>
        <button 
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '12px'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (error) return <p style={{textAlign: 'center', padding: '20px', color: '#ef4444'}}>{error}</p>;

  return (
    <section>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        textAlign: 'center',
        color: '#1e293b'
      }}>Latest Blog Posts</h1>
      
      {posts && posts.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', // Wider cards
          gap: '2rem'
        }}>
          {posts.map((post) => (
            <Link
              to={`/posts/${post._id}`}
              key={post._id}
              style={{
                display: 'block',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                textDecoration: 'none',
                color: 'inherit',
                minHeight: '250px' // Ensure minimum height for better appearance
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              {post.featuredImage && (
                <img
                  src={`/uploads/${post.featuredImage}`}
                  alt={post.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '0.375rem',
                    marginBottom: '1rem'
                  }}
                />
              )}
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '0.75rem'
              }}>{post.title}</h2>
              <p style={{
                color: '#4b5563',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: '3',
                WebkitBoxOrient: 'vertical'
              }}>{post.excerpt || post.content}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          margin: '20px auto',
          maxWidth: '600px'
        }}>
          <p style={{fontSize: '18px', color: '#6b7280'}}>No posts found.</p>
          <p style={{marginTop: '12px'}}>
            <Link to="/create" style={{
              color: '#4f46e5',
              fontWeight: '500',
              textDecoration: 'underline'
            }}>Create your first post</Link>
          </p>
        </div>
      )}
    </section>
  );
};

export default Home;
