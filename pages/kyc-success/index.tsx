import { Box, Fade, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ReactNode, useEffect, useState } from 'react';
// import SuccessIcon from 'components/Icons/SuccessIcon';
import classes from 'pages/kyc-success/index.module.css';
import { T_SingleBusinessWhitelabelInfo } from 'whitelabel/whitelabel';
import Image from 'next/image';
import Head from 'next/head';

const KycSuccess = (props: { children?: ReactNode; selectedBusinessWhitelabelValues: T_SingleBusinessWhitelabelInfo }) => {
  const { t } = useTranslation(['success-page']);
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    setShowPage(true);
  }, []);
  return (
    <>
      <Head>
        <title>{`${props.selectedBusinessWhitelabelValues.businessName} - KYC Successful`}</title>
      </Head>
      <Fade in={showPage} timeout={800}>
        <Box className={`${classes.successPageWrapper} `} sx={{ minHeight: '50vh' }}>
          <Box
            sx={{
              p: 4,
              mt: 2,
              borderRadius: 2,
              backgroundColor: `var(--default-bg)`,
            }}>
            <Box sx={{ display: 'grid', placeContent: 'center' }}>
              <Image alt="success" src={`/images/success.png`} width="200" height="200" />
            </Box>
            <Typography variant="h5" fontWeight="700" textAlign="center" sx={{ mt: 3, mb: 1 }}>
              {t('kyc-completed')}
            </Typography>
            <Typography variant="subtitle2" textAlign="center" component="p" sx={{ mb: 1 }}>
              {t('will-take')}
            </Typography>
            <Typography variant="lightgray" textAlign="center" component="p">
              {t('will-inform')}
            </Typography>
          </Box>
        </Box>
      </Fade>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['success-page'])),
    },
  };
};

export default KycSuccess;
