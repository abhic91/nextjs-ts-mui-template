import { createTheme } from '@mui/material';
import { T_WhitelabelBusinessKeys } from 'whitelabel/whitelabel';
import policyBossTheme from './policy.theme';
import { getCommonThemeSettings } from './themes.constants';
import xolttTheme from './xoltt.theme';

export type T_AllThemes = {
  // eslint-disable-next-line no-unused-vars
  [key in T_WhitelabelBusinessKeys]: any;
};
const allThemes: T_AllThemes = {
  xoltt: createTheme(xolttTheme, getCommonThemeSettings(xolttTheme)),
  policyBoss: createTheme(policyBossTheme, getCommonThemeSettings(policyBossTheme)),
};

export default allThemes;
