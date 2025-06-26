import React from 'react';
import { Box, IconButton, Avatar, Button, Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import MicIcon from '@mui/icons-material/Mic';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import LinkIcon from '@mui/icons-material/Link';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// CSS variables for design tokens
const designVars = {
  navHeight: 48,
  inputHeight: 56,
  border: '#E6E6E6',
  bg: '#FFFFFF',
  inputBg: '#F8F8F8',
  userMsgBg: '#F2F2F2',
  inputBorder: '#DCDCDC',
  font: 'Inter, system-ui, sans-serif',
  grayText: '#A0A0A0',
  iconGray: '#BDBDBD',
  footerBg: '#F5F5F5',
};

const ChatGPTMockup = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: designVars.bg,
        fontFamily: designVars.font,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Navigation Bar */}
      <Box
        sx={{
          height: designVars.navHeight,
          borderBottom: `1px solid ${designVars.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 1, sm: 3 },
          bgcolor: designVars.bg,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        {/* Left: App name */}
        <Box sx={{ fontWeight: 600, fontSize: 18, color: '#222', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          ChatGPT <ExpandMoreIcon sx={{ fontSize: 20, color: designVars.iconGray, ml: 0.5 }} />
        </Box>
        {/* Right: Share, button, menu, avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" sx={{ color: designVars.iconGray }}><ShareIcon /></IconButton>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderColor: designVars.border,
              color: '#222',
              fontWeight: 500,
              fontSize: 14,
              px: 2,
              py: 0.5,
              borderRadius: 3,
              textTransform: 'none',
              minWidth: 0,
            }}
          >
            Share
          </Button>
          <IconButton size="small" sx={{ color: designVars.iconGray }}><MoreVertIcon /></IconButton>
          <Avatar sx={{ width: 32, height: 32, ml: 1, bgcolor: designVars.inputBorder }} />
        </Box>
      </Box>

      {/* Chat Canvas */}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: 680,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          pt: { xs: 2, sm: 4 },
          pb: { xs: 10, sm: 12 },
        }}
      >
        {/* Assistant message (left) */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: designVars.inputBorder, mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                minHeight: 44,
                bgcolor: designVars.bg,
                border: `1px solid ${designVars.border}`,
                borderRadius: 3,
                px: 2,
                py: 1.5,
                fontSize: 16,
                color: '#222',
                boxShadow: 'none',
                mb: 1,
              }}
            >
              {/* Empty assistant message */}
            </Box>
            {/* Tool/action bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 0.5 }}>
              <IconButton size="small" sx={{ color: designVars.iconGray }}><ThumbUpOffAltIcon /></IconButton>
              <IconButton size="small" sx={{ color: designVars.iconGray }}><ThumbDownOffAltIcon /></IconButton>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: designVars.border }} />
              <IconButton size="small" sx={{ color: designVars.iconGray }}><VolumeUpIcon /></IconButton>
              <IconButton size="small" sx={{ color: designVars.iconGray }}><LinkIcon /></IconButton>
              <IconButton size="small" sx={{ color: designVars.iconGray }}><RefreshIcon /></IconButton>
              <IconButton size="small" sx={{ color: designVars.iconGray }}><ExpandMoreIcon /></IconButton>
            </Box>
          </Box>
        </Box>

        {/* User message (right) */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 5 }}>
          <Box
            sx={{
              minHeight: 44,
              bgcolor: designVars.userMsgBg,
              borderRadius: 3,
              px: 2,
              py: 1.5,
              fontSize: 16,
              color: '#222',
              boxShadow: 'none',
              maxWidth: '70%',
              border: `1px solid ${designVars.inputBorder}`,
            }}
          >
            {/* Empty user message */}
          </Box>
        </Box>
      </Box>

      {/* Input Composer (fixed at bottom) */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          bottom: 0,
          width: '100%',
          bgcolor: designVars.bg,
          borderTop: `1px solid ${designVars.inputBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: { xs: 72, sm: designVars.inputHeight },
          zIndex: 20,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 680,
            display: 'flex',
            alignItems: 'center',
            px: { xs: 1, sm: 2 },
            py: 1,
            gap: 1.5,
          }}
        >
          <IconButton size="large" sx={{ color: designVars.iconGray }}><AddIcon /></IconButton>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderColor: designVars.inputBorder,
              color: '#222',
              fontWeight: 500,
              fontSize: 14,
              px: 2,
              py: 0.5,
              borderRadius: 3,
              textTransform: 'none',
              minWidth: 0,
            }}
          >
            Tools
          </Button>
          <Box
            sx={{
              flex: 1,
              mx: 1,
              height: 44,
              bgcolor: designVars.inputBg,
              border: `1px solid ${designVars.inputBorder}`,
              borderRadius: 3,
              px: 2,
              display: 'flex',
              alignItems: 'center',
              fontSize: 16,
              color: designVars.grayText,
              fontFamily: designVars.font,
              outline: 'none',
              minWidth: 0,
            }}
          >
            {/* Placeholder for input, but empty */}
          </Box>
          <IconButton size="large" sx={{ color: designVars.iconGray }}><MicIcon /></IconButton>
          <IconButton size="large" sx={{ color: designVars.iconGray }}><GraphicEqIcon /></IconButton>
        </Box>
      </Box>

      {/* Footer Disclaimer */}
      <Box
        sx={{
          width: '100%',
          bgcolor: designVars.footerBg,
          borderTop: `1px solid ${designVars.border}`,
          textAlign: 'center',
          fontSize: 14,
          color: designVars.grayText,
          py: 1.5,
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 5,
          display: { xs: 'none', sm: 'block' },
        }}
      >
        Text here
      </Box>
    </Box>
  );
};

export default ChatGPTMockup; 