function resizeWindow(elmnt) {

    if (elmnt.querySelector(".window__footer")) {
        elmnt.querySelector(".window__footer > .resize").onmousedown = initResize;
    } else {
        elmnt.onmousedown = initResize;
    }

    var startX, startY, startWidth, startHeight;
    function initResize(e) {
        elmnt.classList.add('resizing');
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(window.getComputedStyle(elmnt).width);
        startHeight = parseInt(window.getComputedStyle(elmnt).height);
        document.onmousemove = resize;
        document.onmouseup = stopResize;
    }

    function resize(e) {
        elmnt.style.width = (startWidth + e.clientX - startX) + 'px';
        elmnt.style.height = (startHeight + e.clientY - startY) + 'px';
    }

    function stopResize(e) {
        elmnt.classList.remove('resizing');
        document.onmouseup = null;
        document.onmousemove = null;
    }

}