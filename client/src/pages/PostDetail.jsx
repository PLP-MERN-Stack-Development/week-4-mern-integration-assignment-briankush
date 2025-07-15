import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postService.getPost(id);
        const postData = response.data || response;
        setPost(postData);
      } catch (err) {
        console.error(err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(id);
        navigate('/');
      } catch (err) {
        console.error(err);
        setError('Failed to delete post');
      }
    }
  };
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px'
      }}>
        <div style={{ fontSize: '18px', color: '#4b5563' }}>Loading post...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#b91c1c'
      }}>
        {error}
      </div>
    );
  }
  
  if (!post) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#4b5563'
      }}>
        Post not found
      </div>
    );
  }
  
  const isAuthor = user && post.author && user._id === post.author._id;
  const canEdit = isAuthor || (user && isAdmin && isAdmin());
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          color: '#4b5563',
          textDecoration: 'none',
          marginBottom: '24px'
        }}
      >
        <span style={{ marginRight: '6px' }}>←</span> Back to Posts
      </Link>
      
      <article style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '16px'
          }}>
            {post.title}
          </h1>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            <div>
              <span style={{ fontWeight: '500' }}>
                {post.author?.username || 'Unknown author'}
              </span>
              <span style={{ margin: '0 8px' }}>•</span>
              <time>
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            
            {canEdit && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link
                  to={`/edit/${post._id}`}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '14px'
                  }}
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </header>
        
        {post.featuredImage && (
          <div style={{ marginBottom: '24px' }}>
            <img
              src={`/uploads/${post.featuredImage}`}
              alt={post.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </div>
        )}
        
        <div style={{
          lineHeight: '1.8',
          color: '#374151',
          fontSize: '18px'
        }}>
          {post.content.split('\n').map((paragraph, index) => (
            paragraph.trim() ? (
              <p key={index} style={{ marginBottom: '16px' }}>{paragraph}</p>
            ) : <br key={index} />
          ))}
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
