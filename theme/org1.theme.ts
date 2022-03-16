import { createTheme } from '@mui/material/styles';
import defaultTheme from './default.theme';
export default createTheme({
  typography: {
    ...defaultTheme.typography,
  },
  components: {
    ...defaultTheme.components,
  },
});
