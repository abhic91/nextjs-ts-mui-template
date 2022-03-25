import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  InputAdornment,
  Slide,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { registerWithBankApi, verifyOTPApi } from 'api-requests/verify';
import CountDownTimer from 'components/CountDownTimer/CountDownTimer';
import ChevronLeft from 'components/Icons/ChevronLeft';
import OTPInput from 'components/OTPInput/OTPInput';
import TextFieldTrimmed from 'components/TextFieldTrimmed/TextFieldTrimmed';
import styles from 'pages/index.module.css';
import Head from 'next/head';
import { T_SingleBusinessWhitelabelInfo } from 'whitelabel/whitelabel';
import { grey } from '@mui/material/colors';
import Image from 'next/image';

type VerifyPhoneForm = {
  phoneNumber: string;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['verify-phone', 'common'])),
    },
  };
};

const OTPLength = 6;

const Home = (props: { children?: ReactNode; selectedBusinessWhitelabelValues: T_SingleBusinessWhitelabelInfo }) => {
  const { t } = useTranslation(['verify-phone', 'common']);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setFocus,
    getValues,
    setValue,
    trigger,
  } = useForm<VerifyPhoneForm>({ defaultValues: { phoneNumber: '' } });

  const [enteredOTP, setEnteredOTP] = useState<string>('');
  const [otpErrMessage, setOTPErrMessage] = useState<string>('');
  const [isOTPError, setIsOTPError] = useState(false);
  const [showResendBtn, setShowResendBtn] = useState(false);
  const [restartTimerKey, setRestartTimerKey] = useState(0);
  const [snackMessage, setSnackMessage] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [clearOTPKey, setClearOTPKey] = useState(0);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verifyPhoneBtnLoading, setVerifyPhoneBtnLoading] = useState(false);
  const themeHook = useTheme();
  const isXs = useMediaQuery(themeHook.breakpoints.down('sm'));

  const otpContainerRef = useRef(null);

  const onTimerDone = useCallback(() => {
    setShowResendBtn(true);
  }, []);
  const onResendClick = () => {
    setShowResendBtn(false);
    setClearOTPKey((prev) => prev + 1);
    setOTPErrMessage(t(''));
    setIsOTPError(false);
    requestOTP(getValues());
  };
  const requestOTP = async (data: VerifyPhoneForm) => {
    try {
      if (errors.phoneNumber) return;
      setRestartTimerKey((prev) => prev + 1);
      setLoading(true);
      const res = await registerWithBankApi({ mobile: `91${data.phoneNumber}` });
      setSessionId(res.data.sessionId);
      setLoading(false);
      setShowOTP(true);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setSnackMessage(error?.response?.data?.message || 'An error occurred');
    }
  };

  const verifyOTP = async () => {
    try {
      if (enteredOTP.length !== OTPLength) {
        setOTPErrMessage(t('enter-otp'));
        setIsOTPError(true);
        return;
      }
      setVerifyPhoneBtnLoading(true);
      const res = await verifyOTPApi({ otp: enteredOTP, sessionId, mobile: `91${getValues().phoneNumber}` });
      const message = res.data.message.length > 0 ? res.data.message + '. Redirecting...' : 'Redirecting...';
      setSnackMessage(message);
      localStorage.setItem('mobile', getValues().phoneNumber);
      router.replace('/kyc');
      setVerifyPhoneBtnLoading(false);
    } catch (error) {
      setVerifyPhoneBtnLoading(false);
      console.log(error);
      setIsOTPError(true);
      setOTPErrMessage(error.response?.data?.message || t<string>('an-error-occurred', { ns: 'common' }));
      setSnackMessage(error.response?.data?.message || t<string>('an-error-occurred', { ns: 'common' }));
    }
  };

  const onBackClick = () => {
    setShowOTP(false);
    setTimeout(() => {
      setFocus('phoneNumber');
    }, 300);
  };

  useEffect(() => {
    if (snackMessage) {
      setTimeout(() => setSnackMessage(''), 3000);
    }
  }, [snackMessage]);

  useEffect(() => {
    setIsOTPError(false);
    setOTPErrMessage(t(''));
  }, [enteredOTP, setOTPErrMessage, t]);

  useEffect(() => {
    setFocus('phoneNumber');
  }, [setFocus]);

  return (
    <>
      <Head>
        <title>{`${props.selectedBusinessWhitelabelValues.businessName} - Verify Mobile number`}</title>
      </Head>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }} className={styles.contentWrapper}>
        {props.selectedBusinessWhitelabelValues.bgImage && (isXs ? !showOTP : true) && (
          <Box sx={{ width: { xs: '100vw', sm: 'auto' }, p: 0, m: 0, flexBasis: { sm: '50%' } }} className="imageWrapper">
            <Image
              src={`/${props.selectedBusinessWhitelabelValues.bgImage}`}
              layout="responsive"
              width="700"
              height="700"
              objectFit="cover"
              alt="card-image"
              priority
            />
          </Box>
        )}
        <Box
          sx={{ py: 3, px: { xs: 2, sm: 5 }, overflowX: 'hidden', flexBasis: { sm: '50%' } }}
          className={`${styles.verifyPageWrapper}`}
          ref={otpContainerRef}>
          {!showOTP && (
            <Box component="form" onSubmit={handleSubmit(requestOTP)}>
              <Box textAlign={{ xs: 'left', sm: 'center' }}>
                <Typography variant="h4" fontWeight="700" sx={{ mt: 2, textAlign: 'left' }}>
                  {t('welcome')}
                </Typography>
                <Typography variant="caption" component="div" fontWeight={400} color={grey[700]} sx={{ textAlign: 'left' }}>
                  {t('two-steps')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <FormControl sx={{ flexBasis: { xs: '100%' } }}>
                  <FormLabel sx={{ mb: 1 }} id="phoneLbl" htmlFor="phoneTxtField">
                    {t('phone-number')}
                  </FormLabel>
                  <Controller
                    render={({ field }) => (
                      <TextFieldTrimmed
                        id="phoneTxtField"
                        error={Boolean(errors.phoneNumber)}
                        helperText={errors.phoneNumber?.message}
                        value={field.value}
                        placeholder={t('phone-number')}
                        type="tel"
                        onChange={field.onChange}
                        inputRef={field.ref}
                        sx={{ mb: 1 }}
                        callbackOnBlur={() => trigger('phoneNumber')}
                        reactHookFormKey="phoneNumber"
                        setTrimmedValueOnBlurOrSubmit={setValue}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment sx={{ mr: 2 }} position="start">
                              +91
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    name="phoneNumber"
                    control={control}
                    rules={{
                      required: { value: true, message: t('enter-registered-phone-number') },
                      minLength: { value: 10, message: t('enter-10-digit-number') },
                      maxLength: { value: 10, message: t('enter-10-digit-number') },
                      pattern: { value: /^\d+$/, message: t('enter-10-digit-number') },
                    }}
                  />
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', mt: 2 }}>
                <Button disabled={loading} type="submit" sx={{ flexGrow: { xs: 1, sm: 0 }, px: 3 }}>
                  {loading ? <CircularProgress color="inherit" /> : t('send-otp')}
                </Button>
              </Box>
            </Box>
          )}
          {showOTP && (
            <Box component="form" onSubmit={verifyOTP} autoComplete="off">
              <Slide
                direction="right"
                timeout={{ enter: 320 }}
                in={showOTP}
                easing={{
                  enter: 'cubic-bezier(.65,.53,.51,.65)',
                  exit: 'linear',
                }}
                container={otpContainerRef.current}
                mountOnEnter
                unmountOnExit>
                {/* easing={{ enter: 'easeOut', exit: 'ease-in-out' }} */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'stretch', my: 2 }}>
                    <Button
                      onClick={onBackClick}
                      variant="no-style"
                      sx={{ minWidth: '16px', display: 'grid', placeContent: 'center', mr: 1, cursor: 'pointer' }}>
                      <ChevronLeft />
                    </Button>
                    <Typography variant="h5" fontWeight="700" sx={{ pr: 1.2, textAlign: 'left' }}>
                      {t('verify-otp')}
                    </Typography>
                  </Box>
                  <FormControl>
                    <Box>
                      <FormLabel sx={{ mb: 1 }} id="otpInpLbl">
                        {t('otp')}
                      </FormLabel>
                      <OTPInput
                        clearOTPKey={clearOTPKey}
                        noOfInputs={OTPLength}
                        setValue={setEnteredOTP}
                        isErrorProp={isOTPError}
                        onEnterPressed={verifyOTP}
                      />
                      <FormHelperText error={isOTPError}>{otpErrMessage}</FormHelperText>
                      <Box sx={{ display: 'flex', alignItems: 'start', mt: 1, minHeight: '42px' }}>
                        {showResendBtn ? (
                          <Button
                            size="small"
                            variant="link"
                            onClick={onResendClick}
                            sx={{ minHeight: 'auto', my: { xs: 1, sm: 0 } }}>
                            {t('resend-otp')}
                          </Button>
                        ) : (
                          <>
                            <FormHelperText sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2" component="span">
                                {t('didnt-receive')}
                              </Typography>
                              <Typography variant="lightgray" sx={{ display: 'flex', gap: 0.5 }}>
                                <span> {t('resend-in')} </span>
                                <CountDownTimer
                                  restartTimerKey={restartTimerKey}
                                  startTimeInSeconds={60}
                                  onTimerDone={onTimerDone}
                                />
                              </Typography>
                            </FormHelperText>
                          </>
                        )}
                      </Box>
                    </Box>
                  </FormControl>
                  <Box sx={{ display: 'flex', mt: 1 }}>
                    <Button
                      disabled={verifyPhoneBtnLoading}
                      type="button"
                      onClick={verifyOTP}
                      sx={{ flexGrow: { xs: 1, sm: 0 }, px: 3 }}>
                      {verifyPhoneBtnLoading ? <CircularProgress color="inherit" /> : t('verify-otp')}
                    </Button>
                  </Box>
                </Box>
              </Slide>
            </Box>
          )}
          <Snackbar open={Boolean(snackMessage)} message={snackMessage} autoHideDuration={3000}></Snackbar>
        </Box>
      </Box>
    </>
  );
};

export default Home;
