// Calculate springiness.
//
// Results in a value -1 <= v <= 1

const drag = 0.4;
const strength = 0.1;

let vel = 0;
let pos = 0;

const onAnimationFrame = () => {
  const scrollY = window.scrollY;

  let force = scrollY - pos;

  force *= strength; // the "strength" of our "spring"

  vel *= drag; // reduce the existing velocity a bit with drag
  vel += force; // add this frame's force to the velocity

  pos += vel; // update the position with the adjusted velocity

  const fixPos = pos - scrollY;

  const max = 100;

  const cappedRelPos = Math.max(-1, Math.min(fixPos / max, 1));

  draw(cappedRelPos);

  requestAnimationFrame(onAnimationFrame);
};

requestAnimationFrame(onAnimationFrame);

// Draw.
//
// Convert -1 <= v <= 1 to a courve height.

const topPathEl = document.querySelector('#top-curve-path');
const bottomPathEl = document.querySelector('#bottom-curve-path');

const draw = (v) => {
  const outerH = 50;
  const maxH = 25;

  const h = v * maxH;

  const topH = outerH - Math.max(0, h);
  const bottomH = Math.max(0, -h);

  const topD = `M 0 50 Q 50 ${topH} 100 50`;
  const bottomD = `M 0 0 Q 50 ${bottomH} 100 0`;

  topPathEl.setAttribute('d', topD);
  bottomPathEl.setAttribute('d', bottomD);
}
