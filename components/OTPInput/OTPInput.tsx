import { Box, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { KeyboardEvent, ClipboardEvent } from 'react';

type OTPInputProps = {
  noOfInputs: number;
  isDisabled?: Boolean;
  isErrorProp: Boolean;
  clear?: Function; //TODO:
  setValue: Function; //function that sets value of parent's otp val state
  focusOnFirstInputOnVisibleKey: number;
  onEnterPressed: Function;
  //   inputTypeProp: '';
};
//TODO: SIZE ON MOBILE
//TODO: TRIM

const OTPInput = ({
  noOfInputs,
  isErrorProp,
  setValue,
  isDisabled,
  focusOnFirstInputOnVisibleKey,
  onEnterPressed,
}: OTPInputProps) => {
  const noOfInputsArray = [...Array(noOfInputs)];
  const [inpValues, setInpValues] = useState<string[]>([...Array(noOfInputs)].map(() => ''));
  const [isError, setIsError] = useState<Boolean>(isErrorProp);
  const otpInputRefs = useRef<HTMLInputElement[]>([]);

  const onInput = (val: string, indx: number) => {
    val = val.length > 1 ? val.slice(-1) : val;
    if (val) setFocusOnInputAtIndex(indx + 1);
    else setFocusOnInputAtIndex(indx - 1);
    setInpValues((inpValues) => inpValues.map((currentVal, i) => (indx === i ? val : currentVal)));
  };

  const selectTypedText = (index: number) => {
    const ref = otpInputRefs.current[index];
    if (ref?.value) ref.select();
  };
  const setFocusOnInputAtIndex = (index: number) => {
    const ref = otpInputRefs.current[index];
    if (ref) ref.focus();
  };

  const navigateUsingArrowKeys = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Enter') {
      onEnterPressed();
    }
    if (e.key === 'ArrowRight') setFocusOnInputAtIndex(index + 1);
    else if (e.key === 'ArrowLeft') setFocusOnInputAtIndex(index - 1);
  };

  const onPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('Text');
    setInpValues(pastedText.split(''));
  };
  useEffect(() => {
    setTimeout(() => {
      otpInputRefs.current[0].focus();
    }, 1000);
  }, []);
  useEffect(() => {
    setIsError(isErrorProp);
  }, [isErrorProp, setIsError]);

  useEffect(() => {
    setValue(inpValues.join(''));
  }, [inpValues, setValue]);

  useEffect(() => {
    setFocusOnInputAtIndex(0);
  }, [focusOnFirstInputOnVisibleKey]);

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {noOfInputsArray.map((_, indx) => (
          <TextField
            sx={{ maxWidth: '50px', '& input': { textAlign: 'center' } }}
            key={indx}
            disabled={Boolean(isDisabled)}
            inputRef={(el) => (otpInputRefs.current[indx] = el)}
            error={Boolean(isError)}
            value={inpValues[indx]}
            inputProps={{ inputMode: 'numeric' }}
            onKeyUp={(e) => navigateUsingArrowKeys(e, indx)}
            onFocus={() => selectTypedText(indx)}
            onChange={(e) => onInput(e.target.value, indx)}
            onPaste={(e) => onPaste(e)}></TextField>
        ))}
      </Box>
    </>
  );
};

export default OTPInput;
