import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from auth context
  
  const [post, setPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  
  // Fetch post data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      postService.getPost(id)
        .then(data => {
          const postData = data.data || data; // Handle different API response formats
          setPost({
            title: postData.title || '',
            content: postData.content || '',
            excerpt: postData.excerpt || '',
            featuredImage: null // Can't populate file input with existing file
          });
          
          // Set image preview if exists
          if (postData.featuredImage) {
            setImagePreview(`/uploads/${postData.featuredImage}`);
          }
          
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load post');
          setLoading(false);
        });
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPost(prev => ({ ...prev, featuredImage: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!user) {
      setError('You must be logged in to create or edit posts');
      setLoading(false);
      return;
    }
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', post.title);
      formData.append('content', post.content);
      
      if (post.excerpt) {
        formData.append('excerpt', post.excerpt);
      }
      
      if (post.featuredImage) {
        formData.append('featuredImage', post.featuredImage);
      }
      
      // Log what we're submitting
      console.log("Submitting post:", {
        title: post.title,
        content: post.content.substring(0, 50) + "...", // Log first 50 chars of content
        excerpt: post.excerpt,
        hasImage: !!post.featuredImage,
        userId: user._id || 'unknown',
        username: user.username || 'unknown'
      });
      
      // Attempt to create or update post
      try {
        if (isEditMode) {
          await postService.updatePost(id, formData);
        } else {
          await postService.createPost(formData);
        }
        
        navigate('/');
      } catch (apiError) {
        console.error("API Error Details:", apiError);
        if (apiError.status === 500) {
          setError('Server error: The server encountered an issue. Please try again later.');
        } else {
          setError(apiError.message || 'Failed to save post');
        }
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px'
      }}>
        <div style={{ fontSize: '18px', color: '#4b5563' }}>Loading post data...</div>
      </div>
    );
  }
  
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '24px',
        color: '#1e293b'
      }}>
        {isEditMode ? 'Edit Post' : 'Create New Post'}
      </h2>
      
      <form 
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%'
        }}
      >
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <strong>Error: </strong>{error}
            {error.includes('server') && (
              <p style={{marginTop: '8px', fontSize: '14px'}}>
                This could be due to a problem with the server configuration or database.
                Please try again later or contact support.
              </p>
            )}
          </div>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#374151'
          }}>
            Title
          </label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '16px',
              backgroundColor: '#ffffff',
              color: '#000000'
            }}
            placeholder="Enter post title"
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#374151'
          }}>
            Short Excerpt (optional)
          </label>
          <input
            type="text"
            name="excerpt"
            value={post.excerpt}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '16px',
              backgroundColor: '#ffffff',
              color: '#000000'
            }}
            placeholder="Brief summary of your post"
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#374151'
          }}>
            Content
          </label>
          <textarea
            name="content"
            value={post.content}
            onChange={handleChange}
            required
            rows={10}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '16px',
              resize: 'vertical',
              backgroundColor: '#ffffff',
              color: '#000000'
            }}
            placeholder="Write your post content here..."
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#374151'
          }}>
            Featured Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '16px'
            }}
          />
          
          {imagePreview && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ 
                marginBottom: '8px',
                fontSize: '14px',
                color: '#4b5563'
              }}>Image Preview:</p>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '6px',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#4338ca')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#4f46e5')}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
