function getTarget(e) {
  var targ = e.target || e.srcElement;
  if (targ.nodeType === 3) targ = targ.parentNode; // Safari bug fix
  return targ;
}

function restorePosition(targ, lastX, lastY) {
  targ.style.top = lastX;
  targ.style.left = lastY;
}

function prepareDivs() {
  const divs = document.getElementsByClassName("target");

  let isActive = false;
  let isFollowingFinger = false;
  let isResizing = false;
  let targ = null;
  let lastX, lastY;
  let offset = [0, 0];
  let initialDistance = 0;
  let initialSize = { width: 0, height: 0 };
  const MIN_SIZE_HEIGHT = 30;
  const MIN_SIZE_WIDTH = 60;

  const startDrag = (e) => {
    targ = getTarget(e);
    lastX = targ.style.top;
    lastY = targ.style.left;
    isActive = true;
    offset = [
      targ.offsetLeft - (e.clientX || e.touches[0].clientX),
      targ.offsetTop - (e.clientY || e.touches[0].clientY),
    ];
  };

  const stopDrag = () => {
    isActive = false;
    isFollowingFinger = false;
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

  const handleDoubleClick = (e) => {
    targ = getTarget(e);
    isFollowingFinger = true;
  };

  const handlePinchStart = (e) => {
    if (e.touches.length === 2) {
      targ = getTarget(e);
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

      const newWidth = Math.max(initialSize.width * scale, MIN_SIZE_WIDTH);
      const newHeight = Math.max(initialSize.height * scale, MIN_SIZE_HEIGHT);

      targ.style.width = `${newWidth}px`;
      targ.style.height = `${newHeight}px`;
    }
  };

  const handleTouchMove = (e) => {
    if (isFollowingFinger) {
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      targ.style.left = `${x}px`;
      targ.style.top = `${y}px`;
    }
  };

  const handleTouchEnd = (e) => {
    if (isFollowingFinger && e.touches.length === 0) {
      document.addEventListener("touchstart", handleTouchStart);
    }
  };

  const handleTouchStart = (e) => {
    if (isFollowingFinger) {
      targ.style.left = `${e.touches[0].clientX}px`;
      targ.style.top = `${e.touches[0].clientY}px`;
    }
  };

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      stopDrag();
      restorePosition(targ, lastX, lastY);
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
  document.addEventListener("touchmove", handleTouchMove);
  document.addEventListener("touchend", handleTouchEnd);
  document.addEventListener("keydown", handleEscape);
}

prepareDivs();
