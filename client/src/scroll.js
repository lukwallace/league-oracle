/* https://github.com/fisshy/react-scroll/blob/master/modules/mixins/smooth.js */
const ease = (x) => {
  if(x < 0.5) {
    return Math.pow(x*2, 2)/2;
  }
  return 1-Math.pow((1-x)*2, 2)/2;
};

/* Function for animating vertical scroll */
const scrollScreen = (duration) => {
  const startPos = document.body.scrollTop;
  const delta = window.innerHeight;
  let start = null;

  const step = (timestamp) => {
    if(!start) {
      start = timestamp;
    }
    const progress = timestamp - start;
    const percent = progress >= duration ? 1 : ease(progress / duration);
    const currPos = startPos + Math.ceil(delta * percent);

    window.scrollTo(0, currPos);
    if(percent < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
};

module.exports = {
  scrollScreen
};