export type T_SingleBusinessWhitelabelInfo = {
  businessName: string;
  businessLogo: string;
  businessKey: T_WhitelabelBusinessKeys;
  bgImage: string | null;
  poweredByImg: string | null;
};
export type T_WhitelabelBusinesses = {
  default: T_SingleBusinessWhitelabelInfo;
  policyBoss: T_SingleBusinessWhitelabelInfo;
  xoltt: T_SingleBusinessWhitelabelInfo;
  genpay: T_SingleBusinessWhitelabelInfo;
  spiceMoney: T_SingleBusinessWhitelabelInfo;
};

export type T_WhitelabelBusinessKeys = keyof T_WhitelabelBusinesses;

const whitelabel: T_WhitelabelBusinesses = {
  default: {
    businessName: 'CARD91',
    businessLogo: 'images/business-logos/card91_logo.png',
    businessKey: 'default',
    bgImage: 'images/bg-image.png',
    poweredByImg: 'images/business-logos/card91_logo.png',
  },
  xoltt: {
    businessName: 'Xoltt',
    businessLogo: 'images/business-logos/xoltt_logo.svg',
    businessKey: 'xoltt',
    bgImage: 'images/bg-image.png',
    poweredByImg: 'images/business-logos/card91_logo.png',
  },
  policyBoss: {
    businessName: 'PolicyBoss',
    businessLogo: 'images/business-logos/policyboss_logo.svg',
    businessKey: 'policyBoss',
    bgImage: 'images/bg-image.png',
    poweredByImg: 'images/business-logos/card91_logo.png',
  },
  genpay: {
    businessName: 'Genpay',
    businessLogo: 'images/business-logos/Genpay_logo.png',
    businessKey: 'genpay',
    bgImage: 'images/bg-image.png',
    poweredByImg: null,
  },
  spiceMoney: {
    businessName: 'Spice Money',
    businessLogo: 'images/business-logos/Spicemoney_logo.png',
    businessKey: 'spiceMoney',
    bgImage: 'images/bg-image.png',
    poweredByImg: null,
  },
};

export default whitelabel;
