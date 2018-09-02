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
        if (wgt.drag) {
            let pageX = e.touches ? e.touches[0].pageX : e.pageX;
            let pageY = e.touches ? e.touches[0].pageY : e.pageY;

            wgt.x = wgt.x + (pageX - wgt.prevx);
            wgt.y = wgt.y + (pageY - wgt.prevy);

            wgt.prevx = pageX;
            wgt.prevy = pageY;

            wgt.el.style.left = wgt.x + 'px';
            wgt.el.style.top = wgt.y + 'px';

            if (wgt.container.trash) {
                if (pageX > wgt.container.w - 100 && pageX < wgt.container.w - 50 &&
                    pageY > wgt.container.h - 100 && pageY < wgt.container.h - 50) {
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
                wgt.w = (wgt.resizeOpt.w + clientX - wgt.resizeOpt.x);

            if (wgt.resizeOpt.bot)
                wgt.h = (wgt.resizeOpt.h + clientY - wgt.resizeOpt.y);

            if (wgt.resizeOpt.left) {
                wgt.x = (wgt.resizeOpt.sx + clientX - wgt.resizeOpt.x);
                wgt.w = (wgt.resizeOpt.w - clientX + wgt.resizeOpt.x);
            }

            if (wgt.resizeOpt.top) {
                wgt.y = (wgt.resizeOpt.sy + clientY - wgt.resizeOpt.y);
                wgt.h = (wgt.resizeOpt.h - clientY + wgt.resizeOpt.y);
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

                    return
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

    let pageX = e.touches ? e.touches[0].pageX : e.pageX;
    let pageY = e.touches ? e.touches[0].pageY : e.pageY;

    widget.prevx = pageX;
    widget.prevy = pageY;

    widget.el.style.zIndex = "99";

    if (!widget.light) {

        if (widget.container.trash)
            widget.container.trashEl.style.display = '';

        if (widget.resizable) {
            widget.resizeOpt.right = pageX >= (widget.x + widget.w - 10) && pageX <= (widget.x + widget.w + 10);
            widget.resizeOpt.left = pageX >= (widget.x - 10) && pageX <= (widget.x + 10);
            widget.resizeOpt.top = pageY >= (widget.y - 10) && pageY <= (widget.y + 10);
            widget.resizeOpt.bot = pageY >= (widget.y + widget.h - 10) && pageY <= (widget.y + widget.h + 10);
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
