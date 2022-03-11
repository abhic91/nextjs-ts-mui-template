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
};

const TextFieldTrimmed = ({
  setTrimmedValueOnBlurOrSubmit,
  reactHookFormKey,
  callbackOnBlur,
  callbackOnKeyDown,
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
  return <TextField {...otherProps} onBlur={handleBlur} onKeyDown={handleKeyDown} />;
};

export default TextFieldTrimmed;
