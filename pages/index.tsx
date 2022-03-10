import {
  Box,
  Button,
  CircularProgress,
  Fade,
  FormControl,
  FormHelperText,
  FormLabel,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { registerWithBankApi, verifyOTPApi } from '../api-requests/verify';
import CountDownTimer from '../components/CountDownTimer/CountDownTimer';
import ChevronLeft from '../components/Icons/ChevronLeft';
import OTPInput from '../components/OTPInput/OTPInput';
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
  const [showPage, setShowPage] = useState(false);
  const [verifyPhoneBtnLoading, setVerifyPhoneBtnLoading] = useState(false);

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
      setLoading(false);
      setShowOTP(true); //TODO: REMOVE THIS
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
    setShowPage(true);
  }, []);

  return (
    <Fade in={showPage} timeout={200} addEndListener={() => setFocus('phoneNumber')}>
      <Box sx={{ py: 3, px: 3, boxShadow: 1, borderRadius: 2 }} className={classes.verifyPageWrapper}>
        {!showOTP && (
          <Box component="form" onSubmit={handleSubmit(requestOTP)}>
            <Box component="h2" textAlign={{ xs: 'left', sm: 'center' }}>
              {t('ready-to-activate')}
            </Box>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }} id="phoneLbl" htmlFor="phoneTxtField">
                {t('phone-number')}
              </FormLabel>
              <Controller
                render={({ field }) => (
                  <TextField
                    id="phoneTxtField"
                    error={Boolean(errors.phoneNumber)}
                    helperText={errors.phoneNumber?.message || t('enter-registered-phone-number')}
                    value={field.value}
                    placeholder={t('phone-number')}
                    type="tel"
                    onChange={field.onChange}
                    inputRef={field.ref}
                    sx={{ mb: 3 }}
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
            <Box sx={{ display: 'flex', mt: 3, justifyContent: { sm: 'center' } }}>
              <Button disabled={loading} type="submit" sx={{ flexGrow: { xs: 1, sm: 0 } }}>
                {loading ? <CircularProgress color="inherit" /> : t('send-otp')}
              </Button>
            </Box>
          </Box>
        )}
        {showOTP && (
          <Box component="form" onSubmit={verifyOTP} autoComplete="off">
            <Fade in={showOTP}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button
                    onClick={onBackClick}
                    variant="no-style"
                    sx={{ minWidth: '16px', display: 'grid', placeContent: 'center', mr: 0.5, cursor: 'pointer' }}>
                    <ChevronLeft />
                  </Button>
                  <Box component="h2">{t('verify-otp')}</Box>
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
                        <Button size="small" sx={{ ml: 0.375 }} variant="link" onClick={onResendClick}>
                          {t('resend-otp')}
                        </Button>
                      ) : (
                        <>
                          <FormHelperText sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle2">{t('didnt-receive')}</Typography>
                            <Typography variant="lightgray" sx={{ ml: 0.5, display: 'flex', gap: 0.5 }}>
                              <span> {t('resend-in')} </span>
                              <CountDownTimer
                                restartTimerKey={restartTimerKey}
                                startTimeInSeconds={5}
                                onTimerDone={onTimerDone}
                              />
                            </Typography>
                          </FormHelperText>
                        </>
                      )}
                    </Box>
                  </Box>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button disabled={verifyPhoneBtnLoading} type="button" onClick={verifyOTP}>
                    {verifyPhoneBtnLoading ? <CircularProgress color="inherit" /> : t('verify-otp')}
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Box>
        )}
        <Snackbar open={Boolean(snackMessage)} message={snackMessage} autoHideDuration={3000}></Snackbar>
      </Box>
    </Fade>
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
