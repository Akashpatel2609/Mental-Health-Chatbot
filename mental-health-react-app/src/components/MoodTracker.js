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
import { colors } from '../theme';

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
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

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
    // Use moodOptions for mood objects
    const history = [
      { date: '2025-06-25', mood: moodOptions[0], note: 'Had a great conversation with a friend' },
      { date: '2025-06-24', mood: moodOptions[1], note: 'Meditation session was very relaxing' },
      { date: '2025-06-23', mood: moodOptions[2], note: 'Regular day at work' },
      { date: '2025-06-22', mood: moodOptions[3], note: 'Feeling a bit down today' },
      { date: '2025-06-21', mood: moodOptions[0], note: 'Completed a challenging project' },
      { date: '2025-06-20', mood: moodOptions[4], note: 'Work stress getting to me' },
      { date: '2025-06-19', mood: moodOptions[1], note: 'Spent time in nature' }
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

  const handleSubmitMood = () => {
    if (!selectedMood) return;
    const newMoodEntry = {
      id: Date.now(),
      mood: selectedMood,
      note: '',
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };
    setMoodHistory(prev => [newMoodEntry, ...prev]);
    setSelectedMood(null);
  };

  const openHistoryDialog = () => setHistoryDialogOpen(true);
  const closeHistoryDialog = () => setHistoryDialogOpen(false);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: colors.primary.main, mb: 1 }}>
            😊 Mood Tracker
          </Typography>
          <Typography variant="h6" sx={{ color: colors.text.secondary, fontWeight: 400 }}>
            Track your emotional journey and discover patterns
          </Typography>
        </Box>
      </motion.div>

      {/* Bento Box Layout */}
      <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
        {/* First row: Mood Selection & Mood Insights */}
        <Grid container item spacing={4} sx={{ mb: { md: 0, xs: 4 } }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <motion.div style={{ flex: 1, display: 'flex' }} initial={{ y: 0, x: 0 }} animate={{ y: 0, x: 0 }}>
              <Card sx={{ flex: 1, minHeight: 370, height: '100%', borderRadius: 4, boxShadow: 6, p: 0, background: colors.gradients.primary, color: colors.primary.contrastText, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                            onClick={() => setSelectedMood(mood)}
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
                  {/* Submit button appears only if a mood is selected */}
                  {selectedMood && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CheckCircle />}
                      onClick={handleSubmitMood}
                      sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                      fullWidth
                    >
                      Submit
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <motion.div style={{ flex: 1, display: 'flex' }} initial={{ y: 0, x: 0 }} animate={{ y: 0, x: 0 }}>
              <Card sx={{ flex: 1, minHeight: 370, height: '100%', borderRadius: 4, boxShadow: 6, p: 0, background: colors.gradients.secondary, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: colors.primary.main, mb: 3 }}>
                    Mood Insights
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUp sx={{ color: colors.primary.main, mr: 2 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                          Average Mood
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: colors.primary.main }}>
                          {moodStats.average}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EmojiEmotions sx={{ color: colors.secondary.main, mr: 2 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                          Most Frequent Mood
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.secondary.main }}>
                          {getMoodEmoji(moodStats.mostFrequentMood)} {moodStats.mostFrequentMood}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Timeline sx={{ color: colors.secondary.main, mr: 2 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                          Current Streak
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.secondary.main }}>
                          {moodStats.moodStreak} days
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: colors.primary.main, borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: colors.primary.contrastText, fontWeight: 500 }}>
                      🎉 {moodStats.improvement} improvement this month!
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
        {/* Second row: Weekly Mood Trends & Mood History */}
        <Grid container item spacing={4}>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <motion.div style={{ flex: 1, display: 'flex' }} initial={{ y: 0, x: 0 }} animate={{ y: 0, x: 0 }}>
              <Card sx={{ flex: 1, minHeight: 370, height: '100%', borderRadius: 4, boxShadow: 4, p: 0, background: colors.gradients.secondary, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: colors.primary.main, mb: 3 }}>
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
                              bgcolor: day.mood.color,
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ p: 2, bgcolor: colors.primary.main, borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: colors.primary.contrastText, fontWeight: 500 }}>
                      📈 Your mood has improved by 15% this week!
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={8} sx={{ display: 'flex' }}>
            <motion.div style={{ flex: 1, display: 'flex' }} initial={{ y: 0, x: 0 }} animate={{ y: 0, x: 0 }}>
              <Card sx={{ flex: 1, minHeight: 370, height: '100%', borderRadius: 4, boxShadow: 4, p: 0, background: colors.gradients.secondary, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: colors.primary.main, mb: 3 }}>
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
                        borderColor: colors.primary.main,
                        color: colors.primary.main,
                        '&:hover': { borderColor: colors.primary.dark, bgcolor: 'rgba(102,126,234,0.05)' }
                      }}
                      onClick={openHistoryDialog}
                    >
                      View Full History
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Grid>

      {/* Full Mood History Dialog */}
      <Dialog open={historyDialogOpen} onClose={closeHistoryDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Full Mood History</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: 500 }}>
          <List>
            {moodHistory.map((entry, index) => (
              <ListItem key={entry.id || entry.date} sx={{ mb: 1, bgcolor: 'white', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: getMoodColor(entry.mood.value), width: 40, height: 40 }}>
                    {getMoodEmoji(entry.mood.value)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </Typography>
                      <Chip
                        label={entry.mood.label}
                        size="small"
                        sx={{ bgcolor: `${getMoodColor(entry.mood.value)}20`, color: getMoodColor(entry.mood.value), fontWeight: 500 }}
                      />
                    </Box>
                  }
                  secondary={entry.note}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHistoryDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MoodTracker; 