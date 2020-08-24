// Run simulation in at least 1/15 sec steps.

const maxDT = 1 / 15;

let oldTimestamp;

const onAnimationFrame = (timestamp) => {
  if (!oldTimestamp) {
    oldTimestamp = timestamp;

    requestAnimationFrame(onAnimationFrame);

    return;
  }

  let dT = (timestamp - oldTimestamp) / 1000;

  while (dT > maxDT) {
    calcX(maxDT);

    dT -= maxDT;
  }

  const x = calcX(dT);

  draw(x);

  oldTimestamp = timestamp;

  requestAnimationFrame(onAnimationFrame);
};

requestAnimationFrame(onAnimationFrame);

// Calculate springiness.
//
// Results in a value -1 <= x <= 1.

const mass = 10;
const k = 1000;
const damping = 100;
const maxLength = 500;

let velocityY = 0;
let y = window.scrollY;

const calcX = (dT) => {
  const scrollY = window.scrollY;

  let distanceY = (scrollY - y);

  if (distanceY < -maxLength) {
    y = scrollY + maxLength;
    distanceY = -maxLength;
  } else if (distanceY > maxLength) {
    y = scrollY - maxLength;
    distanceY = maxLength;
  }

  const springForceY = k * distanceY;
  const dampingForceY = damping * velocityY;
  const forceY = springForceY - dampingForceY;

  const accelerationY = forceY / mass;

  velocityY = velocityY + accelerationY * dT;

  y = y + velocityY * dT;

  const fixedY = y - scrollY;

  const relY = fixedY / maxLength;

  return relY;
};

// Draw.
//
// Converts -1 <= x <= 1 to a curve height.

const topPathEl = document.querySelector('#top-curve-path');
const bottomPathEl = document.querySelector('#bottom-curve-path');

const outerH = 50; // Height of SVG element.
const maxH = 25; // Max height of path

const draw = (x) => {
  const h = -x * maxH;

  const topH = outerH - Math.max(0, h);
  const bottomH = Math.max(0, -h);

  const topD = `M 0 50 Q 50 ${topH} 100 50`;
  const bottomD = `M 0 0 Q 50 ${bottomH} 100 0`;

  topPathEl.setAttribute('d', topD);
  bottomPathEl.setAttribute('d', bottomD);
}
