import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Avatar, 
  Typography, 
  LinearProgress, 
  Button, 
  useTheme, 
  useMediaQuery, 
  Divider,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { 
  Chat, 
  Spa, 
  Mood, 
  LocalHospital, 
  Insights, 
  Group, 
  Logout,
  Home,
  Menu
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

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
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Placeholder wellness score (replace with real stats)
  const wellnessScore = userStats?.wellness_score || 72;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebar = (
    <Box
      sx={{
        height: '100vh',
        background: colors.background.paper,
        boxShadow: '2px 0 16px 0 rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        borderRight: '1px solid rgba(0,0,0,0.05)',
        position: 'relative',
        zIndex: 1300
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
        <Typography variant="h6" sx={{ fontWeight: 700, color: colors.primary.main, mb: 0.5 }}>
          {currentUser?.firstName} {currentUser?.lastName}
        </Typography>
        <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
          @{currentUser?.username}
        </Typography>
        <Box sx={{ width: '100%', mt: 1 }}>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>Wellness Score</Typography>
          <LinearProgress
            variant="determinate"
            value={wellnessScore}
            sx={{ 
              height: 8, 
              borderRadius: 5, 
              background: colors.neutral.gray, 
              mb: 0.5,
              '& .MuiLinearProgress-bar': {
                background: wellnessScore > 60 ? colors.success.main : colors.warning.main
              }
            }}
          />
          <Typography variant="caption" sx={{ color: colors.primary.main, fontWeight: 600 }}>{wellnessScore}/100</Typography>
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
            onClick={() => isMobile && setMobileOpen(false)}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&.active': {
                background: colors.gradients.primary,
                color: colors.neutral.white,
                boxShadow: 2,
                '& .MuiListItemIcon-root': { color: colors.neutral.white },
              },
              '&:hover': {
                background: colors.gradients.cool,
              },
            }}
          >
            <ListItemIcon sx={{ color: colors.primary.main }}>{item.icon}</ListItemIcon>
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
        sx={{ 
          borderRadius: 2, 
          fontWeight: 600, 
          borderColor: colors.error.main, 
          color: colors.error.main, 
          '&:hover': { 
            borderColor: colors.error.dark, 
            background: colors.error.main,
            color: colors.neutral.white
          } 
        }}
        fullWidth
      >
        Logout
      </Button>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: colors.gradients.neutral,
      position: 'relative',
      overflow: 'hidden' // Prevent horizontal scrollbars
    }}>
      {/* Top Navbar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: 1200, // Lower z-index than drawer
          background: 'rgba(255, 255, 255, 0.95)', // Subtle white background
          backdropFilter: 'blur(10px)', // Glass effect
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', // Subtle shadow
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          height: 64
        }}
      >
        <Toolbar sx={{ height: 64, minHeight: 64 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: colors.primary.main }}
            >
              <Menu />
            </IconButton>
          )}
          
          {/* Logo - Centered */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexGrow: 1,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800, 
                background: colors.gradients.primary,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '2rem',
                letterSpacing: '0.5px'
              }}
            >
              💙 MIRA
            </Typography>
          </Box>

          {/* User Info - Right aligned */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            ml: 'auto',
            zIndex: 2
          }}>
            <Avatar
              src={currentUser?.avatarUrl || ''}
              alt={currentUser?.firstName || 'User'}
              sx={{ width: 40, height: 40 }}
            >
              {currentUser?.firstName?.[0] || 'U'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
                {currentUser?.firstName} {currentUser?.lastName}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                @{currentUser?.username}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ 
          width: { md: drawerWidth }, 
          flexShrink: { md: 0 },
          zIndex: 1300 // Higher z-index than AppBar
        }}
      >
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: colors.background.paper,
              borderRight: '1px solid rgba(0,0,0,0.05)',
              position: 'fixed',
              height: '100vh',
              zIndex: 1300
            },
          }}
          open
        >
          {sidebar}
        </Drawer>
        
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: colors.background.paper,
              borderRight: '1px solid rgba(0,0,0,0.05)',
              zIndex: 1400 // Highest z-index for mobile overlay
            },
          }}
        >
          {sidebar}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` }, // Add left margin to account for fixed sidebar
          mt: 8, // Account for AppBar height
          background: colors.background.default,
          minHeight: 'calc(100vh - 64px)', // Subtract AppBar height
          zIndex: 1, // Lower z-index than sidebar and navbar
          position: 'relative'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout; 