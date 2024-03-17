import { useEffect, useMemo, useRef } from "react";
import type { ShaderMaterial } from "three";
import { useFrame } from "@react-three/fiber";
import { OrthographicCamera, useFBO, useVideoTexture } from "@react-three/drei";
import { fragmentShader, vertexShader } from "./shaders";

type ComponentProps = {
  video: MediaStream;
  idle: boolean;
  lumaThreshold: React.MutableRefObject<number>;
  flipped: React.MutableRefObject<boolean>;
};

const Visualizer = ({
  video,
  idle,
  lumaThreshold,
  flipped,
}: ComponentProps) => {
  const materialRef = useRef<ShaderMaterial>(null);
  const isRenderTargetA = useRef(true);
  const startTimestamp = useRef(0);

  const texture = useVideoTexture(video);
  const renderTargetA = useFBO();
  const renderTargetB = useFBO();

  const uniforms = useMemo(() => {
    return {
      uTexture: {
        value: texture,
      },
      uTexture2: {
        value: null,
      },
      uT: {
        value: performance.now() / 1000,
      },
      uClear: {
        value: idle,
      },
      uLumaThreshold: {
        value: 0,
      },
      uFlipped: {
        value: flipped.current,
      },
    };
  }, []);

  useEffect(() => {
    if (!idle) {
      startTimestamp.current = performance.now();
    }
  }, [idle]);

  useFrame((state) => {
    if (!materialRef.current) {
      return;
    }

    const t = Math.min((performance.now() - startTimestamp.current) / 1000, 90);

    materialRef.current.uniforms.uTexture.value = texture;
    materialRef.current.uniforms.uT.value = t;
    materialRef.current.uniforms.uClear.value = idle;
    materialRef.current.uniforms.uLumaThreshold.value =
      lumaThreshold.current +
      (0.1 * Math.sin(t / 2) - 0.1 + -0.2 * Math.cos(t / 19) + 0.1 - t / 500);
    materialRef.current.uniforms.uFlipped.value = flipped.current;

    const { gl, scene, camera } = state;
    const currRenderTarget = isRenderTargetA.current
      ? renderTargetA
      : renderTargetB;
    isRenderTargetA.current = !isRenderTargetA.current;

    gl.autoClearColor = false;
    gl.setRenderTarget(currRenderTarget);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    materialRef.current.uniforms.uTexture2.value = currRenderTarget.texture;
  });

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 2000]} />
      <mesh>
        <planeGeometry args={[window.innerWidth, window.innerHeight, 1, 1]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </>
  );
};

export default Visualizer;
