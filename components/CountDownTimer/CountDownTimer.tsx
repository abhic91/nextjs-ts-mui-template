import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useCallback, useEffect, useState, useRef } from 'react';
import classes from './CountDownTimer.module.css';

dayjs.extend(duration);
type CountDownTimerProps = {
  startTimeInSeconds: number;
  onTimerDone?: Function;
  restartTimerKey: number;
};

const CountDownTimer = function CountDownTimer({ startTimeInSeconds, onTimerDone, restartTimerKey }: CountDownTimerProps) {
  const [time, setTime] = useState(dayjs.duration(startTimeInSeconds, 'seconds'));
  const [timeInMinuteSecondFormat, setTimeInMinuteSecondFormat] = useState('00:00');
  const intervalRef = useRef<number>(-1);

  const startTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setTime(dayjs.duration(startTimeInSeconds, 'seconds'));
    intervalRef.current = window.setInterval(() => {
      setTime((prevTime) => {
        if (prevTime.asSeconds() === 1) {
          clearInterval(intervalRef.current);
        }
        return prevTime.subtract(1, 'seconds');
      });
    }, 1000);
  }, [startTimeInSeconds]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, [startTimer]);

  useEffect(() => {
    if (time.asSeconds() === 0) onTimerDone?.();
    setTimeInMinuteSecondFormat(time.format('mm:ss'));
  }, [time, onTimerDone]);

  useEffect(() => {
    startTimer();
  }, [restartTimerKey, startTimer]);

  return (
    <>
      <span className={classes.timerWrapper}>{timeInMinuteSecondFormat}</span>
    </>
  );
};

export default CountDownTimer;
