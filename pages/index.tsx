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
} from '@mui/material';
import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { registerWithBankApi, verifyOTPApi } from '../api-requests/verify';
import CountDownTimer from '../components/CountDownTimer/CountDownTimer';
import ChevronLeft from '../components/Icons/ChevronLeft';
import OTPInput from '../components/OTPInput/OTPInput';
import TextFieldTrimmed from '../components/TextFieldTrimmed/TextFieldTrimmed';
import classes from './index.module.css';

type VerifyPhoneForm = {
  phoneNumber: string;
};

const OTPLength = 6;

const Home: NextPage = () => {
  const { t } = useTranslation(['verify-phone', 'common']);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setFocus,
    getValues,
    setValue,
  } = useForm<VerifyPhoneForm>({ defaultValues: { phoneNumber: '' } });

  const [enteredOTP, setEnteredOTP] = useState<string>('');
  const [otpErrMessage, setOTPErrMessage] = useState<string>(t('enter-otp'));
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

  const otpContainerRef = useRef(null);

  const onTimerDone = useCallback(() => {
    setShowResendBtn(true);
  }, []);
  const onResendClick = () => {
    setShowResendBtn(false);
    setClearOTPKey((prev) => prev + 1);
    setOTPErrMessage(t('enter-otp'));
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
    } catch (error) {
      setShowOTP(true); //TODO: REMOVE THIS
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
      setSnackMessage(res.data.message);
      setVerifyPhoneBtnLoading(false);
    } catch (error) {
      setVerifyPhoneBtnLoading(false);
      console.log(error);
      setIsOTPError(true);
      setOTPErrMessage(error.response?.data?.message || t<string>('an-error-occurred', { ns: 'common' }));
      setSnackMessage(error.response?.data?.message || t<string>('an-error-occurred', { ns: 'common' }));
      router.replace('/kyc');
    }
  };

  const onBackClick = () => {
    setShowOTP(false);
    // setTimeout(() => {
    setFocus('phoneNumber');
    // }, 600);
  };

  useEffect(() => {
    if (snackMessage) {
      setTimeout(() => setSnackMessage(''), 3000);
    }
  }, [snackMessage]);

  useEffect(() => {
    setIsOTPError(false);
    setOTPErrMessage(t('enter-otp'));
  }, [enteredOTP, setOTPErrMessage, t]);

  useEffect(() => {
    setFocus('phoneNumber');
  }, [setFocus]);

  return (
    <Box
      sx={{ py: 3, px: 3, borderRadius: 2, overflowX: 'hidden', borderTop: `5px solid`, borderTopColor: `primary.main` }}
      className={`${classes.verifyPageWrapper} custom-box-shadow-2`}
      ref={otpContainerRef}>
      {!showOTP && (
        <Box component="form" onSubmit={handleSubmit(requestOTP)}>
          <Box component="h2" textAlign={{ xs: 'left', sm: 'center' }}>
            {t('ready-to-activate')}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormControl sx={{ flexBasis: { xs: '100%', sm: '80%', lg: '70%' } }}>
              <FormLabel sx={{ mb: 1 }} id="phoneLbl" htmlFor="phoneTxtField">
                {t('phone-number')}
              </FormLabel>
              <Controller
                render={({ field }) => (
                  <TextFieldTrimmed
                    id="phoneTxtField"
                    error={Boolean(errors.phoneNumber)}
                    helperText={errors.phoneNumber?.message || t('enter-registered-phone-number')}
                    value={field.value}
                    placeholder={t('phone-number')}
                    type="tel"
                    onChange={field.onChange}
                    inputRef={field.ref}
                    sx={{ mb: 3 }}
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
          <Box sx={{ display: 'flex', mt: 3, justifyContent: { sm: 'center' } }}>
            <Button disabled={loading} type="submit" sx={{ flexGrow: { xs: 1, sm: 0 } }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button
                  onClick={onBackClick}
                  variant="no-style"
                  sx={{ minWidth: '16px', display: 'grid', placeContent: 'center', mr: 0.5, cursor: 'pointer' }}>
                  <ChevronLeft />
                </Button>
                <Box component="h2" sx={{ pr: 1.2 }}>
                  {t('verify-otp')}
                </Box>
              </Box>
              <FormControl sx={{ display: 'grid', placeContent: 'center' }}>
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
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                    {showResendBtn ? (
                      <Button size="small" variant="link" onClick={onResendClick} sx={{ minHeight: 'auto' }}>
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
                            <CountDownTimer restartTimerKey={restartTimerKey} startTimeInSeconds={60} onTimerDone={onTimerDone} />
                          </Typography>
                        </FormHelperText>
                      </>
                    )}
                  </Box>
                </Box>
              </FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button disabled={verifyPhoneBtnLoading} type="button" onClick={verifyOTP} sx={{ flexGrow: { xs: 1, sm: 0 } }}>
                  {verifyPhoneBtnLoading ? <CircularProgress color="inherit" /> : t('verify-otp')}
                </Button>
              </Box>
            </Box>
          </Slide>
        </Box>
      )}
      <Snackbar open={Boolean(snackMessage)} message={snackMessage} autoHideDuration={3000}></Snackbar>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['verify-phone', 'common'])),
    },
  };
};

export default Home;
