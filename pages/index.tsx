import { Box, Button, FormControl, FormHelperText, FormLabel, InputAdornment, TextField } from '@mui/material';
import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import CountDownTimer from '../components/CountDownTimer/CountDownTimer';
import OTPInput from '../components/OTPInput/OTPInput';

type VerifyPhoneForm = {
  phoneNumber: string;
};

const Home: NextPage = () => {
  const { t } = useTranslation('verify-phone');
  const {
    handleSubmit,
    control,
    formState: { errors },
    setFocus,
  } = useForm<VerifyPhoneForm>({ defaultValues: { phoneNumber: '' } });

  const onSubmit = (data: VerifyPhoneForm) => console.log(data);
  const [enteredOTP, setEnteredOTP] = useState<string>('');
  const [isOTPError] = useState<Boolean>(false);

  const onTimerDone = () => {};

  console.log({ enteredOTP });

  useEffect(() => {
    setFocus('phoneNumber');
  }, [setFocus]);

  return (
    <div>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ m: 3 }}>
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
        <FormControl>
          <FormLabel sx={{ mb: 1 }} id="otpInpLbl">
            {t('otp')}
          </FormLabel>
          <OTPInput noOfInputs={6} setValue={setEnteredOTP} isErrorProp={isOTPError} />
          <FormHelperText error={Boolean(isOTPError)}>{t('enter-otp')}</FormHelperText>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <FormHelperText>{t('didnt-receive')}</FormHelperText>
              <Button size="small" variant="link">
                {t('resend-otp')}
              </Button>
            </Box>
            <CountDownTimer startTimeInSeconds={5} onTimerDone={onTimerDone} />
          </Box>
        </FormControl>
        {/* <FormControl fullWidth>
          <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
          <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" defaultValue="female" name="radio-buttons-group">
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </FormControl> */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button type="submit">{t('request-otp')}</Button>
        </Box>
      </Box>
    </div>
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
