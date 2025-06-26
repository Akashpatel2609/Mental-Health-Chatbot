import { createTheme } from '@mui/material/styles';

// Premium healthcare professional color palette
const colors = {
  // Primary colors - Blue Sky
  primary: {
    main: '#4F8CFF', // Primary
    light: '#A3C9FF', // Lighter blue
    dark: '#1E4DB7', // For contrast
    contrastText: '#FFFFFF' // For text on primary
  },
  
  // Secondary colors - Soft Coral
  secondary: {
    main: '#FFB385', // Secondary
    light: '#FFE0CC', // Lighter coral
    dark: '#FF8C42', // Deeper accent
    contrastText: '#222B45' // For text on secondary
  },
  
  // Accent colors - Fresh Green
  accent: {
    main: '#6EE7B7',
    light: '#D1FAE5',
    dark: '#059669',
    contrastText: '#222B45'
  },
  
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    lightGray: '#F9FAFB',
    gray: '#E5E7EB',
    mediumGray: '#A1A9B8',
    darkGray: '#222B45',
    charcoal: '#222B45'
  },
  
  // Success, warning, error, info
  success: {
    main: '#6EE7B7',
    light: '#D1FAE5',
    dark: '#059669'
  },
  warning: {
    main: '#FFB385',
    light: '#FFE0CC',
    dark: '#FF8C42'
  },
  error: {
    main: '#FF6B6B',
    light: '#FFB3B3',
    dark: '#C70000'
  },
  info: {
    main: '#4F8CFF',
    light: '#A3C9FF',
    dark: '#1E4DB7'
  },
  
  // Background gradients
  gradients: {
    primary: 'linear-gradient(135deg, #A3C9FF 0%, #4F8CFF 100%)',
    secondary: 'linear-gradient(135deg, #FFB385 0%, #FFE0CC 100%)',
    accent: 'linear-gradient(135deg, #6EE7B7 0%, #D1FAE5 100%)',
    neutral: 'linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)',
    landing: 'linear-gradient(135deg, #F9FAFB 0%, #A3C9FF 100%)',
    premium: 'linear-gradient(135deg, #A3C9FF 0%, #4F8CFF 100%)',
    medical: 'linear-gradient(135deg, #F9FAFB 0%, #6EE7B7 100%)'
  },
  
  // Text colors
  text: {
    primary: '#222B45', // For main text
    secondary: '#6B7280', // For secondary text
    disabled: '#A1A9B8',
    hint: '#A1A9B8'
  },
  
  // Background colors
  background: {
    default: '#F9FAFB', // Main background
    paper: '#FFFFFF', // White for cards
    card: '#FFFFFF', // White for cards
    sidebar: '#F9FAFB' // Soft background for sidebar/nav
  }
};

const theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    text: colors.text,
    background: colors.background,
    grey: {
      50: '#F5F7FA',
      100: '#E8EDF2',
      200: '#D1D5DB',
      300: '#9CA3AF',
      400: '#6B7280',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827'
    }
  },
  
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      color: colors.text.primary
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      color: colors.text.primary
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
      color: colors.text.primary
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: colors.text.primary
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
      color: colors.text.primary
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
      color: colors.text.primary
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: colors.text.secondary
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: colors.text.secondary
    },
    button: {
      fontWeight: 600,
      textTransform: 'none'
    }
  },
  
  shape: {
    borderRadius: 12
  },
  
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(0,0,0,0.14)',
    '0px 20px 40px rgba(0,0,0,0.16)',
    '0px 24px 48px rgba(0,0,0,0.18)',
    '0px 28px 56px rgba(0,0,0,0.2)',
    '0px 32px 64px rgba(0,0,0,0.22)',
    '0px 36px 72px rgba(0,0,0,0.24)',
    '0px 40px 80px rgba(0,0,0,0.26)',
    '0px 44px 88px rgba(0,0,0,0.28)',
    '0px 48px 96px rgba(0,0,0,0.3)',
    '0px 52px 104px rgba(0,0,0,0.32)',
    '0px 56px 112px rgba(0,0,0,0.34)',
    '0px 60px 120px rgba(0,0,0,0.36)',
    '0px 64px 128px rgba(0,0,0,0.38)',
    '0px 68px 136px rgba(0,0,0,0.4)',
    '0px 72px 144px rgba(0,0,0,0.42)',
    '0px 76px 152px rgba(0,0,0,0.44)',
    '0px 80px 160px rgba(0,0,0,0.46)',
    '0px 84px 168px rgba(0,0,0,0.48)',
    '0px 88px 176px rgba(0,0,0,0.5)'
  ],
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          textTransform: 'none',
          padding: '10px 24px',
          fontSize: '0.875rem',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)'
          }
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0,0,0,0.15)'
          }
        }
      }
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 8px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)'
        }
      }
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: colors.background.paper,
            '&:hover fieldset': {
              borderColor: colors.primary.main
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main
            }
          }
        }
      }
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0px 2px 20px rgba(0,0,0,0.08)',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }
      }
    },
    
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.background.sidebar,
          borderRight: '1px solid rgba(0,0,0,0.05)'
        }
      }
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500
        }
      }
    }
  }
});

export { theme, colors }; 