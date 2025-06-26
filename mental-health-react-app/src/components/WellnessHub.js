import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
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
  ListItemButton,
  Badge
} from '@mui/material';
import {
  Spa,
  Favorite,
  Psychology,
  TrendingUp,
  PlayArrow,
  CheckCircle,
  EmojiEmotions,
  SelfImprovement,
  LocalHospital,
  Star,
  Timer,
  FavoriteBorder
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const WellnessHub = () => {
  const [dailyTip, setDailyTip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [wellnessStats, setWellnessStats] = useState({
    emotional: 75,
    physical: 68,
    social: 82,
    spiritual: 71
  });

  useEffect(() => {
    // Fetch daily wellness tip
    fetchDailyTip();
    // Load activities
    loadActivities();
  }, []);

  const fetchDailyTip = async () => {
    try {
      const response = await fetch('http://localhost:5000/wellness-tips');
      const data = await response.json();
      setDailyTip(data.daily_tip);
    } catch (error) {
      console.error('Error fetching wellness tip:', error);
      // Fallback tip
      setDailyTip({
        tip: 'Start your day with intention. Take 5 minutes to set a positive intention for today.',
        activity: 'Try our breathing exercise to center yourself.',
        emoji: '🌟',
        focus: 'Mindfulness'
      });
    }
  };

  const loadActivities = () => {
    setActivities([
      {
        id: 1,
        title: 'Breathing Exercise',
        description: '5-minute guided breathing for stress relief',
        duration: '5 min',
        icon: <SelfImprovement />,
        color: '#4caf50',
        completed: false
      },
      {
        id: 2,
        title: 'Gratitude Practice',
        description: 'Write down 3 things you\'re grateful for',
        duration: '3 min',
        icon: <Favorite />,
        color: '#e91e63',
        completed: false
      },
      {
        id: 3,
        title: 'Mindful Meditation',
        description: 'Guided meditation for inner peace',
        duration: '10 min',
        icon: <Psychology />,
        color: '#9c27b0',
        completed: false
      },
      {
        id: 4,
        title: 'Body Scan',
        description: 'Progressive muscle relaxation',
        duration: '8 min',
        icon: <Spa />,
        color: '#2196f3',
        completed: false
      }
    ]);
  };

  const handleActivityComplete = (activityId) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };

  const getProgressColor = (value) => {
    if (value >= 80) return '#4caf50';
    if (value >= 60) return '#ff9800';
    return '#f44336';
  };

  const wellnessAreas = [
    { name: 'Emotional', value: wellnessStats.emotional, icon: <EmojiEmotions /> },
    { name: 'Physical', value: wellnessStats.physical, icon: <Favorite /> },
    { name: 'Social', value: wellnessStats.social, icon: <Psychology /> },
    { name: 'Spiritual', value: wellnessStats.spiritual, icon: <Spa /> }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea', mb: 1 }}>
            🌸 Wellness Hub
          </Typography>
          <Typography variant="h6" sx={{ color: '#888', fontWeight: 400 }}>
            Your daily sanctuary for mental wellness and self-care
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Daily Inspiration Card */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card sx={{ 
              height: '100%', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                    {dailyTip?.emoji || '🌟'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Daily Inspiration
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {dailyTip?.focus || 'Mindfulness'}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, lineHeight: 1.4 }}>
                  {dailyTip?.tip || 'Start your day with intention and mindfulness.'}
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  {dailyTip?.activity || 'Try our guided breathing exercise to center yourself.'}
                </Typography>
                
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  Start Activity
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Wellness Progress */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea', mb: 3 }}>
                  Your Wellness Progress
                </Typography>
                
                {wellnessAreas.map((area, index) => (
                  <Box key={area.name} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ color: getProgressColor(area.value), mr: 1 }}>
                          {area.icon}
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {area.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#888', fontWeight: 600 }}>
                        {area.value}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={area.value}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(102,126,234,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getProgressColor(area.value),
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                ))}
                
                <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(102,126,234,0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 500 }}>
                    💡 Tip: Focus on your lowest area to improve overall wellness
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Quick Activities */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea', mb: 3 }}>
                  Quick Wellness Activities
                </Typography>
                
                <Grid container spacing={2}>
                  {activities.map((activity, index) => (
                    <Grid item xs={12} sm={6} md={3} key={activity.id}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                      >
                        <Card
                          sx={{
                            height: '100%',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'center', 
                              mb: 2,
                              color: activity.color
                            }}>
                              {activity.icon}
                            </Box>
                            
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {activity.title}
                            </Typography>
                            
                            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                              {activity.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Chip
                                label={activity.duration}
                                size="small"
                                sx={{ bgcolor: 'rgba(102,126,234,0.1)', color: '#667eea' }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => handleActivityComplete(activity.id)}
                                sx={{ color: activity.completed ? '#4caf50' : '#ccc' }}
                              >
                                {activity.completed ? <CheckCircle /> : <FavoriteBorder />}
                              </IconButton>
                            </Box>
                            
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<PlayArrow />}
                              sx={{
                                borderColor: activity.color,
                                color: activity.color,
                                '&:hover': { borderColor: activity.color, bgcolor: `${activity.color}10` }
                              }}
                              fullWidth
                            >
                              Start
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

        {/* Weekly Challenge */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              color: 'white'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Star sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Weekly Challenge
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Practice gratitude daily
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                  This week, write down one thing you're grateful for each day. 
                  Research shows gratitude practice can improve mood and reduce stress.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ mr: 2 }}>
                    Progress: 3/7 days
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={42}
                    sx={{
                      flexGrow: 1,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'white'
                      }
                    }}
                  />
                </Box>
                
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  Log Today's Gratitude
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Wellness Tips */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea', mb: 3 }}>
                  Wellness Tips
                </Typography>
                
                <List>
                  {[
                    'Take 5 deep breaths when feeling overwhelmed',
                    'Practice self-compassion - be kind to yourself',
                    'Connect with a friend or family member today',
                    'Get 7-9 hours of quality sleep tonight',
                    'Move your body for at least 30 minutes'
                  ].map((tip, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: '#667eea' 
                        }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={tip}
                        sx={{ '& .MuiListItemText-primary': { fontSize: '0.95rem' } }}
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(102,126,234,0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 500 }}>
                    💙 Remember: Small daily practices lead to big changes in your mental wellness
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WellnessHub; 