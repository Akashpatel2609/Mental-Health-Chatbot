import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link as RouterLink } from 'react-router-dom';
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
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
  InputAdornment
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
  Menu as MuiMenu,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';
import logo from '../assets/mira-logo.png';

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Placeholder wellness score (replace with real stats)
  const wellnessScore = userStats?.wellness_score ?? 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Dropdown handlers
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  // Settings modal handlers
  const handleSettingsOpen = () => { setSettingsOpen(true); handleProfileMenuClose(); };
  const handleSettingsClose = () => { setSettingsOpen(false); setPassword(''); setConfirmPassword(''); setPasswordError(''); setPasswordSuccess(''); };

  // Privacy modal handlers
  const handlePrivacyOpen = () => { setPrivacyOpen(true); handleProfileMenuClose(); };
  const handlePrivacyClose = () => setPrivacyOpen(false);

  // Account modal handlers
  const handleAccountOpen = () => { setAccountOpen(true); handleProfileMenuClose(); };
  const handleAccountClose = () => setAccountOpen(false);

  // Password change logic
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    try {
      // Call backend endpoint to change password
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (data.success) {
        setPasswordSuccess('Password updated successfully!');
        setPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setPasswordError('Failed to update password');
    }
  };

  const sidebar = (
    <Box
      sx={{
        height: '100vh',
        background: colors.neutral.darkGray,
        color: colors.primary.contrastText,
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
          sx={{ width: 72, height: 72, mb: 1, boxShadow: 2 }}
        >
          {(currentUser?.firstName?.[0] || currentUser?.username?.[0] || 'U').toUpperCase()}
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
              color: colors.primary.contrastText,
              '&.active': {
                background: colors.gradients.secondary,
                color: colors.neutral.darkGray,
                boxShadow: 2,
                '& .MuiListItemIcon-root': { color: colors.neutral.darkGray },
              },
              '&:hover': {
                background: colors.gradients.primary,
                color: colors.primary.contrastText,
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
      background: colors.background.default,
      position: 'relative',
      overflow: 'hidden' // Prevent horizontal scrollbars
    }}>
      {/* Top Navbar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: 1200, // Lower z-index than drawer
          background: colors.neutral.darkGray, // Use darkest color
          color: colors.primary.contrastText,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          height: 64
        }}
      >
        <Toolbar sx={{ height: 64, minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: colors.primary.main }}
            >
              <MuiMenu />
            </IconButton>
          )}
          {/* Logo - Centered with flexGrow */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexGrow: 1,
              textDecoration: 'none',
              cursor: 'pointer',
              minHeight: 56
            }}
          >
            <img src={logo} alt="MIRA Logo" style={{ height: 48, width: 'auto', display: 'block' }} />
          </Box>
          {/* Profile Avatar with Dropdown - always at right */}
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              size="large"
              edge="end"
              color="inherit"
              sx={{ p: 0 }}
            >
              <Avatar sx={{ bgcolor: colors.primary.main, color: colors.primary.contrastText, fontWeight: 700 }}>
                {(currentUser?.firstName?.[0] || currentUser?.username?.[0] || 'U').toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{ sx: { mt: 1, minWidth: 180 } }}
            >
              <MenuItem onClick={handleSettingsOpen}>Change Password</MenuItem>
              <MenuItem onClick={handleAccountOpen}>Account Details</MenuItem>
              <MenuItem onClick={handlePrivacyOpen}>Privacy Policy</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Settings Modal */}
      <Modal open={settingsOpen} onClose={handleSettingsClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, borderRadius: 3, p: 4, minWidth: 340 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Settings</Typography>
          <form onSubmit={handlePasswordChange}>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {passwordError && <Typography color="error" sx={{ mb: 1 }}>{passwordError}</Typography>}
            {passwordSuccess && <Typography color="success.main" sx={{ mb: 1 }}>{passwordSuccess}</Typography>}
            <Button type="submit" variant="contained" color="primary" fullWidth>Change Password</Button>
          </form>
        </Box>
      </Modal>

      {/* Account Details Modal */}
      <Modal open={accountOpen} onClose={handleAccountClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, borderRadius: 3, p: 4, minWidth: 340 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Account Details</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}><b>Name:</b> {currentUser?.firstName} {currentUser?.lastName}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}><b>Username:</b> {currentUser?.username}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}><b>Email:</b> {currentUser?.email}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}><b>Age:</b> {currentUser?.age}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}><b>Gender:</b> {currentUser?.gender}</Typography>
          <Button onClick={handleAccountClose} variant="outlined" sx={{ mt: 2 }} fullWidth>Close</Button>
        </Box>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal open={privacyOpen} onClose={handlePrivacyClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, borderRadius: 3, p: 4, minWidth: 340, maxWidth: 500 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Privacy Policy</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            This is a demo privacy policy. Your data is stored securely and is never shared with third parties. For more information, contact support.
          </Typography>
          <Button onClick={handlePrivacyClose} variant="outlined" sx={{ mt: 2 }} fullWidth>Close</Button>
        </Box>
      </Modal>

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
          p: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          ml: { md: `${drawerWidth}px` }, // Add left margin to account for fixed sidebar
          mt: 8, // Account for AppBar height
          background: colors.background.default,
          minHeight: 'calc(100vh - 64px)', // Subtract AppBar height
          zIndex: 1, // Lower z-index than sidebar and navbar
          position: 'relative',
          maxWidth: { xs: '100%', md: '1100px' },
          mx: 'auto', // Center main content horizontally
          boxSizing: 'border-box',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout; 