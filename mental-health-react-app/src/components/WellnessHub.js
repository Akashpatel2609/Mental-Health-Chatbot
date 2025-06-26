import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
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
  ListItemButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Spa,
  Favorite,
  Psychology,
  TrendingUp,
  PlayArrow,
  CheckCircle,
  EmojiEmotions,
  SelfImprovement,
  LocalHospital,
  Star,
  Timer,
  FavoriteBorder,
  Pause,
  Stop,
  FitnessCenter,
  MusicNote,
  Book,
  Nature
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { colors } from '../theme';
import BreathingExercise from './wellness/BreathingExercise';
import MeditationTimer from './wellness/MeditationTimer';
import MotivationalQuote from './wellness/MotivationalQuote';
import DailyTip from './wellness/DailyTip';

const WellnessHub = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Grid container spacing={4} direction="column" alignItems="center" sx={{ width: '100%', maxWidth: 700 }}>
        {/* Motivational Quote - full width */}
        <Grid item xs={12} sx={{ width: '100%' }}>
          <MotivationalQuote />
        </Grid>
        {/* Breathing + Meditation side by side */}
        <Grid item xs={12} sx={{ width: '100%' }}>
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <BreathingExercise />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <MeditationTimer />
            </Grid>
          </Grid>
        </Grid>
        {/* Tip for the Day - full width */}
        <Grid item xs={12} sx={{ width: '100%' }}>
          <DailyTip />
        </Grid>
      </Grid>
    </Box>
  );
};

export default WellnessHub; 