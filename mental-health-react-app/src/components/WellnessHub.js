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
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery
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
  FavoriteBorder,
  Pause,
  Stop,
  FitnessCenter,
  MusicNote,
  Book,
  Nature
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const WellnessHub = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [dailyTip, setDailyTip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [wellnessStats, setWellnessStats] = useState({
    emotional: 75,
    physical: 68,
    social: 82,
    spiritual: 71
  });
  const [meditationTime, setMeditationTime] = useState(300); // 5 minutes
  const [isMeditating, setIsMeditating] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingTime, setBreathingTime] = useState(4);
  const [isBreathing, setIsBreathing] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityDialog, setActivityDialog] = useState(false);
  const [completedActivities, setCompletedActivities] = useState([]);

  useEffect(() => {
    // Fetch daily wellness tip
    fetchDailyTip();
    // Load activities
    loadActivities();
  }, []);

  // Meditation timer
  useEffect(() => {
    let interval;
    if (isMeditating && meditationTime > 0) {
      interval = setInterval(() => {
        setMeditationTime(prev => prev - 1);
      }, 1000);
    } else if (meditationTime === 0) {
      setIsMeditating(false);
      setMeditationTime(300);
    }
    return () => clearInterval(interval);
  }, [isMeditating, meditationTime]);

  // Breathing exercise
  useEffect(() => {
    let interval;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathingTime(prev => {
          if (prev <= 1) {
            setBreathingPhase(prevPhase => 
              prevPhase === 'inhale' ? 'hold' : 
              prevPhase === 'hold' ? 'exhale' : 'inhale'
            );
            return breathingPhase === 'inhale' ? 4 : 
                   breathingPhase === 'hold' ? 4 : 6;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing, breathingPhase]);

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

  const handleActivityComplete = (activity) => {
    setCompletedActivities(prev => [...prev, activity.id]);
    setActivityDialog(false);
    // Here you would typically save to backend
    console.log(`Completed activity: ${activity.title}`);
  };

  const openActivityDialog = (activity) => {
    setSelectedActivity(activity);
    setActivityDialog(true);
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

  const startMeditation = () => {
    setIsMeditating(true);
  };

  const pauseMeditation = () => {
    setIsMeditating(false);
  };

  const stopMeditation = () => {
    setIsMeditating(false);
    setMeditationTime(300);
  };

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathingPhase('inhale');
    setBreathingTime(4);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setBreathingPhase('inhale');
    setBreathingTime(4);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const wellnessActivities = [
    {
      id: 1,
      title: 'Guided Meditation',
      description: 'A 5-minute guided meditation for beginners',
      duration: '5 min',
      icon: <SelfImprovement />,
      color: '#667eea',
      instructions: [
        'Find a comfortable seated position',
        'Close your eyes gently',
        'Focus on your natural breath',
        'When your mind wanders, gently return to your breath',
        'Continue for 5 minutes'
      ]
    },
    {
      id: 2,
      title: 'Progressive Muscle Relaxation',
      description: 'Systematically relax each muscle group',
      duration: '10 min',
      icon: <FitnessCenter />,
      color: '#e91e63',
      instructions: [
        'Start with your toes and work up to your head',
        'Tense each muscle group for 5 seconds',
        'Release and feel the relaxation for 10 seconds',
        'Move to the next muscle group',
        'Complete the full body scan'
      ]
    },
    {
      id: 3,
      title: 'Mindful Walking',
      description: 'Practice mindfulness while walking',
      duration: '15 min',
      icon: <Nature />,
      color: '#4caf50',
      instructions: [
        'Walk at a natural, comfortable pace',
        'Focus on the sensation of your feet touching the ground',
        'Notice the movement of your body',
        'Observe your surroundings without judgment',
        'If your mind wanders, return to the walking sensation'
      ]
    },
    {
      id: 4,
      title: 'Gratitude Journaling',
      description: 'Write down three things you\'re grateful for',
      duration: '5 min',
      icon: <Book />,
      color: '#ff9800',
      instructions: [
        'Find a quiet space to write',
        'Think of three things you\'re grateful for today',
        'Write them down in detail',
        'Reflect on why each brings you gratitude',
        'Read them back to yourself'
      ]
    }
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
                                onClick={() => openActivityDialog(activity)}
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

      {/* Meditation Timer */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Timer sx={{ fontSize: 30, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Meditation Timer
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ textAlign: 'center', mb: 2, fontWeight: 700 }}>
              {formatTime(meditationTime)}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(meditationTime / 300) * 100} 
              sx={{ height: 8, borderRadius: 5, mb: 2, background: 'rgba(255,255,255,0.3)' }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              {!isMeditating ? (
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={startMeditation}
                  sx={{ background: 'rgba(255,255,255,0.2)', '&:hover': { background: 'rgba(255,255,255,0.3)' } }}
                >
                  Start
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Pause />}
                    onClick={pauseMeditation}
                    sx={{ background: 'rgba(255,255,255,0.2)', '&:hover': { background: 'rgba(255,255,255,0.3)' } }}
                  >
                    Pause
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Stop />}
                    onClick={stopMeditation}
                    sx={{ background: 'rgba(255,255,255,0.2)', '&:hover': { background: 'rgba(255,255,255,0.3)' } }}
                  >
                    Stop
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Breathing Exercise */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)', color: 'white' }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Favorite sx={{ fontSize: 30, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Breathing Exercise
              </Typography>
            </Box>
            
            <motion.div
              animate={{
                scale: isBreathing ? [1, 1.2, 1] : 1,
                opacity: isBreathing ? [0.7, 1, 0.7] : 1
              }}
              transition={{
                duration: breathingPhase === 'inhale' ? 4 : breathingPhase === 'hold' ? 4 : 6,
                repeat: isBreathing ? Infinity : 0
              }}
            >
              <Typography variant="h2" sx={{ mb: 1, fontWeight: 700 }}>
                {breathingPhase.toUpperCase()}
              </Typography>
            </motion.div>
            
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              {breathingTime}s
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              {breathingPhase === 'inhale' ? 'Breathe in slowly through your nose' :
               breathingPhase === 'hold' ? 'Hold your breath gently' :
               'Breathe out slowly through your mouth'}
            </Typography>
            
            <Button
              variant="contained"
              onClick={isBreathing ? stopBreathing : startBreathing}
              sx={{ 
                background: 'rgba(255,255,255,0.2)', 
                '&:hover': { background: 'rgba(255,255,255,0.3)' }
              }}
            >
              {isBreathing ? 'Stop' : 'Start'} Breathing
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Wellness Activities */}
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
          Wellness Activities
        </Typography>
        <Grid container spacing={2}>
          {wellnessActivities.map((activity) => (
            <Grid item xs={12} sm={6} md={3} key={activity.id}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: 4 }
                  }}
                  onClick={() => openActivityDialog(activity)}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
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
                    <Chip 
                      label={activity.duration} 
                      size="small" 
                      sx={{ background: activity.color, color: 'white' }}
                    />
                    {completedActivities.includes(activity.id) && (
                      <Chip 
                        label="Completed" 
                        size="small" 
                        sx={{ ml: 1, background: '#4caf50', color: 'white' }}
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Activity Instructions Dialog */}
      <Dialog 
        open={activityDialog} 
        onClose={() => setActivityDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ background: selectedActivity?.color, color: 'white' }}>
          {selectedActivity?.title}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {selectedActivity?.description}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Instructions:
          </Typography>
          <List>
            {selectedActivity?.instructions.map((instruction, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <Typography variant="body2" sx={{ color: selectedActivity?.color, fontWeight: 600 }}>
                    {index + 1}.
                  </Typography>
                </ListItemIcon>
                <ListItemText primary={instruction} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setActivityDialog(false)}>
            Close
          </Button>
          <Button 
            variant="contained"
            onClick={() => handleActivityComplete(selectedActivity)}
            sx={{ background: selectedActivity?.color }}
          >
            Mark as Complete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WellnessHub; 