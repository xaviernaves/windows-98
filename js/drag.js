function dragWindow(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (elmnt.querySelector(".window__header")) {
        elmnt.querySelector(".window__header").onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        elmnt.classList.add('dragging');
        e = e || window.event;
        pos3 = parseInt(e.clientX);
        pos4 = parseInt(e.clientY);
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        return false;
    }

    function elementDrag(e) {
        e = e || window.event;
        pos1 = pos3 - parseInt(e.clientX);
        pos2 = pos4 - parseInt(e.clientY);
        pos3 = parseInt(e.clientX);
        pos4 = parseInt(e.clientY);
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        elmnt.classList.remove('dragging');
        document.onmouseup = null;
        document.onmousemove = null;
    }
}