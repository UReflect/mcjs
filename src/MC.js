import MCWidget from "./MCWidget"
import {onTouchEnd, onTouchMove} from "./movements";

class MC {
    constructor(container='widgetContainer', selector='.widget', size=[19, 10], inertia=true, debug=false) {
        this.container = document.getElementById(container)
        this.selector = selector
        this.size = size
        this.inertia = inertia
        this.debug = debug

        this.w = this.container.offsetWidth
        this.h = this.container.offsetHeight

        this.curWidget = null
        this.widgets = []
        this.grid = []

        for (let y = 0; y < this.h; y += (this.h / this.size[1]))
            for (let x = 0; x < this.w; x += (this.w / this.size[0]))
                this.grid.push([x + 0.5, y + 0.5])

        this.init()
    }

    init() {
        var self = this

        self.setGlobalHandlers()

        document.querySelectorAll(self.selector).forEach((el) => {
            self.widgets.push(new MCWidget(el, self))
        })

        if (self.debug)
            this.showDebug()
    }

    setGlobalHandlers() {
        var self = this

        document.addEventListener('mousemove', (e) => { onTouchMove(e, self) })
        document.addEventListener('touchmove', (e) => { onTouchMove(e, self) })

        document.addEventListener("mouseup", (e) => { onTouchEnd(e, self) })
        document.addEventListener("touchend", (e) => { onTouchEnd(e, self) })
    }

    showDebug() {
        var self = this

        var canvas = document.createElement('canvas')
        canvas.width = self.w
        canvas.height = self.h

        self.container.appendChild(canvas);

        var context = canvas.getContext("2d");

        for (let x = 0; x <= self.w; x += (self.w / self.size[0])) {
            context.moveTo(0.5 + x, 0);
            context.lineTo(0.5 + x, self.h);
        }


        for (let x = 0; x <= self.h; x += (self.h / self.size[1])) {
            context.moveTo(0, 0.5 + x);
            context.lineTo(self.w, 0.5 + x);
        }

        context.strokeStyle = "black";
        context.stroke();
    }
}

export default MC