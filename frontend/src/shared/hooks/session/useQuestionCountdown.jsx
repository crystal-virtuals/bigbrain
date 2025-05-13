import { useEffect, useRef, useState, useCallback } from 'react';

export default function useQuestionCountdown({ isoTimeStart, duration }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const cleanup = useCallback(() => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!isoTimeStart) {
      setTimeLeft(duration);
      return;
    }

    const startTime = new Date(isoTimeStart).getTime();
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    const remainingSeconds = Math.max(0, duration - elapsedSeconds);

    setTimeLeft(remainingSeconds);

    // Clear previous timers
    cleanup();

    if (remainingSeconds > 0) {
      // Set a timeout for when the countdown should hit 0
      timeoutRef.current = setTimeout(() => {
        setTimeLeft(0);
      }, remainingSeconds * 1000);

      // Update every second
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    }

    return cleanup;
  }, [isoTimeStart, duration, cleanup]);

  return { timeLeft, stopCountdown: cleanup };
}