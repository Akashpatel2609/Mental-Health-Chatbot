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
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Mood,
  TrendingUp,
  CalendarToday,
  Insights,
  Favorite,
  SentimentSatisfied,
  SentimentNeutral,
  SentimentDissatisfied,
  EmojiEmotions,
  Psychology,
  Timeline,
  CheckCircle,
  Add,
  Close,
  Edit
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MoodTracker = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [moodDialog, setMoodDialog] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [editingMood, setEditingMood] = useState(null);
  const [weeklyMoods, setWeeklyMoods] = useState([]);
  const [moodInsights, setMoodInsights] = useState({});

  const moodOptions = [
    { value: 5, label: 'Excellent', icon: <SentimentSatisfied />, color: '#4caf50', emoji: '😊' },
    { value: 4, label: 'Good', icon: <SentimentSatisfied />, color: '#8bc34a', emoji: '🙂' },
    { value: 3, label: 'Okay', icon: <SentimentNeutral />, color: '#ffc107', emoji: '😐' },
    { value: 2, label: 'Bad', icon: <SentimentDissatisfied />, color: '#ff9800', emoji: '😔' },
    { value: 1, label: 'Terrible', icon: <SentimentDissatisfied />, color: '#f44336', emoji: '😢' }
  ];

  useEffect(() => {
    loadMoodHistory();
    generateWeeklyMoods();
    calculateMoodInsights();
  }, []);

  const loadMoodHistory = () => {
    // Simulate loading mood history
    const history = [
      { date: '2025-06-25', mood: 'happy', note: 'Had a great conversation with a friend' },
      { date: '2025-06-24', mood: 'calm', note: 'Meditation session was very relaxing' },
      { date: '2025-06-23', mood: 'neutral', note: 'Regular day at work' },
      { date: '2025-06-22', mood: 'sad', note: 'Feeling a bit down today' },
      { date: '2025-06-21', mood: 'happy', note: 'Completed a challenging project' },
      { date: '2025-06-20', mood: 'anxious', note: 'Work stress getting to me' },
      { date: '2025-06-19', mood: 'calm', note: 'Spent time in nature' }
    ];
    setMoodHistory(history);
  };

  const generateWeeklyMoods = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekly = days.map((day, index) => ({
      day,
      mood: moodOptions[Math.floor(Math.random() * moodOptions.length)],
      score: Math.floor(Math.random() * 5) + 1
    }));
    setWeeklyMoods(weekly);
  };

  const calculateMoodInsights = () => {
    const insights = {
      averageMood: 3.4,
      mostFrequentMood: 'calm',
      moodStreak: 3,
      improvement: '+15%'
    };
    setMoodInsights(insights);
  };

  const openMoodDialog = () => {
    setMoodDialog(true);
    setSelectedMood(null);
    setMoodNote('');
  };

  const closeMoodDialog = () => {
    setMoodDialog(false);
    setSelectedMood(null);
    setMoodNote('');
    setEditingMood(null);
  };

  const selectMood = (mood) => {
    setSelectedMood(mood);
  };

  const saveMood = () => {
    if (!selectedMood) return;

    const newMoodEntry = {
      id: editingMood ? editingMood.id : Date.now(),
      mood: selectedMood,
      note: moodNote,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    if (editingMood) {
      // Update existing mood entry
      setMoodHistory(prev => 
        prev.map(entry => 
          entry.id === editingMood.id ? newMoodEntry : entry
        )
      );
    } else {
      // Add new mood entry
      setMoodHistory(prev => [newMoodEntry, ...prev]);
    }

    closeMoodDialog();
  };

  const editMood = (moodEntry) => {
    setEditingMood(moodEntry);
    setSelectedMood(moodEntry.mood);
    setMoodNote(moodEntry.note);
    setMoodDialog(true);
  };

  const deleteMood = (moodId) => {
    setMoodHistory(prev => prev.filter(entry => entry.id !== moodId));
  };

  const getMoodStats = () => {
    if (moodHistory.length === 0) return { average: 0, trend: 'neutral', total: 0 };

    const recentMoods = moodHistory.slice(0, 7); // Last 7 entries
    const average = recentMoods.reduce((sum, entry) => sum + entry.mood.value, 0) / recentMoods.length;
    
    let trend = 'neutral';
    if (recentMoods.length >= 2) {
      const firstAvg = moodHistory.slice(-7, -3).reduce((sum, entry) => sum + entry.mood.value, 0) / 4;
      const secondAvg = recentMoods.slice(0, 4).reduce((sum, entry) => sum + entry.mood.value, 0) / 4;
      trend = secondAvg > firstAvg ? 'improving' : secondAvg < firstAvg ? 'declining' : 'stable';
    }

    return {
      average: Math.round(average * 10) / 10,
      trend,
      total: moodHistory.length
    };
  };

  const getMoodColor = (value) => {
    const mood = moodOptions.find(m => m.value === value);
    return mood ? mood.color : '#ccc';
  };

  const getMoodEmoji = (value) => {
    const mood = moodOptions.find(m => m.value === value);
    return mood ? mood.emoji : '😐';
  };

  const moodStats = getMoodStats();

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
            😊 Mood Tracker
          </Typography>
          <Typography variant="h6" sx={{ color: '#888', fontWeight: 400 }}>
            Track your emotional journey and discover patterns
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Today's Mood Selection */}
        <Grid item xs={12} md={6}>
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
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                    <Mood />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      How are you feeling today?
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {moodOptions.map((mood, index) => (
                    <Grid item xs={6} sm={4} key={mood.value}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <Button
                          variant={selectedMood?.value === mood.value ? 'contained' : 'outlined'}
                          onClick={() => selectMood(mood)}
                          sx={{
                            width: '100%',
                            height: 80,
                            flexDirection: 'column',
                            borderColor: 'rgba(255,255,255,0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(255,255,255,0.5)',
                              bgcolor: 'rgba(255,255,255,0.1)'
                            },
                            '&.Mui-selected': {
                              bgcolor: 'rgba(255,255,255,0.2)',
                              borderColor: 'white'
                            }
                          }}
                        >
                          <Typography variant="h4" sx={{ mb: 1 }}>
                            {mood.emoji}
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            {mood.label}
                          </Typography>
                        </Button>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                <Button
                  variant="contained"
                  onClick={openMoodDialog}
                  disabled={!selectedMood}
                  startIcon={<CheckCircle />}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                    '&:disabled': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                  fullWidth
                >
                  Log Mood
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Weekly Mood Trends */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea', mb: 3 }}>
                  Weekly Mood Trends
                </Typography>

                <Box sx={{ mb: 4 }}>
                  {weeklyMoods.map((day, index) => (
                    <Box key={day.day} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 40 }}>
                          {day.day}
                        </Typography>
                        <Typography variant="h5" sx={{ mr: 2 }}>
                          {day.mood.emoji}
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
                            bgcolor: day.mood.color,
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ p: 2, bgcolor: 'rgba(102,126,234,0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 500 }}>
                    📈 Your mood has improved by 15% this week!
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Mood Insights */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea', mb: 3 }}>
                  Mood Insights
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp sx={{ color: '#4caf50', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Average Mood
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: '#4caf50' }}>
                        {moodStats.average}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmojiEmotions sx={{ color: '#9c27b0', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Most Frequent Mood
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#9c27b0' }}>
                        {getMoodEmoji(moodStats.mostFrequentMood)} {moodStats.mostFrequentMood}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Timeline sx={{ color: '#ff9800', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Current Streak
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#ff9800' }}>
                        {moodStats.moodStreak} days
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ p: 2, bgcolor: 'rgba(76,175,80,0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 500 }}>
                    🎉 {moodStats.improvement} improvement this month!
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Mood History */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea', mb: 3 }}>
                  Recent Mood History
                </Typography>

                <List>
                  {moodHistory.slice(0, 7).map((entry, index) => (
                    <motion.div
                      key={entry.date}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <ListItem sx={{ 
                        mb: 1, 
                        bgcolor: 'white', 
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}>
                        <ListItemIcon>
                          <Avatar sx={{ 
                            bgcolor: getMoodColor(entry.mood.value),
                            width: 40,
                            height: 40
                          }}>
                            {getMoodEmoji(entry.mood.value)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {new Date(entry.date).toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </Typography>
                              <Chip
                                label={entry.mood.label}
                                size="small"
                                sx={{ 
                                  bgcolor: `${getMoodColor(entry.mood.value)}20`,
                                  color: getMoodColor(entry.mood.value),
                                  fontWeight: 500
                                }}
                              />
                            </Box>
                          }
                          secondary={entry.note}
                        />
                      </ListItem>
                    </motion.div>
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
                    View Full History
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Mood Logging Dialog */}
      <Dialog 
        open={moodDialog} 
        onClose={closeMoodDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ background: selectedMood?.color || '#667eea', color: 'white' }}>
          {editingMood ? 'Edit Mood Entry' : 'Log Your Mood'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {editingMood ? 'Update your mood entry:' : 'How are you feeling right now?'}
          </Typography>
          
          {/* Mood Selection */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Select Mood:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            {moodOptions.map((mood) => (
              <motion.div
                key={mood.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedMood?.value === mood.value ? "contained" : "outlined"}
                  onClick={() => selectMood(mood)}
                  sx={{
                    borderColor: mood.color,
                    color: selectedMood?.value === mood.value ? 'white' : mood.color,
                    background: selectedMood?.value === mood.value ? mood.color : 'transparent',
                    '&:hover': { 
                      borderColor: mood.color, 
                      background: selectedMood?.value === mood.value ? mood.color : `${mood.color}10` 
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h4">{mood.emoji}</Typography>
                    <Typography variant="caption">{mood.label}</Typography>
                  </Box>
                </Button>
              </motion.div>
            ))}
          </Box>

          {/* Mood Note */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Add a note (optional):
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="What's on your mind? What influenced your mood today?"
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={closeMoodDialog}>
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={saveMood}
            disabled={!selectedMood}
            sx={{ 
              background: selectedMood?.color || '#667eea',
              '&:hover': { background: selectedMood?.color || '#5a6fd8' }
            }}
          >
            {editingMood ? 'Update' : 'Save Mood'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MoodTracker; 