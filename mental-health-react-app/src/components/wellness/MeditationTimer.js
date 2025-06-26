import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Spa } from '@mui/icons-material';

const TOTAL_TIME = 300; // 5 minutes

const MeditationTimer = () => {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    if (timeLeft === 0) {
      setIsActive(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [isActive, timeLeft]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = () => { setTimeLeft(TOTAL_TIME); setIsActive(false); };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Box sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#EDEBFF' }}>
      <Spa sx={{ fontSize: 40, color: '#6C63FF', mb: 1 }} />
      <Typography variant="h5" fontWeight={700} mb={1}>Meditation Timer</Typography>
      <Typography variant="body1" mb={2}>Take a mindful break. Focus on your breath and let thoughts pass by.</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Box sx={{ position: 'relative', width: 100, height: 100, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress variant="determinate" value={100 * (1 - timeLeft / TOTAL_TIME)} size={100} thickness={5} />
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4">{minutes}:{seconds.toString().padStart(2, '0')}</Typography>
          </Box>
        </Box>
      </Box>
      <Button variant="contained" color="primary" onClick={start} disabled={isActive} sx={{ mr: 1 }}>Start</Button>
      <Button variant="outlined" color="warning" onClick={pause} disabled={!isActive} sx={{ mr: 1 }}>Pause</Button>
      <Button variant="outlined" color="error" onClick={reset}>Reset</Button>
      <Typography variant="body2" color="text.secondary" mt={2}>
        "Meditation is not about stopping thoughts, but recognizing that we are more than our thoughts."
      </Typography>
    </Box>
  );
};

export default MeditationTimer; 