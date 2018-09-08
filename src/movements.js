import { snapDrag, snapResize } from "./positionCalc";

export function onTouchStart(e, widget) {
    e.preventDefault();

    widget.container.curWidget = widget;

    if (widget.container.isEditMode || widget.light) {
        move(e, widget);
    } else {
        widget.presstimer = setTimeout(() => {
            widget.container.isEditMode = true;
            widget.container.editModeOn();
        }, widget.container.editTimer);
    }
}

export function onTouchMove(e, wgt) {
    if (wgt) {

        let scaleX = 1;
        let scaleY = 1;

        if (!wgt.light) {
            scaleX = Math.round((wgt.container.container.getBoundingClientRect().width
                / wgt.container.container.offsetWidth) * 100) / 100;
            scaleY = Math.round((wgt.container.container.getBoundingClientRect().height
                / wgt.container.container.offsetHeight) * 100) / 100;
        }

        if (wgt.drag) {
            let pageX = e.touches ? e.touches[0].pageX : e.pageX;
            let pageY = e.touches ? e.touches[0].pageY : e.pageY;

            wgt.x = wgt.x + ((pageX - wgt.prevx) / scaleX);
            wgt.y = wgt.y + ((pageY - wgt.prevy) / scaleY);

            wgt.prevx = pageX;
            wgt.prevy = pageY;

            wgt.el.style.left = wgt.x + 'px';
            wgt.el.style.top = wgt.y + 'px';

            if (wgt.container.trash) {
                let scaledPageX = pageX - ((wgt.container.container.offsetWidth - wgt.container.container.getBoundingClientRect().width) / 2);
                let scaledPageY = pageY -((wgt.container.container.offsetHeight - wgt.container.container.getBoundingClientRect().height) / 2);

                if (scaledPageX > (wgt.container.w - 100) * scaleX && scaledPageX < (wgt.container.w - 50) * scaleX &&
                    scaledPageY > (wgt.container.h - 100) * scaleY && scaledPageY < (wgt.container.h - 50) * scaleY) {
                    wgt.container.trashEl.classList.add('hover');
                    wgt.container.trashEl.style.opacity = '0.5';
                }
                else {
                    wgt.container.trashEl.classList.remove('hover');
                    wgt.container.trashEl.style.opacity = '1';
                }
            }

        } else if (wgt.resize) {

            let clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let clientY = e.touches ? e.touches[0].clientY : e.clientY;

            if (wgt.resizeOpt.right)
                wgt.w = wgt.resizeOpt.w + ((clientX - wgt.resizeOpt.x) / scaleX);

            if (wgt.resizeOpt.bot)
                wgt.h = wgt.resizeOpt.h + ((clientY - wgt.resizeOpt.y) / scaleY);

            if (wgt.resizeOpt.left) {
                wgt.x = wgt.resizeOpt.sx + ((clientX - wgt.resizeOpt.x) / scaleX);
                wgt.w = wgt.resizeOpt.w - clientX + wgt.resizeOpt.x;
            }

            if (wgt.resizeOpt.top) {
                wgt.y = wgt.resizeOpt.sy + ((clientY - wgt.resizeOpt.y) / scaleY);
                wgt.h = wgt.resizeOpt.h - clientY + wgt.resizeOpt.y;
                }

            wgt.el.style.left = wgt.x + 'px';
            wgt.el.style.top = wgt.y + 'px';
            wgt.el.style.width = wgt.w + 'px';
            wgt.el.style.height = wgt.h + 'px';
        }
    }
}

export function onTouchEnd(e, wgt, callback=null) {
    if (wgt) {
        cancel(wgt);
        if (!wgt.light) {

            if (wgt.container.trash) {

                wgt.container.trashEl.style.opacity = '1';
                wgt.container.trashEl.style.display = 'none';

                if (wgt.container.trashEl.classList.contains('hover')) {
                    wgt.el.parentNode.removeChild(wgt.el);
                    wgt.container.setWidgets();

                    wgt.container.trashEl.classList.remove('hover');

                    if (wgt.container.trashFunc !== null)
                        wgt.container.trashFunc(wgt);
                    return ;
                }
            }

            if (wgt.drag)
                snapDrag(wgt);
            else if (wgt.resize)
                snapResize(wgt);

            wgt.setInfos();

            wgt.el.style.zIndex = "0";

            wgt.drag = false;
            wgt.resize = false;

            wgt = null

        } else
            wgt.drag = false;

        if (callback)
            callback(e, wgt);
    }
}

export function cancel(widget) {
    if (widget.presstimer !== null) {
        clearTimeout(widget.presstimer);
        widget.presstimer = null;
    }
}

function move(e, widget) {

    let pageX = (e.touches ? e.touches[0].pageX : e.pageX);
    let pageY = (e.touches ? e.touches[0].pageY : e.pageY);

    if (widget.x === 0 && widget.y === 0 &&
        widget.w === 0 && widget.h === 0) {
        widget.x = widget.el.getBoundingClientRect().left;
        widget.y = widget.el.getBoundingClientRect().top;
        widget.w = widget.el.getBoundingClientRect().width;
        widget.h = widget.el.getBoundingClientRect().height;
    }

    widget.prevx = pageX;
    widget.prevy = pageY;

    widget.el.style.zIndex = "99";

    if (!widget.light) {

        if (widget.container.trash)
            widget.container.trashEl.style.display = '';

        if (widget.resizable) {

            let curX = widget.el.getBoundingClientRect().left,
                curY = widget.el.getBoundingClientRect().top,
                curW = widget.el.getBoundingClientRect().width,
                curH = widget.el.getBoundingClientRect().height;

            widget.resizeOpt.right = pageX >= (curX + curW - 10) && pageX <= (curX + curW + 10);
            widget.resizeOpt.left = pageX >= (curX - 10) && pageX <= (curX + 10);
            widget.resizeOpt.top = pageY >= (curY - 10) && pageY <= (curY + 10);
            widget.resizeOpt.bot = pageY >= (curY + curH - 10) && pageY <= (curY + curH + 10);
        }

        if (widget.resizeOpt.right || widget.resizeOpt.left || widget.resizeOpt.top || widget.resizeOpt.bot) {
            widget.resizeOpt.x = e.touches ? e.touches[0].clientX : e.clientX;
            widget.resizeOpt.y = e.touches ? e.touches[0].clientY : e.clientY;
            widget.resizeOpt.w = widget.w;
            widget.resizeOpt.h = widget.h;
            widget.resizeOpt.sx = widget.x;
            widget.resizeOpt.sy = widget.y;
            widget.resize = true;
        }
        else
            widget.drag = true;
    } else {

        widget.drag = true;

        let parent2 = widget.el.parentElement.parentElement.parentElement;
        let parent = widget.el.parentElement;
        let clone = widget.el.cloneNode(true);

        widget.el.style.position = 'absolute';
        widget.el.style.left = widget.x + 'px';
        widget.el.style.top = widget.y + 'px';

        parent2.appendChild(widget.el);
        parent.appendChild(clone);
    }
}
