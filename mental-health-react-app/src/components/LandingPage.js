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
  useMediaQuery,
  Stack,
  Chip,
  TextField,
  Alert,
  Snackbar,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Psychology,
  Favorite,
  EmojiEmotions,
  Security,
  AccessTime,
  Support,
  ArrowForward,
  Check,
  Email,
  Phone,
  LocationOn,
  Send
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import { useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import { colors } from '../theme';

const fancyFont = `'Inter', 'Poppins', 'Montserrat', 'Quicksand', 'cursive', 'sans-serif'`;

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleLogout = () => logout();
  const handleGoToDashboard = () => navigate('/dashboard/chat');
  const handleShowSignIn = () => navigate('/signin');
  const handleShowSignUp = () => navigate('/signup');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      const data = await response.json();
      if (response.ok) {
        setSnackbar({ open: true, message: data.message, severity: 'success' });
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setSnackbar({ open: true, message: data.error || 'Failed to send message', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Network error. Please try again.', severity: 'error' });
    }
  };
  const handleContactChange = (e) => setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const highlights = [
    {
      title: 'AI-Powered Conversations',
      description: 'Engage in meaningful, empathetic conversations with our advanced AI that understands context and emotions.',
      icon: <Psychology sx={{ fontSize: 50, color: colors.primary.main }} />,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop&q=80',
      stats: '10,000+ conversations daily'
    },
    {
      title: 'Mood Tracking & Analytics',
      description: 'Track your emotional journey with detailed analytics and insights to understand your mental wellness patterns.',
      icon: <EmojiEmotions sx={{ fontSize: 50, color: colors.secondary.main }} />,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&q=80',
      stats: '95% accuracy in mood detection'
    },
    {
      title: 'Crisis Intervention',
      description: 'Immediate crisis support with emergency resources and professional escalation when needed.',
      icon: <Support sx={{ fontSize: 50, color: colors.error.main }} />,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&q=80',
      stats: '24/7 crisis support available'
    },
    {
      title: 'Wellness Activities',
      description: 'Interactive wellness tools including breathing exercises, meditation guides, and stress relief activities.',
      icon: <Favorite sx={{ fontSize: 50, color: colors.success.main }} />,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
      stats: '50+ wellness activities'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Student',
      content: 'Mental Health Buddy has been a game-changer for my anxiety. The AI conversations feel so natural and supportive.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop&crop=face&q=80'
    },
    {
      name: 'Michael R.',
      role: 'Professional',
      content: 'I love the mood tracking feature. It helps me understand my emotional patterns and work on my mental wellness.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face&q=80'
    },
    {
      name: 'Emma L.',
      role: 'Parent',
      content: 'The crisis support features give me peace of mind. I know help is always available when I need it.',
      rating: 5,
      avatar: ''
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, fontFamily: fancyFont, background: colors.gradients.landing, minHeight: '100vh' }}>
      <Navigation 
        onShowSignIn={handleShowSignIn}
        onShowSignUp={handleShowSignUp}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <Container maxWidth="xl" sx={{ pt: 6, pb: 6 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Spline 3D Column */}
          <Grid item xs={12} md={6}>
            <Spline scene="https://prod.spline.design/vJ7ykh8JGvYyLEsB/scene.splinecode" style={{ width: '100%', height: isMobile ? 300 : 500 }} />
          </Grid>
          {/* Hero/CTA Column */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: isMobile ? 'center' : 'left', color: colors.text.primary, px: isMobile ? 0 : 4 }}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontFamily: fancyFont, color: colors.text.primary, letterSpacing: 1 }}>
                  Meet MIRA, Your AI Mental Health Buddy
                </Typography>
                <Typography variant="h5" sx={{ mb: 3, color: colors.text.primary, fontWeight: 500, fontFamily: fancyFont, letterSpacing: 0.5 }}>
                  Compassionate, interactive, and always here for you. Explore wellness, track your mood, and chat with MIRA 24/7.
                </Typography>
                {currentUser && (
                  <Typography variant="h6" sx={{ mb: 3, color: colors.text.primary, fontWeight: 700, fontFamily: fancyFont }}>
                    Welcome back, {currentUser.first_name}! 💙
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start', mb: 4 }}>
                  {!currentUser ? (
                    <>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleShowSignUp}
                        sx={{
                          background: colors.gradients.primary,
                          color: colors.primary.contrastText,
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          boxShadow: 3,
                          fontFamily: fancyFont,
                          '&:hover': { background: colors.gradients.secondary, color: colors.neutral.darkGray }
                        }}
                      >
                        Start Your Journey
                        <ArrowForward sx={{ ml: 1 }} />
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={handleShowSignIn}
                        sx={{
                          borderColor: colors.primary.contrastText,
                          color: colors.primary.contrastText,
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          fontFamily: fancyFont,
                          '&:hover': { 
                            borderColor: colors.primary.contrastText,
                            background: 'rgba(245,238,221,0.1)',
                            color: colors.neutral.darkGray
                          }
                        }}
                      >
                        Sign In
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleGoToDashboard}
                      sx={{
                        background: colors.gradients.primary,
                        color: colors.primary.contrastText,
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        boxShadow: 3,
                        fontFamily: fancyFont,
                        '&:hover': { background: colors.gradients.secondary, color: colors.neutral.darkGray }
                      }}
                    >
                      Continue Session
                      <ArrowForward sx={{ ml: 1 }} />
                    </Button>
                  )}
                </Box>
              </motion.div>
            </Box>
          </Grid>
        </Grid>

        {/* Highlights Section */}
        <Box sx={{ mt: 12, mb: 8 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700, color: colors.text.primary, fontFamily: fancyFont }}>
              Why Choose MIRA?
            </Typography>
          </motion.div>
          
          <Grid container spacing={4}>
            {highlights.map((highlight, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <Card sx={{ 
                    height: '100%', 
                    background: 'rgba(255,255,255,0.95)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Box sx={{ mb: 2 }}>
                        {highlight.icon}
                      </Box>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: colors.text.primary }}>
                        {highlight.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 3, color: colors.text.primary, lineHeight: 1.6 }}>
                        {highlight.description}
                      </Typography>
                      <Chip 
                        label={highlight.stats} 
                        size="small" 
                        sx={{ 
                          background: colors.gradients.cool,
                          color: colors.primary.main,
                          fontWeight: 600
                        }} 
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ mt: 12, mb: 8 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700, color: colors.text.primary, fontFamily: fancyFont }}>
              What Our Users Say
            </Typography>
          </motion.div>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <Card sx={{ 
                    height: '100%', 
                    background: 'rgba(255,255,255,0.95)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box
                          component="img"
                          src={testimonial.avatar || 'https://ui-avatars.com/api/?name=Emma+L.&background=F9FAFB&color=222B45&size=128'}
                          alt={testimonial.name}
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            mr: 2,
                            objectFit: 'cover',
                            background: colors.neutral.lightGray
                          }}
                        />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text.primary }}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body1" sx={{ color: colors.text.primary, lineHeight: 1.6, mb: 2 }}>
                        "{testimonial.content}"
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Box key={i} sx={{ color: colors.warning.main }}>★</Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Pricing Section */}
        <Box sx={{ mt: 12, mb: 8 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
            <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700, color: colors.text.primary, fontFamily: fancyFont }}>
              Simple, Transparent Pricing
            </Typography>
          </motion.div>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Card sx={{
                  background: 'rgba(255,255,255,0.98)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  p: 5,
                  textAlign: 'center',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: 480,
                  boxShadow: '0 8px 32px rgba(79,140,255,0.08)',
                  justifyContent: 'space-between',
                }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: colors.primary.main, mb: 2 }}>
                      Free
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: 900, color: colors.text.primary, mb: 1 }}>
                      $0
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.primary, mb: 4 }}>
                      Perfect for getting started
                    </Typography>
                    <List sx={{ mb: 4 }}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check sx={{ color: colors.success.main }} />
                        </ListItemIcon>
                        <ListItemText primary="Limited AI Conversations" />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check sx={{ color: colors.success.main }} />
                        </ListItemIcon>
                        <ListItemText primary="Basic Mood Tracking" />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check sx={{ color: colors.success.main }} />
                        </ListItemIcon>
                        <ListItemText primary="Crisis Support" />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check sx={{ color: colors.success.main }} />
                        </ListItemIcon>
                        <ListItemText primary="Basic Analytics" />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check sx={{ color: colors.success.main }} />
                        </ListItemIcon>
                        <ListItemText primary="Community Support" />
                      </ListItem>
                    </List>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleShowSignUp}
                    sx={{
                      background: colors.gradients.primary,
                      color: colors.primary.contrastText,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      py: 1.5,
                      boxShadow: 3,
                      fontFamily: fancyFont,
                      '&:hover': { background: colors.gradients.secondary, color: colors.neutral.darkGray }
                    }}
                  >
                    Get Started Free
                  </Button>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Card sx={{
                  background: 'rgba(255,255,255,0.98)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  p: 5,
                  textAlign: 'center',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: 480,
                  boxShadow: '0 8px 32px rgba(79,140,255,0.08)',
                  justifyContent: 'space-between',
                }}>
                  <Chip
                    label="Most Popular"
                    sx={{
                      position: 'absolute',
                      top: 20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: colors.primary.main,
                      color: colors.primary.contrastText,
                      fontWeight: 600,
                      fontSize: '1rem',
                      zIndex: 2,
                      px: 2,
                      py: 1
                    }}
                  />
                  <Box sx={{ mt: 5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: colors.primary.main, mb: 2 }}>
                      Premium
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: 900, color: colors.text.primary, mb: 1 }}>
                      $9.99
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.primary, mb: 4 }}>
                      per month
                    </Typography>
                    <List sx={{ mb: 4 }}>
                      <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                          <Check sx={{ color: colors.success.main }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<span><b>Custom Voice Conversion</b><br /><span style={{ fontWeight: 400 }}>Transform your text or mood into a unique, supportive AI voice experience.</span></span>}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                          <Check sx={{ color: colors.success.main }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<span><b>Personalised AI Call Conversation</b><br /><span style={{ fontWeight: 400 }}>Schedule and receive AI-powered wellness calls tailored to your needs.</span></span>}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                          <Check sx={{ color: colors.success.main }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<span><b>Custom Well-being Plan</b><br /><span style={{ fontWeight: 400 }}>Get a plan designed for your unique mental health journey.</span></span>}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                          <Check sx={{ color: colors.success.main }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<span><b>Advanced Analytics</b><br /><span style={{ fontWeight: 400 }}>Deep insights and trends to help you grow and thrive.</span></span>}
                        />
                      </ListItem>
                    </List>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleShowSignUp}
                    sx={{
                      background: colors.gradients.primary,
                      color: colors.primary.contrastText,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      py: 1.5,
                      boxShadow: 3,
                      fontFamily: fancyFont,
                      '&:hover': { background: colors.gradients.secondary, color: colors.neutral.darkGray }
                    }}
                  >
                    Start Premium Trial
                  </Button>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* Contact Section */}
        <Box sx={{ mt: 12, mb: 8 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}>
            <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700, color: colors.text.primary, fontFamily: fancyFont }}>
              Get in Touch
            </Typography>
          </motion.div>
          
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <Card sx={{ 
                  background: 'rgba(255,255,255,0.95)', 
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  p: 4,
                  height: '100%'
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text.primary, mb: 3 }}>
                    Contact Information
                  </Typography>
                  <List>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Email sx={{ color: colors.primary.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email" 
                        secondary="support@mentalhealthbuddy.ai"
                        secondaryTypographyProps={{ color: colors.text.primary }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Phone sx={{ color: colors.primary.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Phone" 
                        secondary="+1 (555) 123-4567"
                        secondaryTypographyProps={{ color: colors.text.primary }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <LocationOn sx={{ color: colors.primary.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Address" 
                        secondary="123 Wellness Street, Mental Health City, MH 12345"
                        secondaryTypographyProps={{ color: colors.text.primary }}
                      />
                    </ListItem>
                  </List>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <Card sx={{ 
                  background: 'rgba(255,255,255,0.95)', 
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  p: 4
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text.primary, mb: 3 }}>
                    Send us a Message
                  </Typography>
                  <Box component="form" onSubmit={handleContactSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name"
                          name="name"
                          value={contactForm.name}
                          onChange={handleContactChange}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: colors.neutral.white,
                              '&:hover fieldset': {
                                borderColor: colors.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: colors.primary.main,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={contactForm.email}
                          onChange={handleContactChange}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: colors.neutral.white,
                              '&:hover fieldset': {
                                borderColor: colors.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: colors.primary.main,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subject"
                          name="subject"
                          value={contactForm.subject}
                          onChange={handleContactChange}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: colors.neutral.white,
                              '&:hover fieldset': {
                                borderColor: colors.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: colors.primary.main,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Message"
                          name="message"
                          value={contactForm.message}
                          onChange={handleContactChange}
                          required
                          multiline
                          rows={4}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: colors.neutral.white,
                              '&:hover fieldset': {
                                borderColor: colors.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: colors.primary.main,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          endIcon={<Send />}
                          sx={{
                            background: colors.gradients.primary,
                            py: 1.5,
                            '&:hover': {
                              background: colors.gradients.secondary
                            }
                          }}
                        >
                          Send Message
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Snackbar for contact form */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LandingPage; 