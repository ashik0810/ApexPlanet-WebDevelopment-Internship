function throttle(callback, delay = 200) {
  let shouldWait = false;

  return function (...args) {
    if (shouldWait) return;

    callback.apply(this, args);

    shouldWait = true;

    setTimeout(() => {
      shouldWait = false;
    }, delay);
  };
}

window.addEventListener(
  "resize",
  throttle(() => {
    console.log("Window resized");
  }, 300),
);
