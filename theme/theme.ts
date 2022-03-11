import { createTheme } from '@mui/material/styles';
const fontFamilies = [
  'PPTelegraf',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Oxygen',
  'Ubuntu',
  'Cantarell',
  'Fira Sans',
  'Droid Sans',
  'Helvetica Neue',
  'sans-serif',
].join(',');

export const topNavHeight = '55';

const colorPalette = createTheme({
  palette: {
    primary: {
      main: '#6E44FD',
      light: '#6e44fda8',
      dark: '#6036ec',
    },
    secondary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    text: {
      primary: '#070719',
      secondary: '#393947',
    },
    background: { default: '#fff' },
  },
});
export default createTheme({
  ...colorPalette,
  typography: {
    fontFamily: fontFamilies,
    lightgray: { ...colorPalette.typography.subtitle2, color: '#6A6A75', fontFamily: fontFamilies },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'capitalize',
          minHeight: '36px',
        },
      },
      defaultProps: {
        variant: 'contained',
      },
      variants: [
        {
          props: { variant: 'link' },
          style: {
            backgroundColor: 'transparent',
            color: colorPalette.palette.primary.main,
            padding: 0,
            margin: 0,
            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
          },
        },
        { props: { variant: 'no-style' }, style: { all: 'unset' } },
      ],
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 8 } },
      defaultProps: {},
    },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiCircularProgress: {
      defaultProps: { style: { width: '20px', height: '20px' } },
    },
    MuiRadio: { defaultProps: { size: 'small' } },
    MuiAppBar: { styleOverrides: { root: { height: topNavHeight + 'px' } } },
  },
});
