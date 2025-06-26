import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  LinearProgress,
  Alert,
  Snackbar,
  Chip,
  Fade,
  Grow,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Send,
  VolumeUp,
  VolumeOff,
  ExitToApp,
  Psychology,
  Favorite,
  Mood,
  TrendingUp,
  Refresh,
  SmartToy,
  Person
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const EnhancedChatInterface = () => {
  const { currentUser, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [userMood, setUserMood] = useState('neutral');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0 && currentUser) {
      const welcomeMessage = {
        id: Date.now(),
        text: `Hello ${currentUser.firstName}! I'm here to support you on your mental health journey. How are you feeling today?`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        emotion: 'positive',
        isWelcome: true
      };
      setMessages([welcomeMessage]);
    }
  }, [currentUser, messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Focus back to input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          username: currentUser?.username || 'User'
        }),
      });

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        emotion: data.emotion_detected,
        crisisLevel: data.crisis_level,
        sentiment: analyzeSentiment(data.response)
      };

      setMessages(prev => [...prev, botMessage]);

      // Update user mood based on conversation
      updateUserMood(data.emotion_detected, data.response);

      // Auto-play voice if enabled
      if (isVoiceEnabled && data.response) {
        generateVoice(data.response);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbarMessage('I\'m having trouble connecting right now. Please try again.');
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeSentiment = (text) => {
    const positiveWords = ['good', 'great', 'wonderful', 'amazing', 'happy', 'joy', 'love', 'hope', 'better', 'improve', 'help', 'support', 'thank', 'grateful'];
    const negativeWords = ['bad', 'terrible', 'awful', 'sad', 'depressed', 'anxious', 'worried', 'scared', 'angry', 'frustrated', 'hopeless', 'suicide', 'kill', 'die'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const updateUserMood = (emotion, response) => {
    const moodMap = {
      'happiness': 'positive',
      'joy': 'positive',
      'excitement': 'positive',
      'sadness': 'negative',
      'anxiety': 'negative',
      'anger': 'negative',
      'fear': 'negative',
      'loneliness': 'negative',
      'neutral': 'neutral'
    };
    
    setUserMood(moodMap[emotion] || 'neutral');
  };

  const generateVoice = async (text) => {
    try {
      const response = await fetch('http://localhost:5000/voice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          username: currentUser?.username || 'User'
        }),
      });

      const data = await response.json();
      
      if (data.success && data.audio_base64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audio_base64}`);
        audio.play();
      }
    } catch (error) {
      console.error('Error generating voice:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = 'http://localhost:3000';
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'positive': return '#4caf50';
      case 'negative': return '#f44336';
      case 'neutral': return '#2196f3';
      default: return '#2196f3';
    }
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'positive': return <Favorite />;
      case 'negative': return <Mood />;
      case 'neutral': return <Psychology />;
      default: return <Psychology />;
    }
  };

  const clearChat = () => {
    setMessages([]);
    setUserMood('neutral');
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: getMoodColor(userMood),
            width: 40,
            height: 40
          }}>
            {getMoodIcon(userMood)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
              Mental Health Buddy
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              {currentUser?.firstName} • {userMood.charAt(0).toUpperCase() + userMood.slice(1)} mood
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Clear chat">
            <IconButton onClick={clearChat} size="small">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle voice">
            <IconButton 
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              color={isVoiceEnabled ? 'primary' : 'default'}
              size="small"
            >
              {isVoiceEnabled ? <VolumeUp /> : <VolumeOff />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Sign out">
            <IconButton onClick={handleLogout} color="error" size="small">
              <ExitToApp />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: 1,
                  alignItems: 'flex-start'
                }}
              >
                {message.sender === 'bot' && (
                  <Avatar sx={{ 
                    bgcolor: '#667eea',
                    width: 32,
                    height: 32,
                    mt: 0.5
                  }}>
                    <SmartToy />
                  </Avatar>
                )}
                
                <Box sx={{ maxWidth: '70%' }}>
                  <Paper
                    sx={{
                      p: 2,
                      background: message.sender === 'user' 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : '#ffffff',
                      color: message.sender === 'user' ? 'white' : '#333',
                      borderRadius: 3,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      position: 'relative'
                    }}
                  >
                    <Typography variant="body1" sx={{ 
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {message.text}
                    </Typography>
                    
                    {message.sender === 'bot' && message.emotion && (
                      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`${message.emotion}`} 
                          size="small" 
                          sx={{ 
                            bgcolor: getMoodColor(message.emotion),
                            color: 'white',
                            fontSize: '0.7rem'
                          }}
                        />
                        {message.sentiment && message.sentiment !== 'neutral' && (
                          <Chip 
                            label={`${message.sentiment} sentiment`} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                        {message.crisisLevel && message.crisisLevel !== 'none' && (
                          <Chip 
                            label={`Crisis: ${message.crisisLevel}`} 
                            size="small" 
                            color="error"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    )}
                  </Paper>
                  
                  <Typography variant="caption" sx={{ 
                    opacity: 0.6, 
                    mt: 0.5, 
                    display: 'block',
                    textAlign: message.sender === 'user' ? 'right' : 'left'
                  }}>
                    {message.timestamp}
                  </Typography>
                </Box>
                
                {message.sender === 'user' && (
                  <Avatar sx={{ 
                    bgcolor: '#4caf50',
                    width: 32,
                    height: 32,
                    mt: 0.5
                  }}>
                    <Person />
                  </Avatar>
                )}
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1, alignItems: 'flex-start' }}>
              <Avatar sx={{ 
                bgcolor: '#667eea',
                width: 32,
                height: 32,
                mt: 0.5
              }}>
                <SmartToy />
              </Avatar>
              <Paper sx={{ 
                p: 2, 
                background: '#ffffff',
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                minWidth: 200
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress sx={{ flex: 1 }} />
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    Thinking...
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ 
        p: 2, 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          alignItems: 'flex-end',
          maxWidth: 800,
          mx: 'auto'
        }}>
          <TextField
            ref={inputRef}
            fullWidth
            multiline
            maxRows={4}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts, feelings, or concerns... I'm here to listen and support you."
            variant="outlined"
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                background: '#ffffff',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                },
              },
            }}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                px: 3,
                py: 1.5,
                minWidth: 60,
                height: 56,
                '&:hover': { 
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' 
                },
                '&:disabled': {
                  background: '#ccc'
                }
              }}
            >
              <Send />
            </Button>
          </motion.div>
        </Box>
        
        <Typography variant="caption" sx={{ 
          textAlign: 'center', 
          display: 'block', 
          mt: 1, 
          color: '#666',
          opacity: 0.7
        }}>
          Press Enter to send • Shift+Enter for new line
        </Typography>
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="info" 
          onClose={() => setShowSnackbar(false)}
          sx={{ borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnhancedChatInterface; 