import {} from '@mui/material';
declare module '@mui/material/Button' {
  /**
   * Custom variant for Mui button styled as a link
   */
  interface ButtonPropsVariantOverrides {
    link: true;
  }
}
