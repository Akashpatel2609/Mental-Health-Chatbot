import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  LocalHospital,
  Phone,
  Email,
  LocationOn,
  Warning,
  Favorite,
  Psychology,
  Support,
  Info,
  ExpandMore,
  Call,
  Language,
  Book,
  VideoLibrary,
  Group,
  Security
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { colors } from '../theme';

const Resources = () => {
  const [emergencyResources, setEmergencyResources] = useState([]);
  const [supportResources, setSupportResources] = useState([]);
  const [educationalContent, setEducationalContent] = useState([]);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const response = await fetch('http://localhost:5000/emergency-resources');
      const data = await response.json();
      setEmergencyResources(data.mental_health_resources || []);
    } catch (error) {
      console.error('Error loading resources:', error);
      // Fallback resources
      setEmergencyResources([
        {
          name: 'National Suicide Prevention Lifeline',
          phone: '988',
          website: 'https://suicidepreventionlifeline.org',
          description: '24/7 support for people in distress',
          available: '24/7'
        },
        {
          name: 'Crisis Text Line',
          contact: 'Text HOME to 741741',
          website: 'https://crisistextline.org',
          description: 'Free, 24/7 support via text message',
          available: '24/7'
        }
      ]);
    }

    setSupportResources([
      {
        title: 'Professional Therapy',
        description: 'Connect with licensed mental health professionals',
        icon: <Psychology />,
        color: '#4caf50',
        resources: [
          { name: 'BetterHelp', url: 'https://betterhelp.com', description: 'Online therapy platform' },
          { name: 'Talkspace', url: 'https://talkspace.com', description: 'Text and video therapy' },
          { name: '7 Cups', url: 'https://7cups.com', description: 'Free emotional support' }
        ]
      },
      {
        title: 'Support Groups',
        description: 'Connect with others who understand your journey',
        icon: <Group />,
        color: '#2196f3',
        resources: [
          { name: 'NAMI Support Groups', url: 'https://nami.org', description: 'National Alliance on Mental Illness' },
          { name: 'Depression and Bipolar Support Alliance', url: 'https://dbsalliance.org', description: 'Peer support groups' },
          { name: 'Anxiety and Depression Association', url: 'https://adaa.org', description: 'Support for anxiety and depression' }
        ]
      },
      {
        title: 'Educational Resources',
        description: 'Learn more about mental health and wellness',
        icon: <Book />,
        color: '#9c27b0',
        resources: [
          { name: 'MentalHealth.gov', url: 'https://mentalhealth.gov', description: 'Government mental health information' },
          { name: 'Psychology Today', url: 'https://psychologytoday.com', description: 'Mental health articles and resources' },
          { name: 'Mind.org.uk', url: 'https://mind.org.uk', description: 'Mental health information and support' }
        ]
      }
    ]);

    setEducationalContent([
      {
        title: 'Understanding Anxiety',
        description: 'Learn about anxiety disorders and coping strategies',
        type: 'Article',
        duration: '5 min read',
        icon: <Book />
      },
      {
        title: 'Depression: Signs and Symptoms',
        description: 'Recognize the signs of depression and when to seek help',
        type: 'Video',
        duration: '8 min',
        icon: <VideoLibrary />
      },
      {
        title: 'Mindfulness Meditation Guide',
        description: 'Step-by-step guide to mindfulness meditation',
        type: 'Interactive',
        duration: '10 min',
        icon: <Psychology />
      },
      {
        title: 'Building Resilience',
        description: 'Develop emotional resilience and coping skills',
        type: 'Article',
        duration: '7 min read',
        icon: <Book />
      }
    ]);
  };

  const handleEmergencyCall = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleResourceClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: colors.primary.main, mb: 1 }}>
            🆘 Resources & Support
          </Typography>
          <Typography variant="h6" sx={{ color: colors.text.secondary, fontWeight: 400 }}>
            Find help, support, and educational resources for your mental health journey
          </Typography>
        </Box>
      </motion.div>

      {/* Crisis Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4, 
            background: colors.gradients.primary,
            color: colors.primary.contrastText,
            '& .MuiAlert-icon': { color: colors.primary.contrastText }
          }}
        >
          <AlertTitle sx={{ color: colors.primary.contrastText, fontWeight: 600 }}>
            🚨 Crisis Support Available 24/7
          </AlertTitle>
          If you're in immediate danger or experiencing thoughts of self-harm, please call <strong>988</strong> (Suicide Prevention Lifeline) or <strong>911</strong> immediately. You're not alone, and help is available.
        </Alert>
      </motion.div>

      <Grid container spacing={3}>
        {/* Emergency Resources */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ background: colors.gradients.primary, color: colors.primary.contrastText }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: colors.primary.main, mb: 3 }}>
                  Emergency Resources
                </Typography>

                <Grid container spacing={2}>
                  {emergencyResources.map((resource, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                      >
                        <Card sx={{ 
                          height: '100%',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                          }
                        }}>
                          <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Avatar sx={{ 
                              bgcolor: '#f44336', 
                              width: 60, 
                              height: 60, 
                              mx: 'auto', 
                              mb: 2 
                            }}>
                              <LocalHospital />
                            </Avatar>
                            
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {resource.name}
                            </Typography>
                            
                            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                              {resource.description}
                            </Typography>
                            
                            {resource.phone && (
                              <Button
                                variant="contained"
                                startIcon={<Call />}
                                onClick={() => handleEmergencyCall(resource.phone)}
                                sx={{
                                  background: colors.gradients.secondary,
                                  color: colors.neutral.darkGray,
                                  mb: 1,
                                  '&:hover': { background: colors.gradients.primary, color: colors.primary.contrastText }
                                }}
                                fullWidth
                              >
                                Call {resource.phone}
                              </Button>
                            )}
                            
                            {resource.contact && (
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#f44336', mb: 1 }}>
                                {resource.contact}
                              </Typography>
                            )}
                            
                            <Button
                              variant="outlined"
                              startIcon={<Language />}
                              onClick={() => handleResourceClick(resource.website)}
                              sx={{
                                borderColor: colors.primary.main,
                                color: colors.primary.main,
                                '&:hover': { borderColor: colors.primary.dark, background: colors.gradients.secondary }
                              }}
                              fullWidth
                            >
                              Visit Website
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Support Categories */}
        {supportResources.map((category, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
            >
              <Card sx={{ height: '100%', background: colors.gradients.primary, color: colors.primary.contrastText }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: category.color, mr: 2 }}>
                      {category.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: colors.primary.main }}>
                        {category.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        {category.description}
                      </Typography>
                    </Box>
                  </Box>

                  <List>
                    {category.resources.map((resource, resIndex) => (
                      <ListItem key={resIndex} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            bgcolor: category.color 
                          }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Link
                              href={resource.url}
                              target="_blank"
                              sx={{ 
                                color: colors.primary.main, 
                                textDecoration: 'none',
                                fontWeight: 500,
                                '&:hover': { textDecoration: 'underline' }
                              }}
                            >
                              {resource.name}
                            </Link>
                          }
                          secondary={resource.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}

        {/* Educational Content */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card sx={{ background: colors.gradients.primary, color: colors.primary.contrastText }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: colors.primary.main, mb: 3 }}>
                  Educational Resources
                </Typography>

                <Grid container spacing={2}>
                  {educationalContent.map((content, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                      >
                        <Card sx={{ 
                          height: '100%',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                          }
                        }}>
                          <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'center', 
                              mb: 2,
                              color: colors.primary.main
                            }}>
                              {content.icon}
                            </Box>
                            
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {content.title}
                            </Typography>
                            
                            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                              {content.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Chip
                                label={content.type}
                                size="small"
                                sx={{ backgroundColor: colors.gradients.secondary, color: colors.primary.main }}
                              />
                              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                                {content.duration}
                              </Typography>
                            </Box>
                            
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{
                                borderColor: colors.primary.main,
                                color: colors.primary.main,
                                '&:hover': { borderColor: colors.primary.dark, background: colors.gradients.secondary }
                              }}
                              fullWidth
                            >
                              Start Learning
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Safety Information */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card sx={{ 
              background: colors.gradients.primary,
              border: `2px solid ${colors.primary.main}`,
              color: colors.primary.contrastText
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Security sx={{ color: colors.primary.main, fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: colors.primary.main }}>
                      Safety & Privacy
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Your privacy and safety are our top priorities
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: colors.primary.main, mb: 2 }}>
                      Privacy Protection
                    </Typography>
                    <List>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.primary.main }} />
                        </ListItemIcon>
                        <ListItemText primary="All conversations are private and secure" />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.primary.main }} />
                        </ListItemIcon>
                        <ListItemText primary="Your data is encrypted and protected" />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.primary.main }} />
                        </ListItemIcon>
                        <ListItemText primary="You can export or delete your data anytime" />
                      </ListItem>
                    </List>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: colors.primary.main, mb: 2 }}>
                      Crisis Safety
                    </Typography>
                    <List>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.primary.main }} />
                        </ListItemIcon>
                        <ListItemText primary="Crisis detection and immediate support" />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.primary.main }} />
                        </ListItemIcon>
                        <ListItemText primary="Direct access to emergency resources" />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.primary.main }} />
                        </ListItemIcon>
                        <ListItemText primary="24/7 crisis hotline integration" />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Resources; 