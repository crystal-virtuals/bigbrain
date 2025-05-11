import { useEffect, useRef, useState, useCallback } from 'react';

export default function useQuestionCountdown({ isoTimeStart, duration }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const cleanup = useCallback(() => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
  }, []);

  useEffect(() => {
    setTimeLeft(duration);
    cleanup();

    if (!isoTimeStart) return;

    const start = new Date(isoTimeStart).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - start) / 1000);
    const remaining = Math.max(0, duration - elapsed);
    setTimeLeft(remaining);

    if (remaining > 0) {
      timeoutRef.current = setTimeout(() => {
        setTimeLeft(0);
      }, remaining * 1000);
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return cleanup;
  }, [isoTimeStart, duration, cleanup]);

  return {
    timeLeft,
    stopCountdown: cleanup
  };
}
