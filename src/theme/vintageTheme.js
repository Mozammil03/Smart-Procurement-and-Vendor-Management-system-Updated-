import { createTheme } from '@mui/material/styles';

const vintageTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6e5135',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d9c7a5',
      contrastText: '#3f2c1e',
    },
    background: {
      default: '#f6ead8',
      paper: '#f8f1e6',
    },
    text: {
      primary: '#3f2c1e',
      secondary: '#6d5138',
    },
    divider: '#d3b592',
    action: {
      hover: 'rgba(180, 138, 65, 0.14)',
      selected: '#e5d1b1',
    },
  },
  typography: {
    fontFamily: `"Playfair Display", Georgia, "Times New Roman", serif`,
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
    h1: {
      fontWeight: 800,
      letterSpacing: '0.02em',
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '0.02em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.75,
    },
    body2: {
      fontSize: '0.95rem',
      lineHeight: 1.7,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f5ebe0',
          color: '#3f2c1e',
          fontFamily: `"Playfair Display", Georgia, "Times New Roman", serif`,
          backgroundImage:
            'radial-gradient(circle at top left, rgba(255, 255, 255, 0.8), transparent 25%), radial-gradient(circle at bottom right, rgba(255,255,255,0.6), transparent 20%)',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8efe3',
          border: '1px solid rgba(140, 114, 79, 0.18)',
          boxShadow: '0 18px 45px rgba(84, 55, 31, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5ede2',
          color: '#3f2c1e',
          boxShadow: '0 5px 20px rgba(59, 41, 20, 0.12)',
          borderBottom: '1px solid rgba(140, 114, 79, 0.14)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f5ede2',
          border: 'none',
          boxShadow: '2px 0 18px rgba(84, 55, 31, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '14px',
          boxShadow: 'none',
          fontFamily: `"Playfair Display", Georgia, "Times New Roman", serif`,
          letterSpacing: '0.03em',
        },
        contained: {
          backgroundColor: '#e6d4b7',
          color: '#3f2c1e',
          boxShadow: '0 8px 18px rgba(93, 62, 35, 0.12)',
          '&:hover': {
            backgroundColor: '#d8c3a0',
          },
        },
        containedPrimary: {
          backgroundColor: '#6e5135',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#5f4630',
          },
        },
        containedSecondary: {
          backgroundColor: '#d9c7a5',
          color: '#3f2c1e',
          '&:hover': {
            backgroundColor: '#c8b08c',
          },
        },
        outlined: {
          borderColor: '#d3b58f',
          color: '#3f2c1e',
          '&:hover': {
            backgroundColor: 'rgba(217, 181, 137, 0.16)',
          },
        },
        text: {
          color: '#3f2c1e',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '14px',
          '&.Mui-selected': {
            backgroundColor: '#e5d1b1',
            color: '#3f2c1e',
            '& .MuiListItemIcon-root': {
              color: '#6e5135',
            },
          },
          '&:hover': {
            backgroundColor: '#eed9bf',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#6e5135',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff7ea',
          borderRadius: '14px',
          '& fieldset': {
            borderColor: '#d3b592',
          },
          '&:hover fieldset': {
            borderColor: '#b48a41',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#6e5135',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#5e4734',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: '0.01em',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#fbf1e4',
          border: '1px solid rgba(140, 114, 79, 0.12)',
          boxShadow: '0 12px 30px rgba(84, 55, 31, 0.08)',
        },
      },
    },
  },
});

export default vintageTheme;
