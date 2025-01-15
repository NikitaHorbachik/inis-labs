function restorePosition(targ, lastX, lastY, lastColor) {
  targ.style.top = lastX;
  targ.style.left = lastY;
  targ.style.backgroundColor = lastColor;
}

function prepareDivs() {
  const divs = document.getElementsByClassName("target");

  let isActive = false;
  let isColorChangeActive = false;
  let isResizing = false;
  let targ = null;
  let lastX, lastY, lastColor;
  let offset = [0, 0];
  let initialDistance = 0;
  let initialSize = { width: 0, height: 0 };

  const startDrag = (e) => {
    targ = e.target;
    lastX = targ.style.top;
    lastY = targ.style.left;
    lastColor = targ.style.backgroundColor;
    isActive = true;
    offset = [
      targ.offsetLeft - (e.clientX || e.touches[0].clientX),
      targ.offsetTop - (e.clientY || e.touches[0].clientY),
    ];
  };

  const stopDrag = () => {
    isActive = false;
    isColorChangeActive = false;
    isResizing = false;
  };

  const handleMove = (e) => {
    if (isActive) {
      const x = e.clientX || e.touches[0].clientX;
      const y = e.clientY || e.touches[0].clientY;
      targ.style.left = `${x + offset[0]}px`;
      targ.style.top = `${y + offset[1]}px`;
    }
  };

  const changeColor = (e) => {
    if (isColorChangeActive) {
      const x = e.clientX || e.touches[0]?.clientX;
      const y = e.clientY || e.touches[0]?.clientY;
      const color = `rgb(${x % 256}, ${y % 256}, ${(x + y) % 256})`;
      targ.style.backgroundColor = color;
    }
  };

  const handleDoubleClick = (e) => {
    targ = e.target;
    lastX = targ.style.top;
    lastY = targ.style.left;
    lastColor = targ.style.backgroundColor;
    isActive = true;
    isColorChangeActive = true;
  };

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      stopDrag();
      restorePosition(targ, lastX, lastY, lastColor);
    }
  };

  const handlePinchStart = (e) => {
    if (e.touches.length === 2) {
      targ = e.target;
      initialDistance = getDistance(e.touches[0], e.touches[1]);
      initialSize = {
        width: targ.offsetWidth,
        height: targ.offsetHeight,
      };
      isResizing = true;
      isActive = false;
    }
  };

  const handlePinchMove = (e) => {
    if (isResizing && e.touches.length === 2) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialDistance;

      targ.style.width = `${initialSize.width * scale}px`;
      targ.style.height = `${initialSize.height * scale}px`;
    }
  };

  const getDistance = (touch1, touch2) => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  for (let div of divs) {
    div.addEventListener("mousedown", startDrag);
    div.addEventListener("touchstart", startDrag);
    div.addEventListener("dblclick", handleDoubleClick);
    div.addEventListener("mouseup", stopDrag);
    div.addEventListener("touchend", stopDrag);
    div.addEventListener("touchstart", handlePinchStart);
    div.addEventListener("touchmove", handlePinchMove);
  }

  document.addEventListener("mousemove", handleMove);
  document.addEventListener("touchmove", handleMove);
  document.addEventListener("mousemove", changeColor);
  document.addEventListener("touchmove", changeColor);
  document.addEventListener("keydown", handleEscape);
}

prepareDivs();
