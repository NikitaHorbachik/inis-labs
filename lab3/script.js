function getTarget(e) {
    var targ

    if (!e) var e = window.event;
    if (e.target) targ = e.target;
    else if (e.srcElement) targ = e.srcElement;
    if (targ.nodeType == 3) // defeat Safari bug
        targ = targ.parentNode;

    return targ;
}

function restorePosition(targ, lastX, lastY) {
    targ.style.top = lastX;
    targ.style.left = lastY;
}

function prepareDivs() {
    const Divs = document.getElementsByClassName("target");

    var isActive = false;
    var isColorChangeActive = false;
    var targ;
    var lastX, lastY;

    for (let i = 0; i < Divs.length; i++) {
        Divs[i].addEventListener('mousedown', function(e) {
            targ = getTarget(e);
            lastX = targ.style.top;
            lastY = targ.style.left;

            isActive = true;
            offset = [
                targ.offsetLeft - e.clientX,
                targ.offsetTop - e.clientY
            ];
        }, true);

        Divs[i].addEventListener("dblclick", function(e) {
            targ = getTarget(e);
            lastX = targ.style.top;
            lastY = targ.style.left;
            isActive = true;
            isColorChangeActive = true;
        });

        Divs[i].addEventListener('mouseup', function() {
            isActive = false;
            isColorChangeActive = false;
        }, true);

        document.addEventListener('keydown', function(e) {
            if (e.key === "Escape") {
                isActive = false;
                isColorChangeActive = false;
                restorePosition(targ, lastX, lastY);
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (isActive) {
                mousePosition = {
                    x : e.clientX,
                    y : e.clientY
                };

                targ.style.left = (mousePosition.x + offset[0]) + 'px';
                targ.style.top  = (mousePosition.y + offset[1]) + 'px';
            }      
        }, true);

        document.addEventListener('mousemove', function(e) {
            if (isColorChangeActive) {
                x = e.clientX;
                y = e.clientY;
                red = x;
                green = y;
                blue = (x + y) / 2; 
                color = [red, green, blue].join(", ");
                targ.style.backgroundColor = 'rgb(' + color + ')';
            }      
        }, true);
    }
}

prepareDivs();