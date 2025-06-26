import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Psychology,
  Favorite,
  Security,
  Support,
  Accessibility,
  TrendingUp,
  ArrowForward
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import { useNavigate } from 'react-router-dom';

const LandingPage = ({ onShowSignIn, onShowSignUp }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleContinueSession = () => {
    window.location.href = `http://localhost:5000?user=${currentUser.username}`;
  };

  const handleEnhancedChat = () => {
    navigate('/enhanced-chat');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard/chat');
  };

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'AI-Powered Therapy',
      description: 'Advanced AI that understands and responds with empathy, providing personalized mental health support.'
    },
    {
      icon: <Favorite sx={{ fontSize: 40, color: '#e91e63' }} />,
      title: 'Emotion Detection',
      description: 'Real-time emotion analysis to provide the most appropriate and helpful responses.'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#4caf50' }} />,
      title: 'Privacy First',
      description: 'Your conversations are private and secure. We prioritize your mental health and data protection.'
    },
    {
      icon: <Support sx={{ fontSize: 40, color: '#ff9800' }} />,
      title: '24/7 Support',
      description: 'Available whenever you need someone to talk to, day or night.'
    },
    {
      icon: <Accessibility sx={{ fontSize: 40, color: '#9c27b0' }} />,
      title: 'Accessible Design',
      description: 'Voice features and intuitive interface make mental health support accessible to everyone.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#2196f3' }} />,
      title: 'Progress Tracking',
      description: 'Track your mental wellness journey with insights and personalized recommendations.'
    }
  ];

  const activities = [
    {
      title: 'Breathing Exercises',
      description: 'Guided breathing techniques to reduce anxiety and stress',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop'
    },
    {
      title: 'Mood Tracking',
      description: 'Monitor your emotional patterns and build self-awareness',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
    },
    {
      title: 'Therapeutic Games',
      description: 'Engaging activities designed to improve mental wellness',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation */}
      <Navigation 
        onShowSignIn={onShowSignIn}
        onShowSignUp={onShowSignUp}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <Box sx={{ pt: 8, pb: 6, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
                Your AI Mental Health Companion
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, maxWidth: 800, mx: 'auto' }}>
                Experience compassionate, AI-powered mental health support available 24/7. 
                Get personalized therapy, track your wellness journey, and find peace of mind.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                {!currentUser ? (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={onShowSignUp}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.3)',
                          }
                        }}
                      >
                        Start Your Journey
                        <ArrowForward sx={{ ml: 1 }} />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={onShowSignIn}
                        sx={{
                          borderColor: 'white',
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                            background: 'rgba(255, 255, 255, 0.1)',
                          }
                        }}
                      >
                        Sign In
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleGoToDashboard}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.3)',
                          }
                        }}
                      >
                        Go to Dashboard
                        <ArrowForward sx={{ ml: 1 }} />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={handleContinueSession}
                        sx={{
                          borderColor: 'white',
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                            background: 'rgba(255, 255, 255, 0.1)',
                          }
                        }}
                      >
                        Continue Session
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={handleEnhancedChat}
                        sx={{
                          borderColor: 'white',
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                            background: 'rgba(255, 255, 255, 0.1)',
                          }
                        }}
                      >
                        Enhanced Chat
                        <ArrowForward sx={{ ml: 1 }} />
                      </Button>
                    </motion.div>
                  </>
                )}
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography variant="h3" component="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
            Why Choose Mental Health Buddy?
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Activities Section */}
      <Box sx={{ background: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography variant="h3" component="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
              Therapeutic Activities
            </Typography>
            
            <Grid container spacing={4}>
              {activities.map((activity, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card sx={{ height: '100%' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={activity.image}
                        alt={activity.title}
                      />
                      <CardContent>
                        <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                          {activity.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activity.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                Ready to Start Your Wellness Journey?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Join thousands of users who have found support and improved their mental health with our AI companion.
              </Typography>
              
              {!currentUser ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={onShowSignUp}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      px: 6,
                      py: 2,
                      fontSize: '1.2rem',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                      }
                    }}
                  >
                    Get Started Free
                    <ArrowForward sx={{ ml: 1 }} />
                  </Button>
                </motion.div>
              ) : (
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleGoToDashboard}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        px: 6,
                        py: 2,
                        fontSize: '1.2rem',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.3)',
                        }
                      }}
                    >
                      Go to Dashboard
                      <ArrowForward sx={{ ml: 1 }} />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleContinueSession}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        px: 6,
                        py: 2,
                        fontSize: '1.2rem',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.3)',
                        }
                      }}
                    >
                      Continue Session
                      <ArrowForward sx={{ ml: 1 }} />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleEnhancedChat}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 6,
                        py: 2,
                        fontSize: '1.2rem',
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.8)',
                          background: 'rgba(255, 255, 255, 0.1)',
                        }
                      }}
                    >
                      Enhanced Chat
                      <ArrowForward sx={{ ml: 1 }} />
                    </Button>
                  </motion.div>
                </Box>
              )}
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;