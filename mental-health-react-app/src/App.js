import React, { useState, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import EnhancedChatInterface from './components/EnhancedChatInterface';
import DashboardLayout from './components/DashboardLayout';
import WellnessHub from './components/WellnessHub';
import MoodTracker from './components/MoodTracker';
import Resources from './components/Resources';
import Insights from './components/Insights';
import Community from './components/Community';
import './App.css';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <div style={{ color: 'white', fontSize: '1.2rem' }}>
          Loading...
        </div>
      </Box>
    );
  }
  
  return currentUser ? children : <Navigate to="/" />;
};

// Main App Component
const AppContent = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleShowSignIn = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const handleShowSignUp = () => {
    setShowSignUp(true);
    setShowSignIn(false);
  };

  const handleLogout = () => {
    logout();
    setShowSignIn(false);
    setShowSignUp(false);
  };

  // If showing auth forms, render them
  if (showSignIn) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <SignIn onSwitchToSignup={handleShowSignUp} />
      </Box>
    );
  }

  if (showSignUp) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <SignUp onSwitchToSignin={handleShowSignIn} />
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <LandingPage 
              onShowSignIn={handleShowSignIn} 
              onShowSignUp={handleShowSignUp} 
            />
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <EnhancedChatInterface />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/enhanced-chat" 
          element={
            <ProtectedRoute>
              <EnhancedChatInterface />
            </ProtectedRoute>
          } 
        />
        {/* Dashboard Route with Sidebar Layout */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="chat" element={<React.Suspense fallback={<div>Loading...</div>}><EnhancedChatInterface /></React.Suspense>} />
          <Route path="wellness" element={<WellnessHub />} />
          <Route path="mood" element={<MoodTracker />} />
          <Route path="resources" element={<Resources />} />
          <Route path="insights" element={<Insights />} />
          <Route path="community" element={<Community />} />
          <Route path="*" element={<Navigate to="chat" />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

// Root App Component with Providers
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;