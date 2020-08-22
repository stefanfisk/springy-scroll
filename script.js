// Constants.

const drag = 0.8;
const strength = 10;

const circleEl = document.querySelector(".circle");

// Types

class RollingAverage {
  constructor(length = 10) {
    this.i = 0;
    this.values = new Array(length);
    this.values.fill(null);
  }

  add(val) {
    this.values[this.i] = val;
    this.i++;

    if (this.i === this.values.length) {
      this.i = 0;
    }
  }

  get() {
    let acc = 0;
    let n = 0;

    for (const v of this.values) {
      if (null === v) {
        continue;
      }

      acc += v;
      n++;
    }

    if (0 === n) {
      return 0;
    }

    const avg = acc / n;

    return avg;
  }
}

// State.

let oldTimestamp = 0;
let oldScrollY = 0;

let rollingScrollVel = new RollingAverage();

let pos = 0;
let vel = 0;

// Event Handlers.

const update = (dT) => {
  const scrollY = window.scrollY;

  const scrollDY = scrollY - oldScrollY;

  const scrollVel = scrollDY;

  rollingScrollVel.add(scrollVel);

  const avgScrollVel = rollingScrollVel.get();

  let force = avgScrollVel;

  force *= strength; // the "strength" of our "spring"

  vel *= drag; // reduce the existing velocity a bit with drag
  vel += force; // add this frame's force to the velocity
  pos += vel; // update the position with the adjusted velocity

  circleEl.style.top = pos + "px";

  console.log({ dT, scrollDY, scrollVel, avgScrollVel, force, pos, vel });

  oldScrollY = scrollY;
};

const onAnimationFrame = (timestamp) => {
  if (!oldTimestamp) {
    oldTimestamp = timestamp;
  }

  let dT = timestamp - oldTimestamp;

  if (0 !== dT) {
    update(dT);
  }

  oldTimestamp = timestamp;

  requestAnimationFrame(onAnimationFrame);
};

requestAnimationFrame(onAnimationFrame);
