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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  Psychology,
  Favorite,
  EmojiEmotions,
  Star
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Insights = () => {
  const [userStats, setUserStats] = useState({});
  const [wellnessScore, setWellnessScore] = useState(0);
  const [conversationStats, setConversationStats] = useState({});
  const [moodTrends, setMoodTrends] = useState([]);
  const [activityStats, setActivityStats] = useState({});
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    loadUserInsights();
  }, []);

  const loadUserInsights = async () => {
    try {
      // Fetch user stats from backend
      const response = await fetch('http://localhost:5000/user-stats/Akashpatel2609');
      const data = await response.json();
      setUserStats(data);
      setWellnessScore(data.wellness_score || 72);
    } catch (error) {
      console.error('Error loading user insights:', error);
      // Fallback data
      setUserStats({
        total_conversations: 45,
        activity_count: 12,
        emotions_count: { happiness: 15, calm: 12, neutral: 10, sadness: 5, anxiety: 3 },
        most_common_emotion: 'happiness'
      });
      setWellnessScore(72);
    }

    // Set conversation stats
    setConversationStats({
      totalMessages: 156,
      averageResponseTime: '2.3s',
      conversationStreak: 7,
      longestConversation: 23,
      favoriteTopics: ['Stress Management', 'Self-Care', 'Relationships']
    });

    // Set mood trends
    setMoodTrends([
      { day: 'Mon', score: 4.2, mood: 'happy' },
      { day: 'Tue', score: 3.8, mood: 'calm' },
      { day: 'Wed', score: 4.5, mood: 'happy' },
      { day: 'Thu', score: 3.2, mood: 'neutral' },
      { day: 'Fri', score: 4.1, mood: 'happy' },
      { day: 'Sat', score: 4.3, mood: 'happy' },
      { day: 'Sun', score: 3.9, mood: 'calm' }
    ]);

    // Set activity stats
    setActivityStats({
      totalActivities: 12,
      completedThisWeek: 5,
      favoriteActivity: 'Breathing Exercise',
      completionRate: 83,
      weeklyGoal: 7
    });

    // Set recommendations
    setRecommendations([
      {
        type: 'improvement',
        title: 'Increase Physical Activity',
        description: 'Your physical wellness score is lower than other areas. Try adding 30 minutes of exercise to your routine.',
        icon: <Favorite />,
        color: '#4caf50'
      },
      {
        type: 'maintenance',
        title: 'Keep Up the Great Work',
        description: 'Your emotional wellness is excellent! Continue practicing gratitude and mindfulness.',
        icon: <EmojiEmotions />,
        color: '#2196f3'
      },
      {
        type: 'goal',
        title: 'Complete Weekly Challenge',
        description: 'You\'re 2 activities away from completing this week\'s wellness challenge.',
        icon: <Star />,
        color: '#ff9800'
      }
    ]);
  };

  const getWellnessColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  const getWellnessLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Attention';
  };

  const wellnessAreas = [
    { name: 'Emotional', score: 85, icon: <EmojiEmotions />, color: '#4caf50' },
    { name: 'Physical', score: 68, icon: <Favorite />, color: '#f44336' },
    { name: 'Social', score: 82, icon: <Psychology />, color: '#2196f3' },
    { name: 'Spiritual', score: 71, icon: <Star />, color: '#9c27b0' }
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
            📊 Insights & Analytics
          </Typography>
          <Typography variant="h6" sx={{ color: '#888', fontWeight: 400 }}>
            Discover patterns and track your mental wellness journey
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Overall Wellness Score */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card sx={{ 
              height: '100%', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                      variant="determinate"
                      value={wellnessScore}
                      size={120}
                      thickness={8}
                      sx={{
                        color: 'rgba(255,255,255,0.3)',
                        '& .MuiCircularProgress-circle': {
                          strokeLinecap: 'round',
                          color: 'white'
                        }
                      }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {wellnessScore}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Overall Wellness Score
                </Typography>
                
                <Chip
                  label={getWellnessLabel(wellnessScore)}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600,
                    mb: 2
                  }}
                />
                
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Your wellness score is based on conversations, activities, and mood tracking
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Wellness Areas Breakdown */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea', mb: 3 }}>
                  Wellness Areas Breakdown
                </Typography>
                
                {wellnessAreas.map((area, index) => (
                  <Box key={area.name} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ color: area.color, mr: 2 }}>
                          {area.icon}
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {area.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#888', fontWeight: 600 }}>
                        {area.score}/100
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={area.score}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: 'rgba(102,126,234,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: area.color,
                          borderRadius: 5
                        }
                      }}
                    />
                  </Box>
                ))}
                
                <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(102,126,234,0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 500 }}>
                    💡 Focus on improving your Physical wellness to boost your overall score
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Conversation Analytics */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea', mb: 3 }}>
                  Conversation Analytics
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                        {conversationStats.totalMessages}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Total Messages
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50' }}>
                        {conversationStats.conversationStreak}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Day Streak
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800' }}>
                        {conversationStats.averageResponseTime}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Avg Response
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#9c27b0' }}>
                        {conversationStats.longestConversation}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Longest Chat
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#667eea', mb: 2 }}>
                    Favorite Topics
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {conversationStats.favoriteTopics?.map((topic, index) => (
                      <Chip
                        key={index}
                        label={topic}
                        size="small"
                        sx={{ bgcolor: 'rgba(102,126,234,0.1)', color: '#667eea' }}
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Mood Trends */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea', mb: 3 }}>
                  Weekly Mood Trends
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  {moodTrends.map((day, index) => (
                    <Box key={day.day} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 40 }}>
                          {day.day}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888', fontWeight: 600 }}>
                          {day.score}/5
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(day.score / 5) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'rgba(102,126,234,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: day.score >= 4 ? '#4caf50' : day.score >= 3 ? '#ff9800' : '#f44336',
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
                
                <Box sx={{ p: 2, bgcolor: 'rgba(76,175,80,0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 500 }}>
                    📈 Your mood has been consistently positive this week!
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Activity Statistics */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea', mb: 3 }}>
                  Activity Statistics
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mr: 3 }}>
                    <CircularProgress
                      variant="determinate"
                      value={activityStats.completionRate}
                      size={80}
                      thickness={6}
                      sx={{
                        color: 'rgba(102,126,234,0.1)',
                        '& .MuiCircularProgress-circle': {
                          strokeLinecap: 'round',
                          color: '#4caf50'
                        }
                      }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                        {activityStats.completionRate}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Completion Rate
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                      {activityStats.completedThisWeek}/{activityStats.weeklyGoal} this week
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    Favorite Activity
                  </Typography>
                  <Chip
                    label={activityStats.favoriteActivity}
                    icon={<Favorite />}
                    sx={{ bgcolor: 'rgba(76,175,80,0.1)', color: '#4caf50' }}
                  />
                </Box>
                
                <Box sx={{ p: 2, bgcolor: 'rgba(102,126,234,0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 500 }}>
                    🎯 You're on track to complete your weekly goal!
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Personalized Recommendations */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea', mb: 3 }}>
                  Personalized Recommendations
                </Typography>
                
                <List>
                  {recommendations.map((rec, index) => (
                    <ListItem key={index} sx={{ px: 0, mb: 2 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: rec.color, width: 40, height: 40 }}>
                          {rec.icon}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                            {rec.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                            {rec.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': { borderColor: '#5a6fd8', bgcolor: 'rgba(102,126,234,0.05)' }
                    }}
                  >
                    View All Recommendations
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Insights; 