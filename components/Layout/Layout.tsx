import { AppBar, Box } from '@mui/material';
import BusinessLogo from '../BusinessLogo/BusinessLogo';
import { ReactElement } from 'react';

type LayoutProps = {
  children: ReactElement;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={2} sx={{ backgroundColor: '#fff', height: '75px', borderRadius: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
          <BusinessLogo />
        </Box>
      </AppBar>
      <Box>{children}</Box>
    </Box>
  );
};
export default Layout;
