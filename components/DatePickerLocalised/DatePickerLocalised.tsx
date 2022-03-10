import AdapterDateFns from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker, { DatePickerProps } from '@mui/lab/DatePicker';
const DatePickerLocalised = (props: DatePickerProps) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DatePicker {...props} />
  </LocalizationProvider>
);

export default DatePickerLocalised;
