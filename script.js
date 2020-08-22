// Animate.

let oldTimestamp;

const onAnimationFrame = (timestamp) => {
  if (!oldTimestamp) {
    oldTimestamp = timestamp;

    requestAnimationFrame(onAnimationFrame);

    return;
  }

  const dT = timestamp - oldTimestamp;

  const x = calcX(dT);

  draw(x);

  oldTimestamp = timestamp;

  requestAnimationFrame(onAnimationFrame);
};

requestAnimationFrame(onAnimationFrame);

// Calculate springiness.
//
// Results in a value -1 <= x <= 1

const drag = 0.8; // reduce the existing velocity a bit with drag
const strength = 0.1; // the "strength" of our "spring"

let vel = 0;
let pos = 0;

const calcX = (dT) => {
  const scrollY = window.scrollY;

  let force = scrollY - pos;

  force *= strength;

  vel *= drag;
  vel += force;

  pos += vel;

  const fixPos = pos - scrollY;

  const max = 100;

  const cappedRelPos = Math.max(-1, Math.min(fixPos / max, 1));

  return cappedRelPos;
};

// Draw.
//
// Convert -1 <= x <= 1 to a courve height.

const topPathEl = document.querySelector('#top-curve-path');
const bottomPathEl = document.querySelector('#bottom-curve-path');

const outerH = 50; // Height of SVG element.
const maxH = 25; // Max height of path

const draw = (x) => {
  const h = x * maxH;

  const topH = outerH - Math.max(0, h);
  const bottomH = Math.max(0, -h);

  const topD = `M 0 50 Q 50 ${topH} 100 50`;
  const bottomD = `M 0 0 Q 50 ${bottomH} 100 0`;

  topPathEl.setAttribute('d', topD);
  bottomPathEl.setAttribute('d', bottomD);
}
