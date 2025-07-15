import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px'
      }}>
        <div style={{ fontSize: '18px', color: '#4b5563' }}>Checking authentication...</div>
      </div>
    );
  }
  
  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Admin route check
  if (adminOnly) {
    const hasAdminRole = isAdmin();
    console.log(`Checking admin access: user role=${user.role}, isAdmin=${hasAdminRole}`);
    
    if (!hasAdminRole) {
      return (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#b91c1c',
            marginBottom: '16px'
          }}>Access Denied</h2>
          <p style={{color: '#4b5563', marginBottom: '20px'}}>
            You don't have admin privileges to access this page.
          </p>
          <Link to="/" style={{
            display: 'inline-block',
            padding: '10px 16px',
            backgroundColor: '#4f46e5',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none'
          }}>
            Return to Home
          </Link>
        </div>
      );
    }
  }
  
  return children;
};

export default ProtectedRoute;
