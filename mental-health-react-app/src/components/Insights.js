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
import { colors } from '../theme';

const Insights = () => {
  const [userStats, setUserStats] = useState({});
  const [wellnessScore, setWellnessScore] = useState(0);
  const [conversationStats, setConversationStats] = useState({});
  const [moodTrends, setMoodTrends] = useState([]);
  const [activityStats, setActivityStats] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [wellnessAreas, setWellnessAreas] = useState([
    { name: 'Emotional', score: 0, icon: <EmojiEmotions />, color: colors.primary.main },
    { name: 'Physical', score: 0, icon: <Favorite />, color: colors.error.main },
    { name: 'Social', score: 0, icon: <Psychology />, color: colors.secondary.main },
    { name: 'Spiritual', score: 0, icon: <Star />, color: colors.accent.main }
  ]);

  useEffect(() => {
    loadUserInsights();
  }, []);

  const loadUserInsights = async () => {
    try {
      // Fetch user stats from backend
      const response = await fetch('http://localhost:5000/user-stats/Akashpatel2609');
      const data = await response.json();
      setUserStats(data);
      setWellnessScore(data.wellness_score ?? 0);
      setWellnessAreas(data.wellness_areas ?? [
        { name: 'Emotional', score: 0, icon: <EmojiEmotions />, color: colors.primary.main },
        { name: 'Physical', score: 0, icon: <Favorite />, color: colors.error.main },
        { name: 'Social', score: 0, icon: <Psychology />, color: colors.secondary.main },
        { name: 'Spiritual', score: 0, icon: <Star />, color: colors.accent.main }
      ]);
      setConversationStats(data.conversation_stats ?? {
        totalMessages: 0,
        averageResponseTime: '0s',
        conversationStreak: 0,
        longestConversation: 0,
        favoriteTopics: []
      });
      setMoodTrends(data.mood_trends ?? []);
      setActivityStats(data.activity_stats ?? {
        totalActivities: 0,
        completedThisWeek: 0,
        favoriteActivity: '',
        completionRate: 0,
        weeklyGoal: 0
      });
      setRecommendations(data.recommendations ?? []);
    } catch (error) {
      console.error('Error loading user insights:', error);
      setUserStats({
        total_conversations: 0,
        activity_count: 0,
        emotions_count: {},
        most_common_emotion: ''
      });
      setWellnessScore(0);
      setWellnessAreas([
        { name: 'Emotional', score: 0, icon: <EmojiEmotions />, color: colors.primary.main },
        { name: 'Physical', score: 0, icon: <Favorite />, color: colors.error.main },
        { name: 'Social', score: 0, icon: <Psychology />, color: colors.secondary.main },
        { name: 'Spiritual', score: 0, icon: <Star />, color: colors.accent.main }
      ]);
      setConversationStats({
        totalMessages: 0,
        averageResponseTime: '0s',
        conversationStreak: 0,
        longestConversation: 0,
        favoriteTopics: []
      });
      setMoodTrends([]);
      setActivityStats({
        totalActivities: 0,
        completedThisWeek: 0,
        favoriteActivity: '',
        completionRate: 0,
        weeklyGoal: 0
      });
      setRecommendations([]);
    }
  };

  const getWellnessColor = (score) => {
    if (score >= 80) return colors.primary.main;
    if (score >= 60) return colors.accent.main;
    return colors.error.main;
  };

  const getWellnessLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Attention';
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
          <Typography variant="h3" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>
            📊 Insights & Analytics
          </Typography>
          <Typography variant="h6" sx={{ color: colors.text.secondary, fontWeight: 400 }}>
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
              background: colors.gradients.primary,
              color: colors.primary.contrastText
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
            <Card sx={{ height: '100%', background: colors.gradients.secondary }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text.primary, mb: 3 }}>
                  Wellness Areas Breakdown
                </Typography>
                
                {wellnessAreas.length === 0 || wellnessAreas.every(a => a.score === 0) ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="body1" color="text.secondary">No wellness area data yet.</Typography>
                  </Box>
                ) : (
                  wellnessAreas.map((area, index) => (
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
                        <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: 600 }}>
                          {area.score}/100
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={area.score}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: colors.neutral.gray,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: area.color,
                            borderRadius: 5
                          }
                        }}
                      />
                    </Box>
                  ))
                )}
                
                <Box sx={{ mt: 4, p: 2, bgcolor: colors.primary.light, borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: 500 }}>
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
            <Card sx={{ height: '100%', background: colors.gradients.secondary }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text.primary, mb: 3 }}>
                  Conversation Analytics
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: colors.neutral.white, borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary }}>
                        {conversationStats.totalMessages}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Total Messages
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: colors.neutral.white, borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: colors.primary.main }}>
                        {conversationStats.conversationStreak}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Day Streak
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: colors.neutral.white, borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: colors.accent.main }}>
                        {conversationStats.averageResponseTime}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Avg Response
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: colors.neutral.white, borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: colors.accent.dark }}>
                        {conversationStats.longestConversation}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Longest Chat
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text.primary, mb: 2 }}>
                    Favorite Topics
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {conversationStats.favoriteTopics && conversationStats.favoriteTopics.length > 0 ? (
                      conversationStats.favoriteTopics.map((topic, index) => (
                        <Chip
                          key={index}
                          label={topic}
                          size="small"
                          sx={{ bgcolor: colors.primary.light, color: colors.text.primary }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">No topics yet.</Typography>
                    )}
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
            <Card sx={{ height: '100%', background: colors.gradients.secondary }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text.primary, mb: 3 }}>
                  Weekly Mood Trends
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  {moodTrends.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No mood trends yet.</Typography>
                  ) : (
                    moodTrends.map((day, index) => (
                      <Box key={day.day} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 40 }}>
                            {day.day}
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: 600 }}>
                            {day.score}/5
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(day.score / 5) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: colors.neutral.gray,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: day.score >= 4 ? colors.primary.main : day.score >= 3 ? colors.accent.main : colors.error.main,
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>
                    ))
                  )}
                </Box>
                
                <Box sx={{ p: 2, bgcolor: colors.primary.light, borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: colors.primary.main, fontWeight: 500 }}>
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
            <Card sx={{ height: '100%', background: colors.gradients.secondary }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text.primary, mb: 3 }}>
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
                        color: colors.neutral.gray,
                        '& .MuiCircularProgress-circle': {
                          strokeLinecap: 'round',
                          color: colors.primary.main
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
                      <Typography variant="h6" sx={{ fontWeight: 700, color: colors.primary.main }}>
                        {activityStats.completionRate}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Completion Rate
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      {activityStats.completedThisWeek}/{activityStats.weeklyGoal} this week
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    Favorite Activity
                  </Typography>
                  {activityStats.favoriteActivity ? (
                    <Chip
                      label={activityStats.favoriteActivity}
                      icon={<Favorite />}
                      sx={{ bgcolor: colors.primary.light, color: colors.primary.main }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">No activity yet.</Typography>
                  )}
                </Box>
                
                <Box sx={{ p: 2, bgcolor: colors.primary.light, borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: 500 }}>
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
            <Card sx={{ height: '100%', background: colors.gradients.secondary }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text.primary, mb: 3 }}>
                  Personalized Recommendations
                </Typography>
                
                <List>
                  {recommendations.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 2 }}>No recommendations yet.</Typography>
                  ) : (
                    recommendations.map((rec, index) => (
                      <ListItem key={index} sx={{ px: 0, mb: 2 }}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: rec.color, width: 40, height: 40 }}>
                            {rec.icon}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 600, color: colors.text.primary }}>
                              {rec.title}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 0.5 }}>
                              {rec.description}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))
                  )}
                </List>
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: colors.primary.main,
                      color: colors.primary.main,
                      '&:hover': { borderColor: colors.primary.dark, bgcolor: colors.primary.light }
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