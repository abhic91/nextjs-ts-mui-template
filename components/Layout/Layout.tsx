import { Box } from '@mui/material';
import BusinessLogo from '../BusinessLogo/BusinessLogo';
import { ReactElement } from 'react';

type LayoutProps = {
  children: ReactElement;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
        <BusinessLogo />
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};
export default Layout;
