import { useEffect, useState, useCallback, useRef } from 'react';

export const useAsync = (asyncFunction, immediate = true) => {
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures t\he below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(
    (...params) => {
      setPending(true);
      setValue(null);
      setError(null);
      return (
        asyncFunction(...params)
          .then(response => setValue(response))
          // eslint-disable-next-line no-shadow
          .catch(error => setError(error))
          .finally(() => setPending(false))
      );
    },
    [asyncFunction]
  );

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, pending, value, error };
};

export const useVideo = () => {
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState({ playedSeconds: 0 });
  const videoRef = useRef(null);
  const [reload, setReload] = useState(false);
  const [controlKeys, setControlKeys] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);

  return {
    duration,
    setDuration,
    progress,
    setProgress,
    videoRef,
    reload,
    setReload,
    controlKeys,
    setControlKeys,
    playing,
    setPlaying,
    videoUrl,
    setVideoUrl,
  };
};
