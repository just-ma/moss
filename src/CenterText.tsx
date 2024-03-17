import styled from "styled-components";

const Text = styled.div<{ show: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #8affa9;
  font-size: 22px;
  z-index: 2;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 3s;
  font-size: 24px;
  line-height: 24px;
  white-space: pre-wrap;
  text-transform: uppercase;
  text-align: center;
  pointer-events: none;
`;

// const getPos = (index: number, t: number): [number, number] => {
//   const i = 5 - index;
//   const pow = Math.pow(i, 2) / 10;
//   return [
//     i * (37 + Math.sin(t * 4 + pow)),
//     i * (7 * Math.cos(t * 2 + pow)) - 30,
//   ];
// };

type ComponentProps = {
  show: boolean;
};

export default function CenterText({ show }: ComponentProps) {
  return (
    <Text show={show}>
      {
        "click   anywhere   to   be  a   moss\n\nfor    100   seconds\n\n\n\n(  headphones   recommended  )"
      }
    </Text>
  );
}
