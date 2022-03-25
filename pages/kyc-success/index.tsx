import { Box, Fade, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ReactNode, useEffect, useRef, useState } from 'react';
// import SuccessIcon from 'components/Icons/SuccessIcon';
import classes from 'pages/kyc-success/index.module.css';
import { T_SingleBusinessWhitelabelInfo } from 'whitelabel/whitelabel';
// import Image from 'next/image';
import Head from 'next/head';
import lottieWeb from 'lottie-web';

const KycSuccess = (props: { children?: ReactNode; selectedBusinessWhitelabelValues: T_SingleBusinessWhitelabelInfo }) => {
  const { t } = useTranslation(['success-page']);
  const [showPage, setShowPage] = useState(false);
  const animationWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowPage(true);
    lottieWeb.loadAnimation({
      container: animationWrapperRef.current!,
      path: 'animations/success-lottie-animation.json',
      renderer: 'svg',
      loop: false,
      autoplay: true,
      name: 'Success Animation',
    });
  }, []);
  return (
    <>
      <Head>
        <title>{`${props.selectedBusinessWhitelabelValues.businessName} - KYC Successful`}</title>
      </Head>
      <Fade in={showPage} timeout={800}>
        <Box className={`${classes.successPageWrapper} `} sx={{ minHeight: '30vh', display: 'grid', placeContent: 'center' }}>
          <Box
            sx={{
              pt: 2,
              pb: 5,
              borderRadius: 2,
              backgroundColor: `var(--default-bg)`,
            }}>
            <Box sx={{ width: '200px', height: '200px', margin: 'auto' }} ref={animationWrapperRef}></Box>
            <Typography variant="h5" fontWeight="700" textAlign="center" sx={{ mt: -4, mb: 1 }}>
              {t('kyc-completed')}
            </Typography>
            <Typography variant="subtitle2" textAlign="center" component="p" sx={{ mb: 1 }}>
              {t('will-take')}
            </Typography>
            <Typography variant="lightgray" textAlign="center" component="p" sx={{ mt: 3 }}>
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
