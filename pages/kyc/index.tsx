import {
  Box,
  Button,
  CircularProgress,
  Fade,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { submitKYCDetailsApi } from '../../api-requests/verify';
import classes from './index.module.css';

export enum IDType {
  // eslint-disable-next-line no-unused-vars
  PAN = 'PAN',
  // eslint-disable-next-line no-unused-vars
  AADHAAR = 'AADHAAR',
}

export enum GENDER {
  // eslint-disable-next-line no-unused-vars
  Male = 'M',
  // eslint-disable-next-line no-unused-vars
  Female = 'F',
}

export type TKYCForm = {
  idType: IDType;
  mobile: string;
  name: string;
  panNumber?: string;
  aadhaarNumber?: string;
  dobYear: string;
  dobMonth: string;
  dobDay: string;
  address: string;
  pinCode: string;
  gender: GENDER;
  city: string;
  state: string;
};

const KycForm = () => {
  const { t } = useTranslation(['kyc-form', 'common']);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const {
    handleSubmit,
    control,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<TKYCForm>({
    defaultValues: {
      idType: IDType.PAN,
      mobile: '',
      name: '',
      dobYear: '',
      dobMonth: '',
      dobDay: '',
      address: '',
      pinCode: '',
      panNumber: '',
      aadhaarNumber: '',
      gender: GENDER.Male,
      city: '',
      state: '',
    },
  });

  const submitForm = async (data: TKYCForm) => {
    try {
      setLoading(true);
      const res = await submitKYCDetailsApi(data);
      setLoading(false);
      console.log(res);
    } catch (error) {
      setLoading(false);
      setSnackMessage(error.response?.data?.message || t('an-error-occurred', { ns: 'common' }));
      console.log(error);
    }
  };

  useEffect(() => {
    setShowForm(true);
  }, []);

  useEffect(() => {
    if (snackMessage)
      setTimeout(() => {
        setSnackMessage('');
      }, 3000);
  }, [snackMessage]);

  return (
    <Fade in={showForm} timeout={{ enter: 500 }}>
      <Box
        className={classes.kycFormWrapper}
        sx={{ py: 3, px: 3, boxShadow: 2, borderRadius: 3 }}
        component="form"
        onSubmit={handleSubmit(submitForm)}>
        <Grid container columnSpacing={6} rowSpacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }} id="idTypeLbl" htmlFor="idType">
                {t('choose-type')}
              </FormLabel>
              <Controller
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    id="idType"
                    aria-labelledby="idTypeLbl"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger('panNumber');
                      trigger('aadhaarNumber');
                    }}
                    name="idType"
                    row>
                    <FormControlLabel value={IDType.PAN} control={<Radio />} label="PAN" />
                    <FormControlLabel value={IDType.AADHAAR} control={<Radio />} label="Aadhaar" />
                  </RadioGroup>
                )}
                name="idType"></Controller>
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <FormControl fullWidth>
              {getValues().idType === IDType.PAN && (
                <>
                  <FormLabel sx={{ mb: 1 }} id="panNumberLbl" htmlFor="panNumber">
                    {t('PAN')}
                  </FormLabel>
                  <Controller
                    render={({ field }) => (
                      <TextField
                        id="panNumber"
                        error={Boolean(errors.panNumber)}
                        helperText={errors.panNumber?.message}
                        value={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        sx={{ mb: 3 }}
                      />
                    )}
                    name="panNumber"
                    control={control}
                    rules={{
                      validate: {
                        required: (val) => (getValues('idType') === IDType.PAN && !val ? t<string>('enter-pan') : true),
                      },
                      pattern: { value: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, message: t('enter-valid-pan') },
                    }}
                  />
                </>
              )}
              {getValues().idType == IDType.AADHAAR && (
                <>
                  <FormLabel sx={{ mb: 1 }} id="aadhaarNumberLbl" htmlFor="aadhaarNumber">
                    {t('aadhaar')}
                  </FormLabel>
                  <Controller
                    render={({ field }) => (
                      <TextField
                        id="aadhaarNumber"
                        error={Boolean(errors.aadhaarNumber)}
                        helperText={errors.aadhaarNumber?.message}
                        value={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        sx={{ mb: 3, xs: 12, sm: 4 }}
                      />
                    )}
                    name="aadhaarNumber"
                    control={control}
                    rules={{
                      validate: {
                        required: (val) => (getValues('idType') === IDType.AADHAAR && !val ? t<string>('enter-aadhaar') : true),
                      },
                      pattern: { value: /^\d+$/, message: t('enter-valid-aadhaar') },
                      minLength: { value: 12, message: t('enter-valid-aadhaar') },
                      maxLength: { value: 12, message: t('enter-valid-aadhaar') },
                    }}
                  />
                </>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }} id="nameLbl" htmlFor="name">
                {t('name')}
              </FormLabel>
              <Controller
                render={({ field }) => (
                  <TextField
                    id="name"
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                    value={field.value}
                    onChange={field.onChange}
                    inputRef={field.ref}
                    sx={{ mb: 3 }}
                  />
                )}
                name="name"
                control={control}
                rules={{
                  required: { value: true, message: t<string>('enter-your-name') },
                  minLength: { value: 2, message: t('enter-valid-name-min') },
                  maxLength: { value: 200, message: t('enter-valid-name-max') },
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }} id="dobLbl" htmlFor="dob">
                {t('dob')}
              </FormLabel>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Controller
                    render={({ field }) => (
                      <TextField
                        id="dobYear"
                        error={Boolean(errors.dobYear)}
                        value={field.value}
                        placeholder="YYYY"
                        onChange={field.onChange}
                        inputRef={field.ref}
                        sx={{ mb: 3 }}
                      />
                    )}
                    name="dobYear"
                    control={control}
                    rules={{
                      validate: {
                        validYear: (val) =>
                          +val > 1900 && +val < new Date().getFullYear() ? true : t<string>('enter-valid-dob'),
                      },
                      required: { value: true, message: t<string>('enter-valid-dob') },
                      minLength: { value: 4, message: t<string>('enter-valid-dob') },
                      maxLength: { value: 4, message: t<string>('enter-valid-dob') },
                      pattern: { value: /^\d+$/, message: t<string>('enter-valid-dob') },
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    render={({ field }) => (
                      <TextField
                        id="dobMonth"
                        error={Boolean(errors.dobMonth)}
                        value={field.value}
                        placeholder="MM"
                        onChange={field.onChange}
                        inputRef={field.ref}
                        sx={{ mb: 3 }}
                      />
                    )}
                    name="dobMonth"
                    control={control}
                    rules={{
                      validate: { validMonth: (val) => (+val > 0 && +val < 13 ? true : t<string>('enter-valid-dob')) },
                      required: { value: true, message: t<string>('enter-valid-dob') },
                      minLength: { value: 1, message: t<string>('enter-valid-dob') },
                      maxLength: { value: 2, message: t<string>('enter-valid-dob') },
                      pattern: { value: /^\d+$/, message: t<string>('enter-valid-dob') },
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    render={({ field }) => (
                      <TextField
                        id="dobDay"
                        error={Boolean(errors.dobDay)}
                        value={field.value}
                        placeholder="DD"
                        onChange={field.onChange}
                        inputRef={field.ref}
                        sx={{ mb: 3 }}
                      />
                    )}
                    name="dobDay"
                    control={control}
                    rules={{
                      validate: { validDate: (val) => (+val > 0 && +val < 32 ? true : t<string>('enter-valid-dob')) },
                      required: { value: true, message: t<string>('enter-valid-dob') },
                      minLength: { value: 1, message: t<string>('enter-valid-dob') },
                      maxLength: { value: 2, message: t<string>('enter-valid-dob') },
                      pattern: { value: /^\d+$/, message: t<string>('enter-valid-dob') },
                    }}
                  />
                </Grid>
              </Grid>
              <FormHelperText
                sx={{ mt: -2.4 }}
                error={Boolean(errors.dobDay?.message) || Boolean(errors.dobMonth?.message) || Boolean(errors.dobYear?.message)}>
                {errors.dobDay?.message || errors.dobMonth?.message || errors.dobYear?.message}
                {/* {JSON.stringify(errors)} */}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }} id="genderLbl" htmlFor="gender">
                {t('gender')}
              </FormLabel>
              <Controller
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    id="gender"
                    aria-labelledby="genderLbl"
                    value={field.value}
                    onChange={field.onChange}
                    name="gender"
                    row>
                    <FormControlLabel value={GENDER.Male} control={<Radio />} label={t<string>('male')} />
                    <FormControlLabel value={GENDER.Female} control={<Radio />} label={t<string>('female')} />
                  </RadioGroup>
                )}
                name="gender"></Controller>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }} id="addressLbl" htmlFor="address">
                {t('address')}
              </FormLabel>
              <Controller
                render={({ field }) => (
                  <TextField
                    id="address"
                    error={Boolean(errors.address)}
                    helperText={errors.address?.message}
                    value={field.value}
                    onChange={field.onChange}
                    inputRef={field.ref}
                    sx={{ mb: 3 }}
                  />
                )}
                name="address"
                control={control}
                rules={{
                  required: { value: true, message: t<string>('enter-address') },
                  minLength: { value: 6, message: t<string>('enter-valid-address') },
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }} id="pinCodeLbl" htmlFor="pinCode">
                    {t('pin')}
                  </FormLabel>
                  <Controller
                    render={({ field }) => (
                      <TextField
                        id="pinCode"
                        error={Boolean(errors.pinCode)}
                        helperText={errors.pinCode?.message}
                        value={field.value}
                        type="number"
                        onChange={field.onChange}
                        inputRef={field.ref}
                        sx={{ mb: 3 }}
                      />
                    )}
                    name="pinCode"
                    control={control}
                    rules={{
                      required: { value: true, message: t<string>('enter-pin') },
                      minLength: { value: 6, message: t<string>('enter-valid-pin') },
                      maxLength: { value: 6, message: t<string>('enter-valid-pin') },
                      pattern: { value: /^\d+$/, message: t('enter-valid-pin') },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }} id="cityLbl" htmlFor="city">
                    {t('city')}
                  </FormLabel>
                  <Controller
                    render={({ field }) => (
                      <TextField
                        id="city"
                        error={Boolean(errors.city)}
                        helperText={errors.city?.message}
                        value={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        sx={{ mb: 3 }}
                      />
                    )}
                    name="city"
                    control={control}
                    rules={{
                      required: { value: true, message: t<string>('enter-city') },
                      minLength: { value: 2, message: t<string>('enter-city') },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }} id="stateLbl" htmlFor="state">
                    {t('state')}
                  </FormLabel>
                  <Controller
                    render={({ field }) => (
                      <TextField
                        id="state"
                        error={Boolean(errors.state)}
                        helperText={errors.state?.message}
                        value={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        sx={{ mb: 3 }}
                      />
                    )}
                    name="state"
                    control={control}
                    rules={{
                      required: { value: true, message: t<string>('enter-state') },
                      minLength: { value: 2, message: t<string>('enter-state') },
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button type="submit">{loading ? <CircularProgress color="inherit" /> : t('kyc-submit')}</Button>
        </Box>
        <Snackbar open={Boolean(snackMessage)} message={snackMessage}></Snackbar>
      </Box>
    </Fade>
  );
};
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['kyc-form', 'common'])),
    },
  };
}

export default KycForm;
