import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SelfImprovement } from '@mui/icons-material';

const phases = [
  { label: 'Inhale', duration: 4 },
  { label: 'Hold', duration: 4 },
  { label: 'Exhale', duration: 6 }
];

const BreathingExercise = () => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(phases[0].duration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    if (timeLeft === 0) {
      const next = (phaseIndex + 1) % phases.length;
      setPhaseIndex(next);
      setTimeLeft(phases[next].duration);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [isActive, timeLeft, phaseIndex]);

  const start = () => {
    setIsActive(true);
    setPhaseIndex(0);
    setTimeLeft(phases[0].duration);
  };
  const stop = () => setIsActive(false);

  return (
    <Box sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#E3FCEC' }}>
      <SelfImprovement sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
      <Typography variant="h5" fontWeight={700} mb={1}>Breathing Exercise</Typography>
      <Typography variant="body1" mb={2}>Follow the guided breathing: Inhale, Hold, Exhale.</Typography>
      <Typography variant="h4" color="primary" mb={1}>{phases[phaseIndex].label}</Typography>
      <Typography variant="h2" fontWeight={800} mb={2}>{timeLeft}s</Typography>
      <Button variant="contained" color="success" onClick={start} disabled={isActive} sx={{ mr: 1 }}>Start</Button>
      <Button variant="outlined" color="error" onClick={stop} disabled={!isActive}>Stop</Button>
    </Box>
  );
};

export default BreathingExercise; 