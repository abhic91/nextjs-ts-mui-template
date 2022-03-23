import defaultTheme from 'theme/default.theme';
import { topNavHeight } from 'theme/themes.constants';

const spiceMoneyColorPalette = {
  palette: {
    primary: {
      // main: '#ce8686',
      main: '#e12726',
      light: '#ce86869c',
      dark: '#d73030',
      verylightprimary: '#ce86860f',
    },
  },
};

const spiceMoneyTheme = {
  ...spiceMoneyColorPalette,
  typography: {
    ...defaultTheme.typography, //TODO: CHANGE PALETTE FROM DEFAULT
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
            color: spiceMoneyColorPalette.palette.primary.main,
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
export default spiceMoneyTheme;
