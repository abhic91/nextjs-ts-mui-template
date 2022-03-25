import { TextField, TextFieldProps } from '@mui/material';
import { KeyboardEvent, FocusEvent } from 'react';

type TextFieldTrimmedProps = TextFieldProps & {
  // eslint-disable-next-line no-unused-vars
  setTrimmedValueOnBlurOrSubmit: (key: any, val: any) => void;
  reactHookFormKey: string;
  // eslint-disable-next-line no-unused-vars
  callbackOnBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void;
  // eslint-disable-next-line no-unused-vars
  callbackOnKeyDown?: (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textAllCaps?: boolean;
};

const TextFieldTrimmed = ({
  setTrimmedValueOnBlurOrSubmit,
  reactHookFormKey,
  callbackOnBlur,
  callbackOnKeyDown,
  inputProps,
  textAllCaps,
  ...otherProps
}: TextFieldTrimmedProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setTrimmedValueOnBlurOrSubmit(reactHookFormKey, (e.target as HTMLInputElement).value?.trim());
    }
    callbackOnKeyDown?.(e);
  };
  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    setTrimmedValueOnBlurOrSubmit(reactHookFormKey, (e.target as HTMLInputElement).value?.trim());
    callbackOnBlur?.(e);
  };
  return (
    <TextField
      {...otherProps}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      inputProps={{
        sx: textAllCaps
          ? {
              textTransform: { '&': { textTransform: 'uppercase', '&::placeholder': { textTransform: 'none' } } },
              ...inputProps?.sx,
            }
          : { ...inputProps?.sx },
        ...inputProps,
      }}
    />
  );
};

export default TextFieldTrimmed;
