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
  Badge,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Group,
  Forum,
  Favorite,
  Message,
  TrendingUp,
  EmojiEvents,
  People,
  Chat,
  Support,
  Star,
  Add,
  Search,
  Send,
  ThumbUp,
  Share,
  MoreVert
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Community = () => {
  const [communityStats, setCommunityStats] = useState({});
  const [discussions, setDiscussions] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = () => {
    // Set community stats
    setCommunityStats({
      totalMembers: 1247,
      activeToday: 89,
      totalDiscussions: 156,
      totalSupport: 342
    });

    // Set discussions
    setDiscussions([
      {
        id: 1,
        title: 'How do you practice self-care during stressful times?',
        author: 'Sarah M.',
        authorAvatar: 'S',
        replies: 23,
        likes: 45,
        timeAgo: '2 hours ago',
        tags: ['Self-Care', 'Stress Management'],
        isPinned: true
      },
      {
        id: 2,
        title: 'Mindfulness techniques that actually work for me',
        author: 'Alex K.',
        authorAvatar: 'A',
        replies: 18,
        likes: 32,
        timeAgo: '5 hours ago',
        tags: ['Mindfulness', 'Tips'],
        isPinned: false
      },
      {
        id: 3,
        title: 'Dealing with anxiety in social situations',
        author: 'Maria L.',
        authorAvatar: 'M',
        replies: 31,
        likes: 67,
        timeAgo: '1 day ago',
        tags: ['Anxiety', 'Social'],
        isPinned: false
      },
      {
        id: 4,
        title: 'My gratitude journal journey - 30 days update',
        author: 'David R.',
        authorAvatar: 'D',
        replies: 12,
        likes: 28,
        timeAgo: '2 days ago',
        tags: ['Gratitude', 'Journaling'],
        isPinned: false
      }
    ]);

    // Set challenges
    setChallenges([
      {
        id: 1,
        title: '30-Day Mindfulness Challenge',
        description: 'Practice mindfulness for 30 days and track your progress',
        participants: 156,
        daysLeft: 12,
        progress: 65,
        reward: 'Mindfulness Master Badge',
        color: '#4caf50'
      },
      {
        id: 2,
        title: 'Gratitude Week',
        description: 'Share one thing you\'re grateful for each day this week',
        participants: 89,
        daysLeft: 3,
        progress: 85,
        reward: 'Gratitude Champion Badge',
        color: '#ff9800'
      },
      {
        id: 3,
        title: 'Random Acts of Kindness',
        description: 'Perform one act of kindness each day and share your experience',
        participants: 203,
        daysLeft: 7,
        progress: 45,
        reward: 'Kindness Ambassador Badge',
        color: '#2196f3'
      }
    ]);

    // Set members
    setMembers([
      {
        id: 1,
        name: 'Sarah M.',
        avatar: 'S',
        wellnessScore: 85,
        badges: ['Mindfulness Master', 'Support Champion'],
        isOnline: true
      },
      {
        id: 2,
        name: 'Alex K.',
        avatar: 'A',
        wellnessScore: 78,
        badges: ['Gratitude Champion'],
        isOnline: true
      },
      {
        id: 3,
        name: 'Maria L.',
        avatar: 'M',
        wellnessScore: 72,
        badges: ['New Member'],
        isOnline: false
      },
      {
        id: 4,
        name: 'David R.',
        avatar: 'D',
        wellnessScore: 91,
        badges: ['Wellness Leader', 'Kindness Ambassador'],
        isOnline: true
      }
    ]);
  };

  const getWellnessColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
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
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea', mb: 1 }}>
            👥 Community
          </Typography>
          <Typography variant="h6" sx={{ color: '#888', fontWeight: 400 }}>
            Connect with others on their mental wellness journey
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Community Stats */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {communityStats.totalMembers}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Members
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {communityStats.activeToday}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Active Today
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {communityStats.totalDiscussions}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Discussions
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {communityStats.totalSupport}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Support Given
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Discussions */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea' }}>
                    Recent Discussions
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{
                      bgcolor: '#667eea',
                      '&:hover': { bgcolor: '#5a6fd8' }
                    }}
                  >
                    Start Discussion
                  </Button>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Search discussions..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ bgcolor: 'white' }}
                  />
                </Box>

                <List>
                  {discussions.map((discussion, index) => (
                    <motion.div
                      key={discussion.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <ListItem sx={{ 
                        mb: 2, 
                        bgcolor: 'white', 
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                      }}>
                        <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-start', mb: 2 }}>
                          <Avatar sx={{ mr: 2, bgcolor: '#667eea' }}>
                            {discussion.authorAvatar}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, mr: 1 }}>
                                {discussion.title}
                              </Typography>
                              {discussion.isPinned && (
                                <Chip label="Pinned" size="small" sx={{ bgcolor: '#ff9800', color: 'white' }} />
                              )}
                            </Box>
                            <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                              by {discussion.author} • {discussion.timeAgo}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {discussion.tags.map((tag, tagIndex) => (
                                <Chip
                                  key={tagIndex}
                                  label={tag}
                                  size="small"
                                  sx={{ bgcolor: 'rgba(102,126,234,0.1)', color: '#667eea' }}
                                />
                              ))}
                            </Box>
                          </Box>
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                          <Button
                            startIcon={<Message />}
                            size="small"
                            sx={{ color: '#888' }}
                          >
                            {discussion.replies} replies
                          </Button>
                          <Button
                            startIcon={<ThumbUp />}
                            size="small"
                            sx={{ color: '#888' }}
                          >
                            {discussion.likes} likes
                          </Button>
                          <Button
                            startIcon={<Share />}
                            size="small"
                            sx={{ color: '#888' }}
                          >
                            Share
                          </Button>
                        </Box>
                      </ListItem>
                    </motion.div>
                  ))}
                </List>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': { borderColor: '#5a6fd8', bgcolor: 'rgba(102,126,234,0.05)' }
                    }}
                  >
                    View All Discussions
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Community Challenges */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea', mb: 3 }}>
                  Community Challenges
                </Typography>

                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <Card sx={{ mb: 2, bgcolor: 'white' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <EmojiEvents sx={{ color: challenge.color, mr: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {challenge.title}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                          {challenge.description}
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                              Progress
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                              {challenge.progress}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={challenge.progress}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'rgba(102,126,234,0.1)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: challenge.color,
                                borderRadius: 3
                              }
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="body2" sx={{ color: '#888' }}>
                            {challenge.participants} participants
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#888' }}>
                            {challenge.daysLeft} days left
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            bgcolor: challenge.color,
                            '&:hover': { bgcolor: challenge.color }
                          }}
                          fullWidth
                        >
                          Join Challenge
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Active Members */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea', mb: 3 }}>
                  Active Members
                </Typography>

                <Grid container spacing={2}>
                  {members.map((member, index) => (
                    <Grid item xs={12} sm={6} md={3} key={member.id}>
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
                            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                              <Avatar sx={{ 
                                width: 60, 
                                height: 60, 
                                bgcolor: '#667eea',
                                fontSize: '1.5rem'
                              }}>
                                {member.avatar}
                              </Avatar>
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: 0,
                                  right: 0,
                                  width: 16,
                                  height: 16,
                                  borderRadius: '50%',
                                  bgcolor: member.isOnline ? '#4caf50' : '#ccc',
                                  border: '2px solid white'
                                }}
                              />
                            </Box>
                            
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {member.name}
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                                Wellness Score
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={member.wellnessScore}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: 'rgba(102,126,234,0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: getWellnessColor(member.wellnessScore),
                                    borderRadius: 3
                                  }
                                }}
                              />
                              <Typography variant="caption" sx={{ color: '#888' }}>
                                {member.wellnessScore}/100
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                              {member.badges.map((badge, badgeIndex) => (
                                <Chip
                                  key={badgeIndex}
                                  label={badge}
                                  size="small"
                                  sx={{ 
                                    bgcolor: 'rgba(102,126,234,0.1)', 
                                    color: '#667eea',
                                    fontSize: '0.7rem'
                                  }}
                                />
                              ))}
                            </Box>
                            
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Chat />}
                              sx={{
                                mt: 2,
                                borderColor: '#667eea',
                                color: '#667eea',
                                '&:hover': { borderColor: '#5a6fd8', bgcolor: 'rgba(102,126,234,0.05)' }
                              }}
                              fullWidth
                            >
                              Message
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
      </Grid>
    </Box>
  );
};

export default Community; 