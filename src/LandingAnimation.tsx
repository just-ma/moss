import styled from "styled-components";
import CenterText from "./CenterText";
import { useEffect, useRef, useState } from "react";

const DAY_DURATION = 100000;
const AURA_DURATION = 30000;
const NIGHT_DURATION = 10000;

const SkyContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Night = styled.div<{ show: boolean; animate: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: black;
  animation: nightFadeIn ${({ animate }) => (animate ? NIGHT_DURATION : 0)}ms
    linear forwards ${({ show }) => !show && "reverse"};

  @keyframes nightFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.5;
    }
  }
`;

const Sun = styled.div<{ show: boolean; animate: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    #ffdaa7 20%,
    #fd8486,
    #b95f9d,
    #8769b3,
    #5763b9,
    #1a54aa,
    #103e7e 50%
  );
  animation: sunFadeIn ${({ animate }) => (animate ? AURA_DURATION : 0)}ms
    linear forwards ${({ show }) => !show && "reverse"};

  @keyframes sunFadeIn {
    0% {
      bottom: -200%;
      opacity: 0.7;
      transform: scale(5);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      bottom: -50%;
      opacity: 0;
      transform: scale(7);
    }
  }
`;

type ComponentProps = {
  idle: boolean;
  onIdleChange: (value: boolean) => void;
  reset: boolean;
};

const LandingAnimation = ({ idle, onIdleChange, reset }: ComponentProps) => {
  const timeout1 = useRef<number>();
  const timeout2 = useRef<number>();
  const timeout3 = useRef<number>();

  const [first, setFirst] = useState(true);
  const [showSun, setShowSun] = useState(false);
  const [showNight, setShowNight] = useState(true);

  const handleStart = async () => {
    console.log("start", idle);
    if (!idle) {
      console.log("start - ret");
      return;
    }

    setFirst(false);
    setShowSun(true);
    setShowNight(false);
    onIdleChange(false);

    timeout1.current = setTimeout(() => onIdleChange(true), DAY_DURATION);
    timeout2.current = setTimeout(
      () => setShowSun(false),
      DAY_DURATION - AURA_DURATION
    );
    timeout3.current = setTimeout(
      () => setShowNight(true),
      DAY_DURATION - NIGHT_DURATION
    );
  };

  useEffect(() => {
    if (reset) {
      clearTimeout(timeout1.current);
      clearTimeout(timeout2.current);
      clearTimeout(timeout3.current);

      onIdleChange(true);
      setFirst(true);
      setShowSun(false);
      setShowNight(true);
    }
  }, [reset]);

  return (
    <>
      <CenterText show={idle} />
      <SkyContainer onClick={handleStart}>
        <Sun key={String(showSun)} show={showSun} animate={!first} />
        <Night key={String(showNight)} show={showNight} animate={!first} />
      </SkyContainer>
    </>
  );
};

export default LandingAnimation;
