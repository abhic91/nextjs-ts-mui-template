import { createTheme } from '@mui/material/styles';

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
  },
});
export default createTheme({
  ...colorPalette,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'capitalize',
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
            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
          },
        },
      ],
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 8 } },
      defaultProps: {},
    },
    MuiTextField: { defaultProps: { size: 'small' } },
  },
});
