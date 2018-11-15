import { onTouchStart } from "./movements";
import { snapDrag } from "./positionCalc";

class MCWidget {
    constructor(element, light=true, container=null) {

        this.container = container;
        this.el = element;
        this.light = light;

        this.minWidth = 0;
        this.minHeight = 0;

        this.infos =

        this.drag = false;
        this.resize = false;

        this.prevx = 0;
        this.prevy = 0;

        this.initPos = {x: 0, y: 0, w: 0, h: 0}

        this.presstimer = null;

        this.vmouseStart = this.mouseStart.bind(this);
        this.vtouchStart = this.touchStart.bind(this);

        this.setHandlers();

        if (!this.light)
            this.setupHeavy();
        else
            this.setupLight();
    }

    setInitPos() {
      this.initPos.x = this.x;
      this.initPos.y = this.y;
      this.initPos.w = this.w;
      this.initPos.h = this.h;
    }

    resetPos() {
      this.x = this.initPos.x
      this.y = this.initPos.y
      this.w = this.initPos.w
      this.h = this.initPos.h

      this.el.style.left = this.x + 'px';
      this.el.style.top = this.y + 'px';
      this.el.style.width = this.w + 'px';
      this.el.style.height = this.h + 'px';
    }

    setupLight() {

        this.x = this.el.getBoundingClientRect().left;
        this.y = this.el.getBoundingClientRect().top;
        this.w = this.el.offsetWidth;
        this.h = this.el.offsetHeight;
    }

    setupHeavy() {
        let widgetInfos = JSON.parse(this.el.getAttribute('data-widget-infos'));

        this.x = (this.container.w / this.container.size[0]) * widgetInfos.posX + 0.5;
        this.y = (this.container.h / this.container.size[1]) * widgetInfos.posY + 0.5;
        this.w = (this.container.w / this.container.size[0]) * widgetInfos.sizeX - 1;
        this.h = (this.container.h / this.container.size[1]) * widgetInfos.sizeY - 1;

        this.resizable = widgetInfos.resizable;
        this.resizeOpt = {right: false, left: false, top: false, bot: false, x: 0, y: 0, w: 0, h: 0, sx: 0, sy: 0};

        let minX = widgetInfos.minX ? widgetInfos.minX : 1;
        let minY = widgetInfos.minY ? widgetInfos.minY : 1;

        this.minWidth = ((this.container.w / this.container.size[0]) * minX) - 0.5;
        this.minHeight = ((this.container.h / this.container.size[1]) * minY) - 0.5;

        this.infos = {
            posX: Math.round(this.x / (this.container.w / this.container.size[0])),
            posY: Math.round(this.y / (this.container.h / this.container.size[1])),
            sizeX: Math.round(this.w / (this.container.w / this.container.size[0])),
            sizeY: Math.round(this.h / (this.container.h / this.container.size[1])),
            minX: minX,
            minY: minY,
            resizable: this.resizable
        };

        this.place();

        for (let x = this.infos.posX; x < this.infos.posX + this.infos.sizeX; x++)
          for (let y = this.infos.posY; y < this.infos.posY + this.infos.sizeY; y++) {
            this.container.grid2[y][x] = 1;
          }
    }

    place() {
        this.el.setAttribute('style',
                             'position:absolute;\
                             left:' + this.x + 'px;\
                             top:' + this.y + 'px;\
                             width:' + this.w + 'px;\
                             height:' + this.h + 'px;');
        snapDrag(this);

        this.setInfos();
    }

    stopPropag(e) {
        e.stopPropagation();
    }

    mouseStart(e) {
        onTouchStart(e, this);
    }

    touchStart(e) {
        onTouchStart(e, this);
    }

    setHandlers() {
        this.el.addEventListener("click", this.stopPropag);
        this.el.addEventListener("mousedown", this.vmouseStart);
        this.el.addEventListener("touchstart", this.vtouchStart);
    }

    setInfos() {
        this.infos = {
            posX: Math.round(this.x / (this.container.w / this.container.size[0])),
            posY: Math.round(this.y / (this.container.h / this.container.size[1])),
            sizeX: Math.round(this.w / (this.container.w / this.container.size[0])),
            sizeY: Math.round(this.h / (this.container.h / this.container.size[1])),
            minX: this.infos.minX,
            minY: this.infos.minY,
            resizable: this.resizable
        };

        this.el.setAttribute('data-widget-infos', JSON.stringify(this.infos));
    }
}

export default MCWidget