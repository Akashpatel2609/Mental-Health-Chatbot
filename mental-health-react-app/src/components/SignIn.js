import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

const SignIn = ({ onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🔍 Attempting to sign in with:', { email: formData.email, password: '***' });

    try {
      console.log('📡 Making API call to sign in...');
      await signIn(formData.email, formData.password);
      console.log('✅ Sign in successful!');
    } catch (err) {
      console.error('❌ Sign in error:', err);
      setError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.gradients.landing,
        padding: 2
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          sx={{
            width: { xs: '100%', sm: 400 },
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            background: colors.neutral.white,
            color: colors.neutral.darkGray,
            border: `1px solid ${colors.primary.main}`
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: colors.gradients.primary,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Welcome Back 💙
              </Typography>
              <Typography variant="body1" sx={{ color: colors.text.secondary, fontWeight: 400 }}>
                Sign in to continue your mental wellness journey
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            {/* Sign In Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: colors.neutral.white,
                    '&:hover fieldset': {
                      borderColor: colors.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary.main,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: colors.primary.main }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                sx={{
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: colors.neutral.white,
                    '&:hover fieldset': {
                      borderColor: colors.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary.main,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: colors.primary.main }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  background: colors.gradients.primary,
                  color: colors.primary.contrastText,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  boxShadow: 2,
                  '&:hover': { background: colors.gradients.secondary, color: colors.neutral.darkGray }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: colors.primary.contrastText }} /> : 'Sign In'}
              </Button>
            </Box>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Don't have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={onSwitchToSignUp}
                  sx={{
                    color: colors.primary.main,
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      color: colors.primary.dark,
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default SignIn; 