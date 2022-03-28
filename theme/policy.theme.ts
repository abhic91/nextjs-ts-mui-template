import { createTheme } from '@mui/material';
import { fontFamilies } from './themes.constants';

const policyBossTheme = createTheme({
  palette: {
    primary: {
      main: '#E1222D',
      light: '#e63235d1',
      dark: '#d20d18',
      verylightprimary: '#ce86860f',
    },
  },
  typography: {
    fontFamily: fontFamilies,
  },
});

export default policyBossTheme;
