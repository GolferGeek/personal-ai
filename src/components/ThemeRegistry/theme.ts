import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Create a basic theme instance.
// You can customize this theme further based on project requirements.
const theme = createTheme({
  palette: {
    mode: 'light', // Default to light mode, can add dark mode later
    primary: {
      main: '#1976d2', // Example primary color (Material UI blue)
    },
    secondary: {
      main: '#dc004e', // Example secondary color (Material UI pink)
    },
    // background: {
    //   default: '#f4f6f8',
    //   paper: '#ffffff',
    // },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    // Define other typography variants as needed
  },
  components: {
    // Example: Customizing MuiButton default props
    // MuiButton: {
    //   defaultProps: {
    //     disableElevation: true,
    //     variant: 'contained',
    //   },
    //   styleOverrides: {
    //     root: {
    //       textTransform: 'none', // Example override
    //     },
    //   },
    // },
    // Customize other components
  },
});

export default theme; 