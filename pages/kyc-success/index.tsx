import { Box, Fade, Typography } from '@mui/material';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import SuccessIcon from '../../components/Icons/SuccessIcon';
import { topNavHeight } from '../../theme/theme';
import classes from './index.module.css';

const KycSuccess: NextPage = () => {
  const { t } = useTranslation(['success-page']);
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    setShowPage(true);
  }, []);
  return (
    <Fade in={showPage} timeout={800}>
      <Box
        className={classes.successPageWrapper}
        sx={{ height: `calc(100vh - ${topNavHeight}px)`, display: 'grid', placeContent: 'center' }}>
        <Box
          sx={{
            borderRadius: 2,
            boxShadow: 1,
            p: 4,
          }}>
          <Box sx={{ display: 'grid', placeContent: 'center' }}>
            <SuccessIcon />
          </Box>
          <Typography variant="h5" textAlign="center" sx={{ mt: 3, mb: 1 }}>
            {t('kyc-completed')}
          </Typography>
          <Typography variant="caption" textAlign="center" component="h6">
            {t('will-take')}
          </Typography>
          <Typography variant="lightgray" textAlign="center">
            {t('will-inform')}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['success-page'])),
    },
  };
};

export default KycSuccess;
