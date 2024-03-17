export const vertexShader = /* glsl */ `
precision mediump float;

uniform bool uFlipped;

varying vec2 vUv;

void main() {
  if (uFlipped) {
    vUv = vec2(1. - uv.x, uv.y);
  } else {
    vUv = uv;
  }

  vec3 pos = position + vec3(0, 0, uv.x);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

export const fragmentShader = /* glsl */ `
precision mediump float;

uniform sampler2D uTexture;
uniform sampler2D uTexture2;
uniform float uT;
uniform bool uClear;
uniform float uLumaThreshold;
uniform bool uFlipped;

varying vec2 vUv;

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float colorShiftVar(float x) {
  return -0.5 * sin(x) + 1.;
}

vec3 colorShift(vec3 color) {
  return vec3(colorShiftVar(color.x) - 0.1, colorShiftVar(color.y) - 0.1, colorShiftVar(color.z) + 0.5);
}

vec3 colorShift2(vec3 color) {
  return vec3(colorShiftVar(color.x) + 0.1, colorShiftVar(color.y) + 0.2, colorShiftVar(color.z));
}

void main() {  
  if (uClear && false) {
    gl_FragColor = vec4(0);
    return;
  }

  vec2 uv2;
  if (uFlipped) {
    uv2 = vec2(1. - vUv.x, vUv.y);
  } else {
    uv2 = vUv;
  }

  // colors
  vec3 color1Base = texture2D(uTexture, vUv).xyz;
  vec3 color1 = colorShift(color1Base);
  vec3 color2 = texture2D(uTexture2, uv2).xyz;

  if (color2.y > color2.z && !uClear) {
    color1 = colorShift2(color1Base);
  }

  float ratio = 0.005;
  float drive = 1.3 + uLumaThreshold;
  vec4 color = vec4((color1 * (ratio * drive) + color2 * (1. - ratio)), 1);

  // final paint
  if (color.x <= .9) {
    gl_FragColor = color;
  } else {
    gl_FragColor = vec4(color.xyz * 0.3 * fract(uT * 500.) * vec3(0.1, min(0.009 * uT, 1.), 0.1), 1);
  }
}`;
