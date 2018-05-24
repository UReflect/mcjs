import {snapDrag, snapResize} from "./positionCalc";

export function onTouchStart(e, widget) {
    widget.container.curWidget = widget
    widget.presstimer = setTimeout(() => {
        move(e, widget)
    }, 1000)
}

export function onTouchMove(e, container) {
    if (container.curWidget) {
        let wgt = container.curWidget
        if (wgt.drag) {
            let pageX = e.touches ? e.touches[0].pageX : e.pageX
            let pageY = e.touches ? e.touches[0].pageY : e.pageY

            wgt.x = wgt.x + (pageX - wgt.prevx)
            wgt.y = wgt.y + (pageY - wgt.prevy)

            wgt.prevx = pageX
            wgt.prevy = pageY

            wgt.el.style.left = wgt.x + 'px'
            wgt.el.style.top = wgt.y + 'px'
        } else if (wgt.resize) {

            if (wgt.resizeOpt.right)
                wgt.w = (wgt.resizeOpt.w + e.clientX - wgt.resizeOpt.x)

            if (wgt.resizeOpt.bot)
                wgt.h = (wgt.resizeOpt.h + e.clientY - wgt.resizeOpt.y)

            if (wgt.resizeOpt.left) {
                wgt.x = (wgt.resizeOpt.sx + e.clientX - wgt.resizeOpt.x)
                wgt.w = (wgt.resizeOpt.w - e.clientX + wgt.resizeOpt.x)
            }

            if (wgt.resizeOpt.top) {
                wgt.y = (wgt.resizeOpt.sy + e.clientY - wgt.resizeOpt.y)
                wgt.h = (wgt.resizeOpt.h - e.clientY + wgt.resizeOpt.y)
            }

            wgt.el.style.left = wgt.x + 'px'
            wgt.el.style.top = wgt.y + 'px'
            wgt.el.style.width = wgt.w + 'px'
            wgt.el.style.height = wgt.h + 'px'
        }
    }
}

export function onTouchEnd(e, container) {
    if (container.curWidget) {
        cancel(container.curWidget)

        if (container.curWidget.drag)
            snapDrag(container);
        else if (container.curWidget.resize)
            snapResize(container);

        container.curWidget.el.style.zIndex = "0"
        container.curWidget.el.style.boxSizing = ""
        container.curWidget.el.style.border = ""

        container.curWidget.drag = false
        container.curWidget.resize = false

        container.curWidget = null
    }
}

export function cancel(widget) {
    if (widget.presstimer !== null) {
        clearTimeout(widget.presstimer)
        widget.presstimer = null
    }
}

function move(e, widget) {
    widget.el.style.zIndex = "999"

    let pageX = e.touches ? e.touches[0].pageX : e.pageX
    let pageY = e.touches ? e.touches[0].pageY : e.pageY

    widget.prevx = pageX
    widget.prevy = pageY

    if (widget.resizable) {

        widget.el.style.boxSizing = "border-box"
        widget.el.style.border = "10px solid black"

        widget.resizeOpt.right = pageX >= (widget.x + widget.w - 10) && pageX <= (widget.x + widget.w)
        widget.resizeOpt.left = pageX >= (widget.x) && pageX <= (widget.x + 10)
        widget.resizeOpt.top = pageY >= (widget.y) && pageY <= (widget.y + 10)
        widget.resizeOpt.bot = pageY >= (widget.y + widget.h - 10) && pageY <= (widget.y + widget.h)
    }

    if (widget.resizeOpt.right || widget.resizeOpt.left|| widget.resizeOpt.top || widget.resizeOpt.bot) {
        widget.resizeOpt.x = e.clientX
        widget.resizeOpt.y = e.clientY
        widget.resizeOpt.w = widget.w
        widget.resizeOpt.h = widget.h
        widget.resizeOpt.sx = widget.x
        widget.resizeOpt.sy = widget.y
        widget.resize = true
    }
    else
        widget.drag = true
}
