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
} from '@mui/material';
import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { registerWithBankApi, verifyOTPApi } from '../api-requests/verify';
import CountDownTimer from '../components/CountDownTimer/CountDownTimer';
import OTPInput from '../components/OTPInput/OTPInput';
import classes from './index.module.css';

type VerifyPhoneForm = {
  phoneNumber: string;
};

const OTPLength = 6;

const Home: NextPage = () => {
  const { t } = useTranslation('verify-phone');
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
  const [disableResendBtn, setDisableResendBtn] = useState(true);
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
    setDisableResendBtn(false);
  }, []);
  const onResendClick = () => {
    setDisableResendBtn(true);
    setClearOTPKey((prev) => prev + 1);
    setOTPErrMessage(t('enter-otp'));
    setIsOTPError(false);
    setRestartTimerKey((prev) => prev + 1);
    requestOTP(getValues());
  };
  const requestOTP = async (data: VerifyPhoneForm) => {
    try {
      if (errors.phoneNumber) return;
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
      setOTPErrMessage(error.response?.data?.message || 'An error occurred');
      setSnackMessage(error.response?.data?.message || 'An error occurred');
      router.replace('/kyc');
    }
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
    <Fade in={showPage} timeout={500} addEndListener={() => setFocus('phoneNumber')}>
      <Box sx={{ py: 3, px: 3, boxShadow: 2, borderRadius: 3 }} className={classes.verifyPageWrapper}>
        <Box component="form" onSubmit={handleSubmit(requestOTP)}>
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
                  type="tel"
                  onChange={field.onChange}
                  inputRef={field.ref}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
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
          {!showOTP && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button disabled={loading} type="submit">
                {loading ? <CircularProgress color="inherit" /> : t('request-otp')}
              </Button>
            </Box>
          )}
        </Box>
        <Box component="form" onSubmit={verifyOTP} autoComplete="off">
          <FormControl>
            <Fade in={showOTP}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Box>
                    <FormHelperText sx={{ mb: -0.8 }}>{t('didnt-receive')}</FormHelperText>
                    <Button size="small" sx={{ ml: 0.375 }} disabled={disableResendBtn} variant="link" onClick={onResendClick}>
                      {t('resend-otp')}
                    </Button>
                  </Box>
                  <CountDownTimer restartTimerKey={restartTimerKey} startTimeInSeconds={3} onTimerDone={onTimerDone} />
                </Box>
              </Box>
            </Fade>
          </FormControl>
          {showOTP && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button disabled={verifyPhoneBtnLoading} type="button" onClick={verifyOTP}>
                {verifyPhoneBtnLoading ? <CircularProgress color="inherit" /> : t('verify-phone')}
              </Button>
            </Box>
          )}
        </Box>
        <Snackbar open={Boolean(snackMessage)} message={snackMessage} autoHideDuration={3000}></Snackbar>
      </Box>
    </Fade>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['verify-phone'])),
    },
  };
};

export default Home;
