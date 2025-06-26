import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Button,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Menu,
  MenuItem
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopIcon from '@mui/icons-material/Stop';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';

// Configure axios for your Flask backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function ChatInterface() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [crisisAlert, setCrisisAlert] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: 1,
        content: `Hello ${user?.username}! I'm Mira, your mental health companion powered by Gemini 2.0 Flash AI. I'm here to listen, support, and chat with you about whatever is on your mind. How are you feeling today?`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        emotion: 'positive'
      }
    ]);

    // Test API connection
    testApiConnection();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const testApiConnection = async () => {
    try {
      console.log('Testing API connection to:', API_BASE_URL);
      const response = await api.get('/test-api');
      setApiStatus(response.data.api_working ? 'connected' : 'error');
      console.log('API Status:', response.data);
    } catch (error) {
      console.error('API test failed:', error);
      setApiStatus('error');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('Sending message to:', `${API_BASE_URL}/chat`);
      const response = await api.post('/chat', {
        message: messageToSend,
        username: user?.username || 'Guest'
      });

      const botMessage = {
        id: Date.now() + 1,
        content: response.data.response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        emotion: response.data.emotion_detected,
        crisisLevel: response.data.crisis_level
      };

      setMessages(prev => [...prev, botMessage]);

      // Handle crisis situations
      if (response.data.crisis_level === 'high' || response.data.crisis_level === 'medium') {
        setCrisisAlert({
          level: response.data.crisis_level,
          message: response.data.crisis_level === 'high' 
            ? 'I notice you may be in distress. Please consider contacting emergency services (911) or the suicide prevention lifeline (988).'
            : 'I hear that you\'re going through a difficult time. Remember that support is available.'
        });
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        content: `I'm having trouble connecting to the server right now, ${user?.username}. Please make sure your Flask backend is running on ${API_BASE_URL}. If you're in crisis, you can always call 911 or 988.`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        emotion: 'supportive'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const playVoiceMessage = async (text, messageId) => {
    try {
      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }

      const response = await api.post('/voice/generate', {
        text: text,
        username: user?.username || 'Guest',
        voice_id: 'bella',
        voice_style: 'empathetic'
      });

      if (response.data.success && response.data.audio_base64) {
        // Convert base64 to audio blob
        const audioBlob = base64ToBlob(response.data.audio_base64, 'audio/mpeg');
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audio.addEventListener('ended', () => {
          URL.revokeObjectURL(audioUrl);
          setCurrentAudio(null);
        });

        setCurrentAudio(audio);
        await audio.play();
      }
    } catch (error) {
      console.error('Voice playback error:', error);
      // Show user-friendly error
      alert('Voice feature is not available. Please make sure your Flask backend is running with voice support.');
    }
  };

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const MessageBubble = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`message-container ${message.sender}`}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
          mb: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-end',
            maxWidth: '70%'
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              mx: 1,
              bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.300'
            }}
          >
            {message.sender === 'user' ? (
              <AccountCircleIcon />
            ) : (
              '🤖'
            )}
          </Avatar>
          
          <Paper
            elevation={2}
            sx={{
              p: 2,
              bgcolor: message.sender === 'user' ? 'primary.main' : 'background.paper',
              color: message.sender === 'user' ? 'white' : 'text.primary',
              borderRadius: message.sender === 'user' ? '20px 20px 8px 20px' : '20px 20px 20px 8px'
            }}
          >
            <Typography variant="body1">
              {message.content}
            </Typography>
            
            {message.sender === 'bot' && (
              <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton
                  size="small"
                  onClick={() => playVoiceMessage(message.content, message.id)}
                  sx={{ color: 'primary.main' }}
                >
                  <VolumeUpIcon fontSize="small" />
                </IconButton>
                {message.emotion && (
                  <Chip 
                    label={message.emotion} 
                    size="small" 
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                )}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </motion.div>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            💙 Mental Health Companion
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={apiStatus === 'connected' ? 'AI Connected' : apiStatus === 'checking' ? 'Checking...' : 'AI Offline'}
              color={apiStatus === 'connected' ? 'success' : apiStatus === 'checking' ? 'default' : 'error'}
              size="small"
            />
            
            <Button
              color="inherit"
              onClick={handleUserMenuOpen}
              startIcon={<AccountCircleIcon />}
            >
              {user?.username}
            </Button>
            
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
            >
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Crisis Alert */}
      <AnimatePresence>
        {crisisAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <Alert 
              severity={crisisAlert.level === 'high' ? 'error' : 'warning'}
              onClose={() => setCrisisAlert(null)}
              sx={{ m: 2 }}
            >
              <Typography variant="body2">
                <strong>Crisis Resources:</strong> Emergency: 911 | Suicide Prevention: 988 | Crisis Text: Text HOME to 741741
              </Typography>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Status */}
      {apiStatus === 'error' && (
        <Alert severity="warning" sx={{ m: 2 }}>
          Cannot connect to Flask backend at {API_BASE_URL}. Please make sure your Flask server is running with: <code>python app.py</code>
        </Alert>
      )}

      {/* Chat Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Container maxWidth="md">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: 'grey.300' }}>🤖</Avatar>
                <Paper elevation={2} sx={{ p: 2, borderRadius: '20px 20px 20px 8px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      Mira is typing...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Container>
      </Box>

      {/* Input Area */}
      <Paper elevation={3} sx={{ p: 2, m: 2, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            placeholder="Type your message here..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
              }
            }}
          />
          
          <IconButton
            color="primary"
            disabled={isListening}
            sx={{ mb: 0.5 }}
            title="Voice input not implemented in this demo"
          >
            <MicIcon />
          </IconButton>
          
          {currentAudio && (
            <IconButton
              color="secondary"
              onClick={() => {
                currentAudio.pause();
                setCurrentAudio(null);
              }}
              sx={{ mb: 0.5 }}
            >
              <StopIcon />
            </IconButton>
          )}
          
          <IconButton
            color="primary"
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            sx={{ mb: 0.5 }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}

export default ChatInterface;