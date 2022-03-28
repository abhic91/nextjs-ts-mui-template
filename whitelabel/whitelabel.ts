export type T_SingleBusinessWhitelabelInfo = {
  businessName: string;
  businessLogo: string;
  businessKey: T_WhitelabelBusinessKeys;
  bgImage: string | null;
  poweredByImg: string | null;
  linkToPrivacyPolicy: string | null;
};
export type T_WhitelabelBusinesses = {
  policyBoss: T_SingleBusinessWhitelabelInfo;
  xoltt: T_SingleBusinessWhitelabelInfo;
};

export type T_WhitelabelBusinessKeys = keyof T_WhitelabelBusinesses;

const whitelabel: T_WhitelabelBusinesses = {
  xoltt: {
    businessName: 'Xoltt',
    businessLogo: 'images/business-logos/xoltt_logo.svg',
    businessKey: 'xoltt',
    bgImage: 'images/bg-image.png',
    poweredByImg: 'images/business-logos/card91_logo.png',
    linkToPrivacyPolicy: 'https://www.xoltt.com/wp-content/uploads/2022/03/Xoltt_Unified-Privacy-Policy.pdf',
  },
  policyBoss: {
    businessName: 'PolicyBoss',
    businessLogo: 'images/business-logos/policyboss_logo.svg',
    businessKey: 'policyBoss',
    bgImage: 'images/bg-image.png',
    poweredByImg: null,
    linkToPrivacyPolicy: '#',
  },
};

export default whitelabel;
