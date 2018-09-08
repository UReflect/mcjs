import MCWidget from "./MCWidget"
import { onTouchEnd, onTouchMove } from "./movements"
import { onPinchStart, onPinchMove, onPinchEnd } from "./pinch"

class MC {
    constructor(container='widgetContainer', selector='.widget', size=[19, 10],
                inertia=true, trash=false, debug=false) {
        this.container = document.getElementById(container);
        this.selector = selector;
        this.size = size;
        this.inertia = inertia;
        this.debug = debug;

        this.trash = trash;
        this.trashEl = null;
        this.trashFunc = null;

        this.w = this.container.offsetWidth;
        this.h = this.container.offsetHeight;

        this.pinch = false;
        this.pinched = false;
        this.pinchOpt = {startdif: 0, prevdif: 0};
        this.pinchFunc = null;

        this.isEditMode = false;
        this.editTimer = 1000;

        this.curWidget = null;
        this.widgets = [];
        this.grid = [];

        for (let y = 0; y < this.h; y += (this.h / this.size[1]))
            for (let x = 0; x < this.w; x += (this.w / this.size[0]))
                this.grid.push([x + 0.5, y + 0.5]);

        this.init();
    }

    init() {
        var self = this;

        self.setGlobalHandlers();

        self.setWidgets();

        if (self.debug)
            this.showDebug();

        if (self.trash)
            this.createTrash();
    }

    setWidgets() {
        var self = this;

        self.editModeOff();

        self.widgets = [];
        document.querySelectorAll(self.selector).forEach((el) => {
            var new_el = el.cloneNode(true);
            el.parentNode.replaceChild(new_el, el);
            self.widgets.push(new MCWidget(new_el, false, self));
        })
    }

    setGlobalHandlers() {
        var self = this;

        document.addEventListener('click', () => { self.editModeOff() });

        document.addEventListener('mousemove', (e) => { onTouchMove(e, self.curWidget) });
        document.addEventListener('touchmove', (e) => {
            e.touches.length === 1 ? onTouchMove(e, self.curWidget) : onPinchMove(e, self);
        });

        document.addEventListener("mouseup", (e) => { onTouchEnd(e, self.curWidget) });
        document.addEventListener("touchend", (e) => {
            onTouchEnd(e, self.curWidget);
            onPinchEnd(e, this.pinchFunc, self);
        });

        document.addEventListener('contextmenu', (e) => { e.preventDefault() });
    }

    onPinch(func) {
        var self = this;

        this.pinchFunc = func;

        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
                onPinchStart(e, self);
            }
        }, {passive: false});

        self.container.addEventListener('dblclick', (e) => {
            if (self.pinched) {
                func(self, 'out');
                self.pinched = false;
            }
            else {
                func(self, 'in');
                self.pinched = true;
            }
            self.setWidgets();
        });

        return self;
    }

    createDot(top, bot, left, right) {
        var dot = document.createElement('span');

        dot.classList.add('resize-dot');
        dot.style.position = 'absolute';
        dot.style.top = top;
        dot.style.bottom = bot;
        dot.style.left = left;
        dot.style.right = right;
        dot.style.height = '10px';
        dot.style.width = '10px';
        dot.style.backgroundColor = '#007bff';
        dot.style.borderRadius = '50%';
        dot.style.zIndex = '999';

        return dot;
    }

    editModeOn() {
        var self = this;

        self.widgets.forEach((wgt) => {
            wgt.el.style.boxSizing = "border-box";
            wgt.el.style.border = "1px solid #007bff";

            wgt.el.appendChild(this.createDot('calc(50% - 5px)', '', '-5px', ''));
            wgt.el.appendChild(this.createDot('calc(50% - 5px)', '', '', '-5px'));
            wgt.el.appendChild(this.createDot('-5px', '', 'calc(50% - 5px)', ''));
            wgt.el.appendChild(this.createDot('', '-5px', 'calc(50% - 5px)', ''));
        });
    }

    editModeOff() {
        var self = this;

        self.isEditMode = false;
        self.widgets.forEach((wgt) => {
            wgt.el.style.boxSizing = "";
            wgt.el.style.border = "";

            document.querySelectorAll('.resize-dot').forEach((el) => { el.remove() });
        });
    }

    showDebug() {
        var self = this;

        var canvas = document.createElement('canvas');
        canvas.width = self.w;
        canvas.height = self.h;

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

        context.strokeStyle = "white";
        context.stroke();
    }

    createTrash() {
        var self = this;

        let node = document.createElement("div");

        node.id = 'trash';
        node.style.display = 'none';
        node.style.zIndex = '999';
        node.style.position = 'absolute';
        node.style.width = '50px';
        node.style.height = '50px';
        node.style.backgroundColor = 'white';
        node.style.border = '1px solid #FFF';
        node.style.borderRadius = '50px';
        node.style.left = (this.w - 100) + 'px';
        node.style.top = (this.h - 100) + 'px';

        self.container.appendChild(node);
        self.trashEl = node;
    }
}

export default MC