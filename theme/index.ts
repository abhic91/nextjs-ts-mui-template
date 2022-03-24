import defaultTheme from 'theme/default.theme';
import spiceMoneyTheme from 'theme/spiceMoney.theme';
import { T_WhitelabelBusinessKeys } from 'whitelabel/whitelabel';
import policyBossTheme from './policy.theme';
import xolttTheme from './xoltt.theme';

export type T_AllThemes = {
  // eslint-disable-next-line no-unused-vars
  [key in T_WhitelabelBusinessKeys]: any;
};
const allThemes: T_AllThemes = {
  default: defaultTheme,
  xoltt: xolttTheme,
  policyBoss: policyBossTheme,
  genpay: defaultTheme,
  spiceMoney: spiceMoneyTheme,
};

export default allThemes;
