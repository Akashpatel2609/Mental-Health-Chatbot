import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { theme, colors } from './theme';

// Components
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import ChatInterface from './components/ChatInterface';
import WellnessHub from './components/WellnessHub';
import MoodTracker from './components/MoodTracker';
import Resources from './components/Resources';
import Insights from './components/Insights';
import Community from './components/Community';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: colors.gradients.landing
      }}>
        <div style={{ color: 'white', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    );
  }
  
  return currentUser ? children : <Navigate to="/signin" />;
};

// Authentication Page Component
const AuthPage = () => {
  const [isSignIn, setIsSignIn] = React.useState(true);
  const { currentUser } = useAuth();

  // Redirect to dashboard if already authenticated
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      {isSignIn ? (
        <SignIn onSwitchToSignUp={() => setIsSignIn(false)} />
      ) : (
        <SignUp onSwitchToSignIn={() => setIsSignIn(true)} />
      )}
    </div>
  );
};

// Main App Component
const AppContent = () => {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ChatInterface />} />
          <Route path="chat" element={<ChatInterface />} />
          <Route path="wellness" element={<WellnessHub />} />
          <Route path="mood" element={<MoodTracker />} />
          <Route path="resources" element={<Resources />} />
          <Route path="insights" element={<Insights />} />
          <Route path="community" element={<Community />} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

// App Component with Providers
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;