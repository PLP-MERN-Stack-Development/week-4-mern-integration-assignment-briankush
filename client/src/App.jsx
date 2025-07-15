import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import PostForm from './pages/PostForm';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-indigo-100">
          <ErrorBoundary fallback={<SimplifiedNavigation />}>
            <Navigation />
          </ErrorBoundary>
          
          <main className="container mx-auto flex-1 py-10 px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/create" element={<PostForm />} />
              <Route path="/edit/:id" element={<PostForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Simple navigation fallback component
function SimplifiedNavigation() {
  return (
    <nav style={{
      backgroundColor: '#4338ca',
      color: 'white',
      padding: '1rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>MERN Blog</div>
        <div>
          <a href="/" style={{color: 'white', marginLeft: '1rem'}}>Home</a>
          <a href="/login" style={{color: 'white', marginLeft: '1rem'}}>Login</a>
        </div>
      </div>
    </nav>
  );
}

export default App;

