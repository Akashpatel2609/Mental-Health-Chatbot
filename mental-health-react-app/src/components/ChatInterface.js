import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Send,
  Psychology,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { colors } from '../theme';

// Design tokens matching ChatGPT specifications with new color scheme
const designVars = {
  navHeight: 40,
  inputHeight: 56,
  border: colors.neutral.gray,
  bg: colors.neutral.white,
  inputBg: colors.neutral.lightGray,
  userMsgBg: colors.gradients.cool,
  inputBorder: colors.neutral.gray,
  font: 'Inter, system-ui, sans-serif',
  grayText: colors.text.secondary,
  iconGray: colors.text.hint,
  footerBg: colors.neutral.lightGray,
};

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();

  const API_BASE_URL = 'http://localhost:5000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      // Prepare conversation history (last 10 messages, user and bot)
      const history = messages.slice(-10).map(m => ({ sender: m.sender, text: m.text }));
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: inputMessage,
        history
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        emotion: response.data.emotion_detected,
        sentiment: response.data.sentiment_score
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)', // Account for AppBar height
        maxHeight: 'calc(100vh - 64px)', // Ensure it doesn't exceed viewport
        bgcolor: designVars.bg,
        fontFamily: designVars.font,
        display: 'flex',
        flexDirection: 'column',
        fontSize: '16px',
        overflow: 'hidden', // Prevent body scroll
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box', // Include padding in height calculation
        alignItems: 'center', // Center the chat container
        justifyContent: 'center', // Center vertically
        '& *': {
          boxSizing: 'border-box', // Ensure all child elements use border-box
        },
      }}
    >
      {/* Main Chat Container - Centered */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 900, // Slightly wider for better proportions
          height: '100%',
          maxHeight: 'calc(100vh - 80px)', // Account for AppBar + padding
          display: 'flex',
          flexDirection: 'column',
          bgcolor: designVars.bg,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: `1px solid ${designVars.border}`,
          overflow: 'hidden',
          mx: 2, // Add horizontal margin
        }}
      >
        {/* Chat Canvas - Scrollable Area */}
        <Box
          sx={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto', // Only this area scrolls
            overflowX: 'hidden',
            pt: 3, // Add top padding
            pb: 2, // Add bottom padding
            px: 3, // Add horizontal padding
            minHeight: 0, // Important for flex scrolling
          }}
        >
          {/* Welcome message when no messages */}
          {messages.length === 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                color: colors.text.secondary,
                gap: 2,
              }}
            >
              <Avatar sx={{ width: 64, height: 64, bgcolor: colors.primary.main, mb: 2 }}>
                <Psychology sx={{ fontSize: 32, color: colors.neutral.white }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text.primary }}>
                Welcome to MIRA! 💙
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: 400, lineHeight: 1.6 }}>
                I'm here to listen, support, and help you on your mental health journey. 
                Feel free to share what's on your mind.
              </Typography>
            </Box>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {message.sender === 'bot' ? (
                  // Assistant message (left-aligned)
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: colors.primary.main, mr: 2, flexShrink: 0 }}>
                      <Psychology sx={{ color: colors.neutral.white }} />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0, maxWidth: '85%' }}>
                      <Box
                        sx={{
                          minHeight: 44,
                          bgcolor: designVars.bg,
                          border: `1px solid ${designVars.border}`,
                          borderRadius: 3,
                          px: 3,
                          py: 2.5,
                          fontSize: 16,
                          color: colors.text.primary,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.6,
                          wordWrap: 'break-word',
                        }}
                      >
                        {message.text}
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  // User message (right-aligned)
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3, justifyContent: 'flex-end' }}>
                    <Box sx={{ flex: 1, minWidth: 0, maxWidth: '85%', display: 'flex', justifyContent: 'flex-end' }}>
                      <Box
                        sx={{
                          minHeight: 44,
                          bgcolor: colors.primary.main,
                          borderRadius: 3,
                          px: 3,
                          py: 2.5,
                          fontSize: 16,
                          color: colors.neutral.white,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.6,
                          wordWrap: 'break-word',
                          textAlign: 'left',
                          maxWidth: '100%',
                        }}
                      >
                        {message.text}
                      </Box>
                    </Box>
                  </Box>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: colors.primary.main, mr: 2, flexShrink: 0 }}>
                  <Psychology sx={{ color: colors.neutral.white }} />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0, maxWidth: '85%' }}>
                  <Box
                    sx={{
                      minHeight: 44,
                      bgcolor: designVars.bg,
                      border: `1px solid ${designVars.border}`,
                      borderRadius: 3,
                      px: 3,
                      py: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <CircularProgress size={16} sx={{ color: colors.primary.main }} />
                    <Typography sx={{ color: colors.text.secondary, fontSize: 14 }}>
                      MIRA is thinking...
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            borderTop: `1px solid ${designVars.border}`,
            bgcolor: designVars.bg,
            p: 3, // Consistent padding with chat area
            flexShrink: 0, // Prevent shrinking
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              gap: 1,
              bgcolor: designVars.inputBg,
              border: `1px solid ${designVars.inputBorder}`,
              borderRadius: 3,
              px: 2,
              py: 1,
              '&:focus-within': {
                borderColor: colors.primary.main,
                boxShadow: `0 0 0 2px ${colors.primary.light}20`,
              },
            }}
          >
            <TextField
              multiline
              maxRows={4}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message MIRA..."
              variant="standard"
              sx={{
                flex: 1,
                '& .MuiInput-root': {
                  fontSize: 16,
                  color: colors.text.primary,
                  '&::before': { borderBottom: 'none' },
                  '&::after': { borderBottom: 'none' },
                  '&:hover::before': { borderBottom: 'none' },
                },
                '& .MuiInput-input': {
                  padding: '8px 0',
                  '&::placeholder': {
                    color: colors.text.hint,
                    opacity: 1,
                  },
                },
              }}
            />
            <IconButton
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{
                color: inputMessage.trim() && !isLoading ? colors.primary.main : colors.text.hint,
                p: 1,
                '&:hover': {
                  bgcolor: inputMessage.trim() && !isLoading ? colors.primary.light + '20' : 'transparent',
                },
                '&:disabled': {
                  color: colors.text.hint,
                },
              }}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface;