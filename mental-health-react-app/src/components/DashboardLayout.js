import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, Typography, LinearProgress, Button, useTheme, useMediaQuery, Divider } from '@mui/material';
import { Chat, Spa, Mood, LocalHospital, Insights, Group, Logout } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { label: 'Chat with Mira', icon: <Chat />, path: '/dashboard/chat' },
  { label: 'Wellness Hub', icon: <Spa />, path: '/dashboard/wellness' },
  { label: 'Mood Tracker', icon: <Mood />, path: '/dashboard/mood' },
  { label: 'Resources', icon: <LocalHospital />, path: '/dashboard/resources' },
  { label: 'Insights', icon: <Insights />, path: '/dashboard/insights' },
  { label: 'Community', icon: <Group />, path: '/dashboard/community' },
];

const drawerWidth = 270;

const DashboardLayout = () => {
  const { currentUser, logout, userStats } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Placeholder wellness score (replace with real stats)
  const wellnessScore = userStats?.wellness_score || 72;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebar = (
    <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
        boxShadow: '2px 0 16px 0 rgba(102,126,234,0.08)',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar
          src={currentUser?.avatarUrl || ''}
          alt={currentUser?.firstName || 'User'}
          sx={{ width: 72, height: 72, mb: 1, boxShadow: 2 }}
        >
          {currentUser?.firstName?.[0] || 'U'}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea', mb: 0.5 }}>
          {currentUser?.firstName} {currentUser?.lastName}
        </Typography>
        <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
          @{currentUser?.username}
        </Typography>
        <Box sx={{ width: '100%', mt: 1 }}>
          <Typography variant="caption" sx={{ color: '#888' }}>Wellness Score</Typography>
          <LinearProgress
            variant="determinate"
            value={wellnessScore}
            sx={{ height: 8, borderRadius: 5, background: '#e0e7ff', mb: 0.5 }}
            color={wellnessScore > 60 ? 'primary' : 'secondary'}
          />
          <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 600 }}>{wellnessScore}/100</Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.label}
            component={NavLink}
            to={item.path}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&.active': {
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                boxShadow: 2,
                '& .MuiListItemIcon-root': { color: '#fff' },
              },
              '&:hover': {
                background: 'linear-gradient(90deg, #e0e7ff 0%, #c7d2fe 100%)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#667eea' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<Logout />}
        onClick={handleLogout}
        sx={{ borderRadius: 2, fontWeight: 600, borderColor: '#e91e63', color: '#e91e63', '&:hover': { borderColor: '#c2185b', background: '#fce4ec' } }}
        fullWidth
      >
        Logout
      </Button>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={!isMobile || undefined}
        onClose={() => {}}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 0,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
          },
        }}
      >
        {sidebar}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, md: 4 }, minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout; 