import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Avatar,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FavoriteIcon from '@mui/icons-material/Favorite';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Simple validation passed
    login(username.trim(), email.trim());
    navigate('/chat');
  };

  const quickLogin = (name) => {
    setUsername(name);
    setEmail(`${name.toLowerCase()}@example.com`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card sx={{ p: 4 }}>
            <CardContent>
              <Box textAlign="center" mb={4}>
                <Avatar 
                  sx={{ 
                    mx: 'auto', 
                    mb: 2, 
                    width: 80, 
                    height: 80,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  <FavoriteIcon fontSize="large" />
                </Avatar>
                <Typography variant="h4" gutterBottom fontWeight={600}>
                  Welcome to Mira
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Your AI mental health companion is ready to listen and support you
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Your Name"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ mb: 3 }}
                  placeholder="Enter your name"
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 3 }}
                  placeholder="Enter your email"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    mb: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  Start Chatting with Mira
                </Button>
              </form>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Quick login options:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['Akashpatel2609', 'Guest', 'Demo User'].map((name) => (
                    <Button
                      key={name}
                      variant="outlined"
                      size="small"
                      onClick={() => quickLogin(name)}
                      sx={{ mb: 1 }}
                    >
                      {name}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Box mt={4} textAlign="center">
                <Typography variant="caption" color="text.secondary">
                  Your privacy is important to us. We only store your name and email locally. 
                  This app is not a replacement for professional mental health care.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}

export default LoginPage;