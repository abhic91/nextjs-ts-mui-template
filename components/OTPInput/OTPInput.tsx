import { Box, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { KeyboardEvent, ClipboardEvent } from 'react';

type OTPInputProps = {
  noOfInputs: number;
  isDisabled?: Boolean;
  isErrorProp: Boolean;
  clearOTPKey?: number; //TODO:
  setValue: Function; //function that sets value of parent's otp val state
  onEnterPressed: Function;
  //   inputTypeProp: '';
};
//TODO: SIZE ON MOBILE
//TODO: TRIM

const OTPInput = ({ noOfInputs, isErrorProp, setValue, isDisabled, onEnterPressed, clearOTPKey }: OTPInputProps) => {
  const noOfInputsArray = [...Array(noOfInputs)];
  const [inpValues, setInpValues] = useState<string[]>([...Array(noOfInputs)].map(() => ''));
  const [isError, setIsError] = useState<Boolean>(isErrorProp);
  const otpInputRefs = useRef<HTMLInputElement[]>([]);

  const onInputChange = (val: string, indx: number) => {
    val = val.length > 1 ? val.slice(-1) : val;
    if (val) {
      setFocusOnInputAtIndex(indx + 1);
      setInpValues((inpValues) => inpValues.map((currentVal, i) => (indx === i ? val : currentVal)));
    }
    // else setFocusOnInputAtIndex(indx - 1);
  };

  const selectTypedText = (index: number) => {
    const ref = otpInputRefs.current[index];
    if (ref?.value)
      setTimeout(() => {
        ref.select();
      }, 0);
  };
  const setFocusOnInputAtIndex = (index: number) => {
    const ref = otpInputRefs.current[index];
    if (ref) ref.focus();
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Enter') {
      onEnterPressed();
      return;
    }
    if (e.key === 'Backspace') {
      e.preventDefault();
      setInpValues((inpValues) => inpValues.map((currentVal, i) => (i === index ? '' : currentVal)));
      setFocusOnInputAtIndex(index - 1);
      return;
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
    otpInputRefs.current[0].focus();
  }, []);
  useEffect(() => {
    setIsError(isErrorProp);
    // setFocusOnInputAtIndex(inpValues.findIndex((v) => v.length === 0));
  }, [isErrorProp, setIsError]);

  useEffect(() => {
    setValue(inpValues.join(''));
  }, [inpValues, setValue]);

  useEffect(() => {
    setInpValues([...Array(noOfInputs)].map(() => ''));
    setFocusOnInputAtIndex(0);
  }, [clearOTPKey, setInpValues, noOfInputs]);

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {noOfInputsArray.map((_, indx) => (
          <TextField
            sx={{ maxWidth: '50px', '& input': { textAlign: 'center' } }}
            key={indx}
            type="number"
            disabled={Boolean(isDisabled)}
            inputRef={(el) => (otpInputRefs.current[indx] = el)}
            error={Boolean(isError)}
            value={inpValues[indx]}
            inputProps={{ inputMode: 'numeric' }}
            onKeyUp={(e) => handleKeyUp(e, indx)}
            onFocus={() => selectTypedText(indx)}
            onChange={(e) => onInputChange(e.target.value, indx)}
            onPaste={(e) => onPaste(e)}></TextField>
        ))}
      </Box>
    </>
  );
};

export default OTPInput;
