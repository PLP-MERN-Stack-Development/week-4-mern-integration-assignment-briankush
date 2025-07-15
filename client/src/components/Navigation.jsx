import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  // Wrap the component in error handling
  try {
    const { user, logout, isAdmin } = useAuth();
    
    // Navigation styles
    const navStyle = {
      backgroundColor: '#4338ca', 
      color: 'white',
      padding: '1rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    };
    
    const linkStyle = {
      color: 'white', 
      fontWeight: 500,
      marginLeft: '1.5rem',
      textDecoration: 'none'
    };
    
    // Safe username display with fallbacks
    const displayName = user ? (
      user.username || 
      user.name || 
      (user.email ? user.email.split('@')[0] : 'User')
    ) : '';
    
    // Safe check for admin role
    const isAdminUser = user && isAdmin ? isAdmin() : false;
    
    return (
      <nav style={navStyle}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>
            <Link to="/" style={{color: 'white', textDecoration: 'none'}}>MERN Blog</Link>
          </div>
          
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Link to="/" style={linkStyle}>Home</Link>
            
            {user ? (
              <>
                <Link to="/create" style={linkStyle}>Create Post</Link>
                
                {isAdminUser && (
                  <Link to="/admin" style={linkStyle}>Admin</Link>
                )}
                
                <span style={{
                  ...linkStyle,
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  marginLeft: '1.5rem'
                }}>
                  Welcome, <strong>{displayName}</strong>
                </span>
                
                <button 
                  onClick={() => logout && logout()}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    color: 'white',
                    fontWeight: 500,
                    marginLeft: '1rem'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={linkStyle}>Login</Link>
                <Link to="/register" style={linkStyle}>Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    );
  } catch (error) {
    console.error("Navigation rendering error:", error);
    // Fallback simple navigation
    return (
      <nav style={{
        backgroundColor: '#4338ca',
        color: 'white',
        padding: '1rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>
            <Link to="/" style={{color: 'white', textDecoration: 'none'}}>MERN Blog</Link>
          </div>
          <div>
            <Link to="/" style={{color: 'white', marginLeft: '1.5rem', textDecoration: 'none'}}>Home</Link>
            <Link to="/login" style={{color: 'white', marginLeft: '1.5rem', textDecoration: 'none'}}>Login</Link>
          </div>
        </div>
      </nav>
    );
  }
};

export default Navigation;
