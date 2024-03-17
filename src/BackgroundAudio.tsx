import TalkAudio from "./assets/talk.mp3";
import AmbientAudio1 from "./assets/ambience1.mp3";
import AmbientAudio2 from "./assets/ambience2.mp3";
import MossAudio from "./assets/moss.mp3";
import { useEffect, useRef, useState } from "react";

const INITIAL_VOL = 0.8;

export default function BackgroundAudio({ idle }: { idle: boolean }) {
  const mossAudio = useRef<HTMLAudioElement>(null);
  const ambientAudio1 = useRef<HTMLAudioElement>(null);
  const ambientAudio2 = useRef<HTMLAudioElement>(null);
  const optimisticVol = useRef(INITIAL_VOL);

  const [vol, setVol] = useState(INITIAL_VOL);

  useEffect(() => {
    if (!idle) {
      mossAudio.current?.play();
      if (ambientAudio1.current && ambientAudio2.current) {
        optimisticVol.current = 0.45;
        setVol(INITIAL_VOL - 0.01);
      }
    } else {
      if (ambientAudio1.current && ambientAudio2.current) {
        optimisticVol.current = INITIAL_VOL;
        setVol(0.01);
      }
    }
  }, [idle]);

  useEffect(() => {
    if (ambientAudio1.current) {
      ambientAudio1.current.volume = vol;
    }

    if (ambientAudio2.current) {
      ambientAudio2.current.volume = vol;
    }

    if (Math.abs(vol - optimisticVol.current) < 0.01) {
      setVol(optimisticVol.current);
      return;
    }

    const timeoutId = setTimeout(
      () => setVol((prev) => prev + (optimisticVol.current - prev) * 0.1),
      100
    );

    return () => {
      clearTimeout(timeoutId);
    };
  }, [vol]);

  return (
    <>
      <audio loop autoPlay>
        <source src={TalkAudio} type="audio/mpeg" />
      </audio>
      <audio ref={ambientAudio1} loop autoPlay>
        <source src={AmbientAudio1} type="audio/mpeg" />
      </audio>
      <audio ref={ambientAudio2} loop autoPlay>
        <source src={AmbientAudio2} type="audio/mpeg" />
      </audio>
      <audio ref={mossAudio}>
        <source src={MossAudio} type="audio/mpeg" />
      </audio>
    </>
  );
}
