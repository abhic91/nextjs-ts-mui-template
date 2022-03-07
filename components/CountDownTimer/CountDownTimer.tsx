import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';

dayjs.extend(duration);
type CountDownTimerProps = {
  startTimeInSeconds: number;
  onTimerDone?: Function;
};
const CountDownTimer = ({ startTimeInSeconds }: CountDownTimerProps) => {
  const [time, setTime] = useState(dayjs.duration(startTimeInSeconds, 'seconds'));
  const [timeInMinuteSecondFormat, setTimeInMinuteSecondFormat] = useState('00:00');

  console.log(time);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime.asSeconds() === 1) clearInterval(interval);
        return prevTime.subtract(1, 'seconds');
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeInMinuteSecondFormat(time.format('mm:ss'));
  }, [time]);

  return <>{<span>{timeInMinuteSecondFormat}</span>}</>;
};

export default CountDownTimer;
