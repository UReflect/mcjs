export function snapDrag(container) {
    let pos = []
    let wgt = container.curWidget
    let grid = container.grid

    container.widgets.forEach((widget) => {
        if (wgt.x !== widget.x || wgt.y !== widget.y)
            pos.push({ x: widget.x, y: widget.y, w: widget.w, h: widget.h })
    })

    let tmpx = 0, tmpy = 0, min = container.w + container.h

    for (let x in container.grid) {
        let tmp = Math.abs(wgt.x - grid[x][0]) + Math.abs(wgt.y - grid[x][1])
        let check = false

        if (tmp >= 0 && tmp < min && (grid[x][0] + wgt.w) <= container.w && (grid[x][1] + wgt.h) <= container.h) {
            for (let y = 0; y < pos.length; y++) {
                if (!(grid[x][0] >= (pos[y].x + pos[y].w)) && !((grid[x][0] + wgt.w) <= pos[y].x)
                    && !(grid[x][1] >= (pos[y].y + pos[y].h)) && !((grid[x][1] + wgt.h) <= pos[y].y))
                    check = true;
            }
            if (!check) {
                min = tmp
                tmpx = grid[x][0]
                tmpy = grid[x][1]
            }
        }
    }

    let prevx = wgt.x
    let prevy = wgt.y

    wgt.x = tmpx
    wgt.y = tmpy
    wgt.el.style.left = tmpx + 'px'
    wgt.el.style.top = tmpy + 'px'

    return {dw: tmpx - prevx, dh: tmpy - prevy}
}

export function snapResize(container) {
    let result = {w: 0, h: 0}
    let res = {}, min = 0
    let wgt = container.curWidget

    if (wgt.resizeOpt.top) {
        res = snapDrag(container)
        min = container.h / container.size[1]

        result.h = (wgt.h - res.dh) < min ? min - 1 : wgt.h - res.dh - 1

    } else if (wgt.resizeOpt.bot) {
        snapDrag(container)
        min = container.h / container.size[1]

        if (wgt.h % min >= min / 2 && wgt.h >= min / 2)
            result.h = wgt.h + (min - (wgt.h % min)) - 1
        else if (wgt.h >= min / 2)
            result.h = wgt.h - (wgt.h % min) - 1
        else
            result.h = min - 1

    } else
        result.h = wgt.h

    if (wgt.resizeOpt.left) {
        res = snapDrag(container)
        min = container.w / container.size[0]

        result.w = (wgt.w - res.dw) < min ? min - 1 : wgt.w - res.dw - 1

    } else if (wgt.resizeOpt.right) {
        snapDrag(container)
        min = container.w / container.size[0]

        if (wgt.w % min >= min / 2 && wgt.w >= min / 2)
            result.w = wgt.w + (min - (wgt.w % min)) - 1
        else if (wgt.w >= min / 2)
            result.w = wgt.w - (wgt.w % min) - 1
        else
            result.w = min - 1

    } else
        result.w = wgt.w;

    wgt.w = result.w
    wgt.h = result.h
    wgt.el.style.width = result.w + 'px'
    wgt.el.style.height = result.h + 'px'
}