var mcsolar = new MC.MC("widgetContainer", ".widget", [19, 10], false, true);

var container = document.getElementById('widgetContainer');
var elemWidgets = document.getElementById('add-widgets');
var list = [];
var curWidget = {curWidget: null};

function endDrag(e, widget) {
    var contx = container.getBoundingClientRect().left;
    var conty = container.getBoundingClientRect().top;
    var contw = container.offsetWidth * 0.65;
    var conth = container.offsetHeight * 0.65;

    var pageX = e.touches ? widget.prevx : e.pageX;
    var pageY = e.touches ? widget.prevy : e.pageY;

    if (pageX > contx && pageX < contx + contw &&
        pageY > conty && pageY < conty + conth) {
        // TODO: Add real module here
        var node = document.createElement("div");
        var nodeStr = "<div class='widget' data-widget-infos='{\"posX\": 2, \"posY\": 2, \"sizeX\": 3, \"sizeY\": 3, \"resizable\": true}'>"
                        + "<span>Item 4</span></div>";
        node.innerHTML = nodeStr;
        container.appendChild(node.firstChild);

        mcsolar.setWidgets()
    }

    widget.el.parentNode.removeChild(widget.el);
    setWidgets();

    curWidget.curWidget = null
}

function setWidgets() {
    list = [];
    document.querySelectorAll('.widget-item').forEach(function(el) {
        var new_el = el.cloneNode(true);
        el.parentNode.replaceChild(new_el, el);
        list.push(new MC.MCWidget(new_el, true, curWidget));
    })
}

mcsolar.onPinch(function(e, type) {
    var inside = type === 'in';
    console.log('Pinch ' + type + ' !');

    if (!container || !elemWidgets) {
        return
    }

    container.style.border = inside ? '1px solid #FFF' : 'none';
    container.style.transform = inside ? 'scale(0.65)' : 'scale(1.0)';

    elemWidgets.style.transition = inside ? 'all 5s' : 'all 1s';
    elemWidgets.style.opacity = inside ? '1' : '0';

    setWidgets(list, curWidget);

    document.addEventListener('mousemove', (e) => { MC.onTouchMove(e, curWidget.curWidget) });
    document.addEventListener('touchmove', (e) => { MC.onTouchMove(e, curWidget.curWidget) });

    document.addEventListener("mouseup", (e) => { MC.onTouchEnd(e, curWidget.curWidget, endDrag) });
    document.addEventListener("touchend", (e) => { MC.onTouchEnd(e, curWidget.curWidget, endDrag) });
});

mcsolar.trashFunc = () => {
  console.log('TRASH FUNC');
};