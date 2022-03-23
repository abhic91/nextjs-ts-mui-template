import { Box, Divider, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import Image from 'next/image';
import { T_SingleBusinessWhitelabelInfo } from 'whitelabel/whitelabel';

const Footer = ({ businessName, poweredByImg }: T_SingleBusinessWhitelabelInfo) => {
  const fullYear = new Date().getFullYear();
  return (
    <Box sx={{ marginTop: 'auto', marginBottom: 2, pt: { xs: 3 } }}>
      <footer>
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'space-around', px: 3 }}>
          <Typography color={grey[700]} variant="body2">
            Privacy Policy
          </Typography>
          <Typography color={grey[700]} variant="body2">
            Terms
          </Typography>
          <Typography color={grey[700]} variant="body2">
            Contact
          </Typography>
        </Box>
        <Divider sx={{ my: 2.5 }} variant="middle"></Divider>
        <Box sx={{ px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color={grey[500]}>
            &copy; {businessName} {fullYear}
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'space-around', px: 3 }}>
            <Typography color={grey[700]} variant="body2">
              Privacy Policy
            </Typography>
            <Typography color={grey[700]} variant="body2" sx={{ mx: 2 }}>
              Terms
            </Typography>
            <Typography color={grey[700]} variant="body2">
              Contact
            </Typography>
          </Box>
          {poweredByImg && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color={grey[500]} sx={{ mr: 1 }}>
                Powered by
              </Typography>
              <Image src={`/${poweredByImg}`} width={70} height={50} objectFit="contain" alt="logo" />
            </Box>
          )}
        </Box>
      </footer>
    </Box>
  );
};

export default Footer;
