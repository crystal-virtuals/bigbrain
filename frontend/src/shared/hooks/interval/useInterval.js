import { useEffect, useRef } from 'react';

const useInterval = (callback, delay, immediate = false, paused = false) => {
  const savedCallback = useRef();

  // Save the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    // Skip if paused or delay is null
    if (paused || delay === null) return;

    const tick = () => savedCallback.current?.();

    // If immediate is true, call the callback immediately
    if (immediate) tick();
    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay, immediate, paused]);
};

export default useInterval;
