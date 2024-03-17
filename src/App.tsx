import { Canvas } from "@react-three/fiber";
import Visualizer from "./Visualizer";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import LandingAnimation from "./LandingAnimation";
import useKeyboardListener from "./useKeyboardListener";
import BackgroundAudio from "./BackgroundAudio";

const Page = styled.div<{ idle: boolean }>`
  cursor: ${({ idle }) => (idle ? "pointer" : "none")};
`;

const Video = styled.video`
  display: none;
`;

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export default function App() {
  const [init, setInit] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [idle, setIdle] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    const getVideoStream = async () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          ...windowSize,
        },
      });
      videoElement.srcObject = localStream;

      setInit(true);
    };

    getVideoStream();
  }, []);

  const { reset, lumaThreshold, flipped } = useKeyboardListener();

  return (
    <Page idle={idle}>
      <BackgroundAudio idle={idle} />
      <LandingAnimation idle={idle} onIdleChange={setIdle} reset={reset} />
      <Video ref={videoRef} muted autoPlay preload="none" playsInline />
      {init && (
        <CanvasWrapper>
          <Canvas>
            <Visualizer
              video={videoRef.current!.srcObject as MediaStream}
              idle={idle}
              lumaThreshold={lumaThreshold}
              flipped={flipped}
            />
          </Canvas>
        </CanvasWrapper>
      )}
    </Page>
  );
}
