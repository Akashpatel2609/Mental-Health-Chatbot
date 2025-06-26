import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

const DailyTip = ({ userActivity }) => {
  const [tip, setTip] = useState(null);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const response = await fetch('http://localhost:5000/wellness-tips');
        const data = await response.json();
        setTip(data.daily_tip);
      } catch (error) {
        setTip({
          tip: 'Start your day with intention. Take 5 minutes to set a positive intention for today.',
          activity: 'Try our breathing exercise to center yourself.',
          emoji: '🌟',
          focus: 'Mindfulness'
        });
      }
    };
    fetchTip();
  }, [userActivity]);

  if (!tip) return null;

  return (
    <Box sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#E3FCEC' }}>
      <TrendingUp sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
      <Typography variant="h5" fontWeight={700} mb={1}>Tip for the Day</Typography>
      <Typography variant="body1" mb={1}>{tip.tip}</Typography>
      <Typography variant="body2" color="text.secondary">{tip.activity}</Typography>
    </Box>
  );
};

export default DailyTip; 