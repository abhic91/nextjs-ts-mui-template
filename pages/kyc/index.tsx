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
  Typography,
  useMediaQuery,
} from '@mui/material';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState, ReactNode, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { submitKYCDetailsApi } from 'api-requests/submit-kyc';
import { FormControlLabelBordered } from 'components/BorderedRadioLabel/FormControlLabelBordered';
import DatePickerLocalised from 'components/DatePickerLocalised/DatePickerLocalised';
import CalendarIcon from 'components/Icons/CalendarIcon';
import TextFieldTrimmed from 'components/TextFieldTrimmed/TextFieldTrimmed';
import classes from 'pages/kyc/index.module.css';
import { T_SingleBusinessWhitelabelInfo } from 'whitelabel/whitelabel';
import Head from 'next/head';
import Image from 'next/image';
import { useTheme } from '@mui/material';

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
  dob: any;
  address: string;
  pinCode: string;
  gender: GENDER;
};
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['kyc-form', 'common'])),
    },
  };
};

const KycForm = (props: { children?: ReactNode; selectedBusinessWhitelabelValues: T_SingleBusinessWhitelabelInfo }) => {
  const { t } = useTranslation(['kyc-form', 'common']);
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const themeHook = useTheme();
  const isXs = useMediaQuery(themeHook.breakpoints.down('sm'));
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [formHeight, setFormHeight] = useState('100%');

  const {
    handleSubmit,
    control,
    getValues,
    trigger,
    formState: { errors },
    setValue,
  } = useForm<TKYCForm>({
    defaultValues: {
      idType: IDType.PAN,
      mobile: '',
      name: '',
      dob: dayjs(),
      address: '',
      pinCode: '',
      panNumber: '',
      aadhaarNumber: '',
      gender: GENDER.Male,
    },
  });

  const submitForm = async (data: TKYCForm) => {
    try {
      setLoading(true);
      data = { ...data, dob: dayjs(data.dob).format('YYYY-MM-DD'), mobile: localStorage.getItem('mobile')! };
      const res = await submitKYCDetailsApi(data);
      setLoading(false);
      console.log(res);
      router.replace('/kyc-success');
    } catch (error) {
      setLoading(false);
      setSnackMessage(error.response?.data?.message || t('an-error-occurred', { ns: 'common' }));
      console.log(error);
    }
  };
  const isMobileVerificationDone = () => localStorage.getItem('mobile') !== null;
  useEffect(() => {
    if (!isMobileVerificationDone()) {
      router.replace('/');
      return;
    }
    setShowForm(true);
  }, [router]);

  useEffect(() => {
    if (snackMessage)
      setTimeout(() => {
        setSnackMessage('');
      }, 3000);
  }, [snackMessage]);
  useEffect(() => {
    if (!isXs) {
      setFormHeight(imgContainerRef.current?.querySelector('img')?.height + 'px');
    } else {
      setFormHeight('100%');
    }
  }, [isXs]);
  return (
    <>
      <Head>
        <title>{`${props.selectedBusinessWhitelabelValues.businessName} - Submit KYC Details`}</title>
      </Head>
      <Fade in={showForm} timeout={{ enter: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
          {props.selectedBusinessWhitelabelValues.bgImage && !isXs && (
            <Box
              sx={{ width: { xs: '100vw', sm: 'auto' }, p: 0, m: 0, flexBasis: { sm: '50%' } }}
              className="imageWrapper"
              ref={imgContainerRef}>
              <Image
                src={`/${props.selectedBusinessWhitelabelValues.bgImage}`}
                layout="responsive"
                width="100%"
                height="100%"
                objectFit="cover"
                alt="card-image"
                priority
              />
            </Box>
          )}

          <Box
            className={` ${classes.kycFormWrapper}`}
            sx={{
              pt: 4,
              pb: 3,
              px: { xs: 2, md: 2 },
              borderRadius: 2,
              flexBasis: { xs: '100%', sm: '50%' },
              maxHeight: formHeight,
              overflow: 'scroll',
            }}
            component="form"
            onSubmit={handleSubmit(submitForm)}>
            <Grid container columnSpacing={6} rowSpacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography sx={{ mb: 2, fontWeight: 700 }} id="idTypeLbl" variant="h5">
                    {t('finish-kyc')}
                  </Typography>
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
              <Grid item xs={12}>
                <FormControl fullWidth>
                  {getValues().idType === IDType.PAN && (
                    <>
                      <FormLabel sx={{ mb: 1 }} id="panNumberLbl" htmlFor="panNumber">
                        {t('PAN')}
                      </FormLabel>
                      <Controller
                        render={({ field }) => (
                          <TextFieldTrimmed
                            id="panNumber"
                            error={Boolean(errors.panNumber)}
                            helperText={errors.panNumber?.message}
                            value={field.value}
                            onChange={field.onChange}
                            inputRef={field.ref}
                            placeholder={t('enter-pan')}
                            sx={{ mb: { xs: 1, sm: 2.5 } }}
                            reactHookFormKey="panNumber"
                            setTrimmedValueOnBlurOrSubmit={setValue}
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
                          <TextFieldTrimmed
                            id="aadhaarNumber"
                            error={Boolean(errors.aadhaarNumber)}
                            helperText={errors.aadhaarNumber?.message}
                            value={field.value}
                            onChange={field.onChange}
                            inputRef={field.ref}
                            placeholder={t('enter-aadhaar')}
                            sx={{ mb: { xs: 1, sm: 2.5 } }}
                            reactHookFormKey="aadhaarNumber"
                            setTrimmedValueOnBlurOrSubmit={setValue}
                          />
                        )}
                        name="aadhaarNumber"
                        control={control}
                        rules={{
                          validate: {
                            required: (val) =>
                              getValues('idType') === IDType.AADHAAR && !val ? t<string>('enter-aadhaar') : true,
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
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }} id="nameLbl" htmlFor="name">
                    {getValues().idType === 'PAN' ? t('name-on-pan') : t('name-on-aadhaar')}
                  </FormLabel>
                  <Controller
                    render={({ field }) => (
                      <TextFieldTrimmed
                        id="name"
                        error={Boolean(errors.name)}
                        helperText={errors.name?.message}
                        value={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        placeholder={getValues().idType === 'PAN' ? t('name-on-pan') : t('name-on-aadhaar')}
                        sx={{ mb: { xs: 1, sm: 2.5 } }}
                        reactHookFormKey="name"
                        setTrimmedValueOnBlurOrSubmit={setValue}
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
              <Grid item xs={12} sx={{ mb: { xs: 1, sm: 2.5 } }}>
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
              <Grid item xs={12}>
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
                        inputFormat="DD/MM/YYYY"
                        renderInput={(params) => (
                          <TextField
                            sx={{ mb: { xs: 1, sm: 2.5 } }}
                            helperText={errors.dob?.message}
                            {...params}
                            error={Boolean(errors.dob?.message)}
                          />
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
                    rules={{
                      required: { value: true, message: t<string>('enter-valid-dob') },
                      validate: {
                        validDob: (val) => {
                          const dob = dayjs(val);
                          return (dob.isValid() && dob.isBefore(dayjs())) || t<string>('enter-valid-dob');
                        },
                      },
                    }}
                    name="dob"></Controller>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }} id="addressLbl" htmlFor="address">
                    {t('address')}
                  </FormLabel>
                  <Controller
                    render={({ field }) => (
                      <TextFieldTrimmed
                        multiline
                        rows={4}
                        id="address"
                        error={Boolean(errors.address)}
                        helperText={errors.address?.message}
                        value={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        placeholder={t('enter-address')}
                        sx={{ mb: { xs: 1, sm: 2.5 } }}
                        reactHookFormKey="address"
                        setTrimmedValueOnBlurOrSubmit={setValue}
                        autoComplete="off"
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
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }} id="pinCodeLbl" htmlFor="pinCode">
                    {t('pin')}
                  </FormLabel>
                  <Controller
                    render={({ field }) => (
                      <TextFieldTrimmed
                        id="pinCode"
                        error={Boolean(errors.pinCode)}
                        helperText={errors.pinCode?.message}
                        value={field.value}
                        type="number"
                        onChange={field.onChange}
                        inputRef={field.ref}
                        placeholder={t('enter-pin')}
                        sx={{ mb: { xs: 1, sm: 2.5 } }}
                        reactHookFormKey="pinCode"
                        setTrimmedValueOnBlurOrSubmit={setValue}
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
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: { md: 'flex-end', xs: 'center' }, mt: 3 }}>
              <Button sx={{ flexGrow: { xs: 1, sm: 0 } }} type="submit" disabled={loading}>
                {loading ? <CircularProgress color="inherit" /> : t('complete-kyc')}
              </Button>
            </Box>
            <Snackbar open={Boolean(snackMessage)} message={snackMessage}></Snackbar>
          </Box>
        </Box>
      </Fade>
    </>
  );
};

export default KycForm;
