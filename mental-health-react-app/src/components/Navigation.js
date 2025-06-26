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
  Close
} from '@mui/icons-material';
import { motion } from 'framer-motion';

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
      icon: <Psychology sx={{ fontSize: 30, color: '#667eea' }} />,
      title: 'AI-Powered Therapy',
      description: 'Advanced Gemini 2.0 Flash AI provides empathetic, personalized conversations'
    },
    {
      icon: <Support sx={{ fontSize: 30, color: '#e91e63' }} />,
      title: '24/7 Support',
      description: 'Available whenever you need someone to talk to, day or night'
    },
    {
      icon: <Security sx={{ fontSize: 30, color: '#4caf50' }} />,
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
      <AppBar position="fixed" sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333', fontWeight: 'bold' }}>
            💙 Mental Health Buddy
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                color="inherit" 
                sx={{ color: '#333' }}
                onClick={() => setFeaturesOpen(true)}
              >
                Features
              </Button>
              <Button 
                color="inherit" 
                sx={{ color: '#333' }}
                onClick={() => setAboutOpen(true)}
              >
                About
              </Button>
              <Button 
                color="inherit" 
                sx={{ color: '#333' }}
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
                    borderColor: '#667eea', 
                    color: '#667eea',
                    '&:hover': { borderColor: '#5a6fd8' }
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  variant="contained" 
                  onClick={onShowSignUp}
                  sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' }
                  }}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="contained" 
                  onClick={() => window.location.href = `http://localhost:5000?user=${currentUser.username}`}
                  sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' }
                  }}
                >
                  Continue Session
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={onLogout}
                  sx={{ 
                    borderColor: '#e91e63', 
                    color: '#e91e63',
                    '&:hover': { borderColor: '#c2185b' }
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
              sx={{ ml: 1, color: '#333' }}
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
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
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
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Features
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card sx={{ height: '100%', textAlign: 'center' }}>
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeaturesOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* About Dialog */}
      <Dialog 
        open={aboutOpen} 
        onClose={() => setAboutOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          About Mental Health Buddy
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Mental Health Buddy is an AI-powered mental health companion designed to provide 
            empathetic support, crisis intervention, and therapeutic activities to help improve 
            your mental wellness journey.
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Our Mission
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            To make mental health support accessible, available 24/7, and personalized to each 
            individual's needs. We believe everyone deserves compassionate support on their 
            mental wellness journey.
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Technology
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            <Chip label="Gemini 2.0 Flash AI" color="primary" />
            <Chip label="ElevenLabs Voice" color="secondary" />
            <Chip label="React Frontend" color="default" />
            <Chip label="Flask Backend" color="default" />
          </Box>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Safety & Privacy
          </Typography>
          <Typography variant="body2">
            Your privacy and safety are our top priorities. All conversations are private and 
            secure. We include crisis detection and immediate access to emergency resources 
            when needed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAboutOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Support Dialog */}
      <Dialog 
        open={supportOpen} 
        onClose={() => setSupportOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Support & Resources
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            If you're in crisis or need immediate support, please use these resources:
          </Typography>
          
          <Grid container spacing={3}>
            {supportOptions.map((option, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card sx={{ height: '100%', textAlign: 'center' }}>
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        {option.icon}
                      </Box>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        {option.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {option.content}
                      </Typography>
                      <Button 
                        variant="contained" 
                        size="small"
                        sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' }
                        }}
                      >
                        {option.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
            Additional Resources
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            • National Alliance on Mental Illness (NAMI): 1-800-950-NAMI
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            • Substance Abuse and Mental Health Services Administration: 1-800-662-4357
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            • Veterans Crisis Line: 1-800-273-8255
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSupportOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navigation; 