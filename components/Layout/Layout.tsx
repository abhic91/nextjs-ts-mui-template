import { AppBar, Box } from '@mui/material';
import BusinessLogo from 'components/BusinessLogo/BusinessLogo';
import Footer from 'components/Footer/Footer';
import { ReactElement } from 'react';
import { topNavHeight } from 'theme/themes.constants';
// import { useTheme } from '@mui/system';
import { T_SingleBusinessWhitelabelInfo } from 'whitelabel/whitelabel';
import styles from 'components/Layout/Layout.module.css';

type LayoutProps = {
  children: ReactElement;
  selectedBusinessWhitelabelValues: T_SingleBusinessWhitelabelInfo;
};

const Layout = ({ children, selectedBusinessWhitelabelValues }: LayoutProps) => {
  // const theme = useTheme();
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#e5e5e54f' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: '#fff',
          height: `${topNavHeight}px`,
          boxShadow: `0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.1)`,
        }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <BusinessLogo businessLogo={selectedBusinessWhitelabelValues.businessLogo} />
        </Box>
        {/* <Box sx={{ minHeight: `${topNavHeight}px` }}></Box> */}
      </AppBar>
      <Box className={styles.contentWrapper}>{children}</Box>
      <Footer {...selectedBusinessWhitelabelValues}></Footer>
    </Box>
  );
};
export default Layout;
