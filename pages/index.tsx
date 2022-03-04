import { Box, Button, FormControl, FormLabel, InputAdornment, TextField } from '@mui/material';
import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useForm, Controller } from 'react-hook-form';

type VerifyPhoneForm = {
  phoneNumber: string;
};

const Home: NextPage = () => {
  const { t } = useTranslation('verify-phone');
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VerifyPhoneForm>();
  const onSubmit = (data: VerifyPhoneForm) => console.log(data);

  return (
    <div>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ m: 3 }}>
        <FormControl fullWidth>
          <FormLabel id="phoneLbl" htmlFor="phone">
            {t('phone-number')}
          </FormLabel>
          <Controller
            render={({ field }) => (
              <TextField
                error={errors.phoneNumber ? true : false}
                helperText={errors.phoneNumber?.message || t('enter-registered-phone-number')}
                value={field.value}
                type="tel"
                onChange={field.onChange}
                inputRef={field.ref}
                sx={{ mb: 3, mt: 1 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                  'aria-describedby': 'phoneLbl',
                }}
              />
            )}
            name="phoneNumber"
            control={control}
            rules={{
              required: { value: true, message: t('enter-registered-phone-number') },
              minLength: { value: 10, message: t('enter-10-digit-number') },
              maxLength: { value: 10, message: t('enter-10-digit-number') },
            }}
          />
        </FormControl>
        {/* <FormControl fullWidth>
          <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
          <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" defaultValue="female" name="radio-buttons-group">
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </FormControl> */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
