import { FormControlLabelProps } from '@mui/material/styles';
declare module '@mui/material/Button' {
  /**
   * Custom variant for Mui button styled as a link
   */
  interface ButtonPropsVariantOverrides {
    link: true;
    'no-style': true;
  }
}
declare module '@mui/material/styles' {
  interface TypographyVariants {
    lightgray: React.CSSProperties;
  }
  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    lightgray?: React.CSSProperties;
  }
}
// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    lightgray: true;
  }
}
