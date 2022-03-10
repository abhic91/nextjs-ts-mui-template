import {
  Box,
  Button,
  CircularProgress,
  Fade,
  FormControl,
  FormLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
} from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { submitKYCDetailsApi } from '../../api-requests/verify';
import { FormControlLabelBordered } from '../../components/BorderedRadioLabel/FormControlLabelBordered';
import DatePickerLocalised from '../../components/DatePickerLocalised/DatePickerLocalised';
import CalendarIcon from '../../components/Icons/CalendarIcon';
import { topNavHeight } from '../../theme/theme';
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
  dob: string;
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
    setFocus,
    formState: { errors },
  } = useForm<TKYCForm>({
    defaultValues: {
      idType: IDType.PAN,
      mobile: '',
      name: '',
      dob: dayjs().format('YYYY-MM-DD'),
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
    <Fade in={showForm} timeout={{ enter: 500 }} addEndListener={() => setFocus('panNumber')}>
      <Box
        sx={{
          height: `calc(100vh - ${topNavHeight}px)`,
          display: 'grid',
          placeContent: 'center',
          marginTop: `${topNavHeight}px`,
        }}>
        <Box
          className={classes.kycFormWrapper}
          sx={{ pt: 5, pb: 3, px: { xs: 3, md: 7 }, boxShadow: 1, borderRadius: 2 }}
          component="form"
          onSubmit={handleSubmit(submitForm)}>
          <Grid container columnSpacing={6} rowSpacing={2}>
            <Grid item xs={12} sm={6}>
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
                      sx={{ gap: 1.5, pl: 1.5 }}
                      row>
                      <FormControlLabelBordered
                        value={IDType.PAN}
                        control={<Radio />}
                        label="PAN"
                        active={field.value === IDType.PAN}
                      />
                      <FormControlLabelBordered
                        active={field.value === IDType.AADHAAR}
                        value={IDType.AADHAAR}
                        control={<Radio />}
                        label="Aadhaar"
                      />
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
                          placeholder={t('enter-pan')}
                          sx={{ mb: { xs: 1, sm: 2.5 } }}
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
                          placeholder={t('enter-aadhaar')}
                          sx={{ mb: { xs: 1, sm: 2.5 } }}
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
                      placeholder={t('enter-full-name')}
                      sx={{ mb: { xs: 1, sm: 2.5 } }}
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
            <Grid item xs={12} sm={6} sx={{ mb: { xs: 1, sm: 2.5 } }}>
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
                      sx={{ gap: 1.5, pl: 1.5 }}
                      row>
                      <FormControlLabelBordered
                        active={field.value === GENDER.Male}
                        value={GENDER.Male}
                        control={<Radio />}
                        label={t<string>('male')}
                      />
                      <FormControlLabelBordered
                        active={field.value === GENDER.Female}
                        value={GENDER.Female}
                        control={<Radio />}
                        label={t<string>('female')}
                      />
                    </RadioGroup>
                  )}
                  name="gender"></Controller>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }} id="dobLbl" htmlFor="dob">
                  {t('dob')}
                </FormLabel>
                <Controller
                  control={control}
                  render={({ field }) => (
                    <DatePickerLocalised
                      aria-labelledby="dobLbl"
                      value={field.value}
                      renderInput={(params) => (
                        <TextField error={Boolean(errors.dob)} sx={{ mb: { xs: 1, sm: 2.5 } }} {...params} />
                      )}
                      maxDate={dayjs()}
                      onChange={field.onChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            {' '}
                            <CalendarIcon />
                          </InputAdornment>
                        ),
                      }}></DatePickerLocalised>
                  )}
                  name="dob"></Controller>
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
                      placeholder={t('enter-address')}
                      sx={{ mb: { xs: 1, sm: 2.5 } }}
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
                          placeholder={t('enter-pin')}
                          sx={{ mb: { xs: 1, sm: 2.5 } }}
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
                          sx={{ mb: { xs: 1, sm: 2.5 } }}
                          placeholder={t('enter-city')}
                        />
                      )}
                      name="city"
                      control={control}
                      rules={{
                        required: { value: true, message: t<string>('enter-valid-city') },
                        minLength: { value: 2, message: t<string>('enter-valid-city') },
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
                          placeholder={t('enter-state')}
                          sx={{ mb: { xs: 1, sm: 2.5 } }}
                        />
                      )}
                      name="state"
                      control={control}
                      rules={{
                        required: { value: true, message: t<string>('enter-valid-state') },
                        minLength: { value: 2, message: t<string>('enter-valid-state') },
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: { md: 'right', xs: 'center' }, mt: 3 }}>
            <Button sx={{ flexGrow: { xs: 1, sm: 0 } }} type="submit">
              {loading ? <CircularProgress color="inherit" /> : t('complete-kyc')}
            </Button>
          </Box>
          <Snackbar open={Boolean(snackMessage)} message={snackMessage}></Snackbar>
        </Box>
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
