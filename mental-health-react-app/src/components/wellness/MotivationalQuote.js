import React from 'react';
import { Box, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';

const quotes = [
  "Every day is a fresh start.",
  "You are stronger than you think.",
  "Small steps every day.",
  "Progress, not perfection.",
  "Be kind to yourself.",
  "Your feelings are valid.",
  "You are enough."
];

const MotivationalQuote = () => {
  const day = new Date().getDay();
  const quote = quotes[day % quotes.length];
  return (
    <Box sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#FFF9C0' }}>
      <Star sx={{ fontSize: 40, color: '#FFD700', mb: 1 }} />
      <Typography variant="h5" fontWeight={700} mb={1}>Motivational Quote</Typography>
      <Typography variant="body1" fontStyle="italic">"{quote}"</Typography>
    </Box>
  );
};

export default MotivationalQuote; 