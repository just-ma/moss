import { useEffect, useMemo, useRef, useState } from "react";

const LUMA_THRESHOLD_KEY = "lumaThreshold";
const FLIPPED_KEY = "flipped";

interface KeyboardEvent {
  key: string;
}

export default function useKeyboardListener() {
  const lumaThreshold = useRef(
    Number(localStorage.getItem(LUMA_THRESHOLD_KEY)) || 0
  );
  const flipped = useRef(
    (localStorage.getItem(FLIPPED_KEY) ?? "true") === "true"
  );

  const [reset, setReset] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Escape": {
        setReset(true);
        break;
      }
      case "=": {
        const newThreshold = Math.min(lumaThreshold.current + 0.03, 0.7);
        lumaThreshold.current = newThreshold;
        window.localStorage.setItem(LUMA_THRESHOLD_KEY, String(newThreshold));
        break;
      }
      case "-": {
        const newThreshold = Math.max(lumaThreshold.current - 0.03, -0.7);
        lumaThreshold.current = newThreshold;
        window.localStorage.setItem(LUMA_THRESHOLD_KEY, String(newThreshold));
        break;
      }
      case "f": {
        const newFlipped = !flipped.current;
        flipped.current = newFlipped;
        window.localStorage.setItem(FLIPPED_KEY, String(newFlipped));
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Escape": {
        setReset(false);
        break;
      }
      default: {
        break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return useMemo(
    () => ({
      reset,
      lumaThreshold,
      flipped,
    }),
    [reset]
  );
}
