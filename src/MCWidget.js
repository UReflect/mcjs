import {onTouchStart} from "./movements";

class MCWidget {
    constructor(element, container) {
        this.el = element
        this.container = container

        let widgetInfos = JSON.parse(this.el.getAttribute('data-widgetInfos'))

        this.x = (container.w / container.size[0]) * widgetInfos.posX  + 0.5
        this.y = (container.h / container.size[1]) * widgetInfos.posY  + 0.5
        this.w = (container.w / container.size[0]) * widgetInfos.sizeX  - 1
        this.h = (container.h / container.size[1]) * widgetInfos.sizeY  - 1

        this.resizable = widgetInfos.resizable
        this.resizeOpt = {right: false, left: false, top: false, bot: false, x: 0, y: 0, w: 0, h: 0, sx: 0, sy: 0}

        this.drag = false
        this.resize = false

        this.prevx = 0
        this.prevy = 0

        this.place()
        this.setHandlers()
    }

    place() {
        var self = this

        self.el.setAttribute('style',
                             'position:absolute;\
                             left:' + this.x + 'px;\
                             top:' + this.y + 'px;\
                             width:' + this.w + 'px;\
                             height:' + this.h + 'px;')
    }

    setHandlers() {
        var self = this

        self.el.addEventListener("mousedown", (e) => { onTouchStart(e, self) })
        self.el.addEventListener("touchstart", (e) => { onTouchStart(e, self) })
    }
}

export default MCWidget