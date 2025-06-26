import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Psychology,
  Support,
  Security,
  Info,
  Star,
  Phone,
  Email,
  LocationOn,
  Close,
  Favorite
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { colors } from '../theme';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../assets/mira-logo.png';

const Navigation = ({ onShowSignIn, onShowSignUp, currentUser, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 30, color: colors.primary.main }} />,
      title: 'AI-Powered Therapy',
      description: 'Advanced Gemini 2.0 Flash AI provides empathetic, personalized conversations'
    },
    {
      icon: <Support sx={{ fontSize: 30, color: colors.error.main }} />,
      title: '24/7 Support',
      description: 'Available whenever you need someone to talk to, day or night'
    },
    {
      icon: <Security sx={{ fontSize: 30, color: colors.success.main }} />,
      title: 'Crisis Intervention',
      description: 'Immediate safety protocols and emergency resource access'
    }
  ];

  const supportOptions = [
    {
      icon: <Phone />,
      title: 'Crisis Hotline',
      content: '988 - Suicide Prevention Lifeline (24/7)',
      action: 'Call Now'
    },
    {
      icon: <Email />,
      title: 'Email Support',
      content: 'support@mentalhealthbuddy.ai',
      action: 'Send Email'
    },
    {
      icon: <LocationOn />,
      title: 'Find Help',
      content: 'Locate mental health professionals in your area',
      action: 'Search'
    }
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem button onClick={() => setFeaturesOpen(true)}>
          <ListItemIcon>
            <Star />
          </ListItemIcon>
          <ListItemText primary="Features" />
        </ListItem>
        <ListItem button onClick={() => setAboutOpen(true)}>
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
        <ListItem button onClick={() => setSupportOpen(true)}>
          <ListItemIcon>
            <Support />
          </ListItemIcon>
          <ListItemText primary="Support" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ background: colors.neutral.darkGray, boxShadow: 'none' }}>
        <Toolbar>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              cursor: 'pointer',
              minHeight: 56
            }}
          >
            <img src={logo} alt="MIRA Logo" style={{ height: 48, width: 'auto', display: 'block' }} />
          </Box>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                color="inherit" 
                sx={{ color: colors.primary.contrastText, '&:hover': { color: colors.secondary.main } }}
                onClick={() => setFeaturesOpen(true)}
              >
                Features
              </Button>
              <Button 
                color="inherit" 
                sx={{ color: colors.primary.contrastText, '&:hover': { color: colors.secondary.main } }}
                onClick={() => setAboutOpen(true)}
              >
                About
              </Button>
              <Button 
                color="inherit" 
                sx={{ color: colors.primary.contrastText, '&:hover': { color: colors.secondary.main } }}
                onClick={() => setSupportOpen(true)}
              >
                Support
              </Button>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
            {!currentUser ? (
              <>
                <Button 
                  variant="outlined" 
                  onClick={onShowSignIn}
                  sx={{ 
                    borderColor: colors.secondary.main, 
                    color: colors.primary.contrastText,
                    '&:hover': { 
                      borderColor: colors.secondary.dark,
                      background: colors.secondary.main,
                      color: colors.neutral.darkGray
                    }
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  variant="contained" 
                  onClick={onShowSignUp}
                  sx={{ 
                    background: colors.gradients.secondary,
                    color: colors.neutral.darkGray,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    px: 3,
                    py: 1.2,
                    '&:hover': { 
                      background: colors.gradients.primary,
                      color: colors.primary.contrastText,
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(7, 122, 125, 0.4)'
                    }
                  }}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  onClick={onLogout}
                  sx={{ 
                    borderColor: colors.error.main, 
                    color: colors.error.main,
                    '&:hover': { 
                      borderColor: colors.error.dark,
                      background: colors.error.main,
                      color: colors.neutral.white
                    }
                  }}
                >
                  Sign Out
                </Button>
              </>
            )}
          </Box>
          
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: 1, color: colors.text.primary }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            background: colors.background.sidebar
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Features Dialog */}
      <Dialog 
        open={featuresOpen} 
        onClose={() => setFeaturesOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: colors.gradients.primary, 
          color: colors.neutral.white,
          fontWeight: 600
        }}>
          Platform Features
          <IconButton
            aria-label="close"
            onClick={() => setFeaturesOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: colors.neutral.white,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  textAlign: 'center',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: colors.text.primary }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* About Dialog */}
      <Dialog 
        open={aboutOpen} 
        onClose={() => setAboutOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: colors.gradients.primary, 
          color: colors.neutral.white,
          fontWeight: 600
        }}>
          About Mental Health Buddy
          <IconButton
            aria-label="close"
            onClick={() => setAboutOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: colors.neutral.white,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: colors.text.primary }}>
            Our Mission
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: colors.text.secondary, lineHeight: 1.6 }}>
            Mental Health Buddy is dedicated to providing accessible, compassionate mental health support through advanced AI technology. 
            We believe everyone deserves access to mental wellness resources, and our platform is designed to be a safe, supportive space 
            for emotional well-being.
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: colors.text.primary }}>
            What We Offer
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: colors.text.secondary, lineHeight: 1.6 }}>
            • 24/7 AI-powered conversations with empathetic responses<br/>
            • Advanced mood tracking and emotional analytics<br/>
            • Crisis intervention and emergency resource access<br/>
            • Interactive wellness activities and exercises<br/>
            • Community support and peer connections
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: colors.text.primary }}>
            Technology
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text.secondary, lineHeight: 1.6 }}>
            Built with cutting-edge AI technology including Gemini 2.0 Flash, our platform provides intelligent, 
            context-aware responses while maintaining the highest standards of privacy and security.
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Support Dialog */}
      <Dialog 
        open={supportOpen} 
        onClose={() => setSupportOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: colors.gradients.primary, 
          color: colors.neutral.white,
          fontWeight: 600
        }}>
          Support & Resources
          <IconButton
            aria-label="close"
            onClick={() => setSupportOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: colors.neutral.white,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {supportOptions.map((option, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ mb: 2, color: colors.primary.main }}>
                      {option.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: colors.text.primary }}>
                      {option.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: colors.text.secondary }}>
                      {option.content}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: colors.primary.main,
                        color: colors.primary.main,
                        '&:hover': {
                          borderColor: colors.primary.dark,
                          background: colors.primary.main,
                          color: colors.neutral.white
                        }
                      }}
                    >
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 4, p: 3, background: colors.gradients.warm, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: colors.text.primary }}>
              Emergency Support
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: colors.text.secondary }}>
              If you're experiencing a mental health crisis or having thoughts of self-harm, please reach out immediately:
            </Typography>
            <Typography variant="h6" sx={{ color: colors.error.main, fontWeight: 700 }}>
              988 - National Suicide Prevention Lifeline
            </Typography>
            <Typography variant="body2" sx={{ color: colors.error.main, fontWeight: 600 }}>
              Available 24/7 • Free and Confidential
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navigation; 