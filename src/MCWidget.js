import { onTouchStart } from "./movements";
import { snapDrag } from "./positionCalc";

class MCWidget {
    constructor(element, light=true, container=null) {
        this.container = container;
        this.el = element;
        this.light = light;

        this.drag = false;
        this.resize = false;

        this.prevx = 0;
        this.prevy = 0;

        this.presstimer = null;

        this.setHandlers();

        if (!this.light)
            this.setupHeavy();
        else
            this.setupLight();


    }

    setupLight() {

        this.x = this.el.getBoundingClientRect().left;
        this.y = this.el.getBoundingClientRect().top;
        this.w = this.el.offsetWidth;
        this.h = this.el.offsetHeight;
    }

    setupHeavy() {
        let widgetInfos = JSON.parse(this.el.getAttribute('data-widgetInfos'));

        this.x = (this.container.w / this.container.size[0]) * widgetInfos.posX  + 0.5;
        this.y = (this.container.h / this.container.size[1]) * widgetInfos.posY  + 0.5;
        this.w = (this.container.w / this.container.size[0]) * widgetInfos.sizeX  - 1;
        this.h = (this.container.h / this.container.size[1]) * widgetInfos.sizeY  - 1;

        this.resizable = widgetInfos.resizable;
        this.resizeOpt = {right: false, left: false, top: false, bot: false, x: 0, y: 0, w: 0, h: 0, sx: 0, sy: 0};

        this.place();
    }

    place() {
        var self = this;

        self.el.setAttribute('style',
                             'position:absolute;\
                             left:' + self.x + 'px;\
                             top:' + self.y + 'px;\
                             width:' + self.w + 'px;\
                             height:' + self.h + 'px;');
        snapDrag(self);
        self.setInfos();
    }

    setHandlers() {
        var self = this;

        self.el.addEventListener("click", (e) => { e.stopPropagation() });
        self.el.addEventListener("mousedown", (e) => { onTouchStart(e, self) });
        self.el.addEventListener("touchstart", (e) => { onTouchStart(e, self) });
    }

    setInfos() {
        var self = this;

        let infos = {
            posX: Math.round(self.x / (self.container.w / self.container.size[0])),
            posY: Math.round(self.y / (self.container.h / self.container.size[1])),
            sizeX: Math.round(self.w / (self.container.w / self.container.size[0])),
            sizeY: Math.round(self.h / (self.container.h / self.container.size[1])),
            resizable: self.resizable
        };

        self.el.setAttribute('data-widgetinfos', JSON.stringify(infos));
    }
}

export default MCWidget