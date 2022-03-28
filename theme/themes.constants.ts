import { Theme } from '@mui/material';
import { createTheme } from '@mui/system';
import { T_WhitelabelBusinessKeys } from 'whitelabel/whitelabel';

export const topNavHeight = '60';
export const defaultThemeKey: T_WhitelabelBusinessKeys = 'xoltt';

export const fontFamilies = [
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

export const defaultMuiTheme = createTheme({});

export const getCommonThemeSettings = ({ palette, typography }: Theme) => {
  return {
    typography: {
      fontFamily: fontFamilies,
      lightgray: { ...typography.subtitle2, color: '#6A6A75', fontFamily: fontFamilies },
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
              color: palette.primary.main,
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
  };
};
