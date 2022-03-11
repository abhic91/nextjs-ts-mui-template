import { AppBar, Box } from '@mui/material';
import BusinessLogo from '../BusinessLogo/BusinessLogo';
import { ReactElement } from 'react';
import { topNavHeight } from '../../theme/theme';

type LayoutProps = {
  children: ReactElement;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        elevation={0}
        className={`custom-box-shadow-2`}
        sx={{ backgroundColor: '#fff', height: `${topNavHeight}px`, borderRadius: 1.4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <BusinessLogo />
        </Box>
        {/* <Box sx={{ minHeight: `${topNavHeight}px` }}></Box> */}
      </AppBar>
      <Box sx={{ minHeight: `calc(100vh - ${topNavHeight}px)`, pt: { xs: 1, sm: 3 } }} style={{ backgroundColor: '#dcd8e926 ' }}>
        {children}
      </Box>
    </Box>
  );
};
export default Layout;
