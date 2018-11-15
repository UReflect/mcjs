var mcsolar = new MC.MC("widgetContainer", ".widget", [19, 10], false, true, true);

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

    let scaledPageX = pageX - ((container.offsetWidth - container.getBoundingClientRect().width) / 2);
    let scaledPageY = pageY - ((container.offsetHeight - container.getBoundingClientRect().height) / 2);

    let newPosX = Math.min(18, Math.max(0, Math.round(scaledPageX / (contw / 19)) - 1));
    let newPosY = Math.min(9, Math.max(0, Math.round(scaledPageY / (conth / 10)) - 1));

    if (pageX > contx && pageX < contx + contw &&
        pageY > conty && pageY < conty + conth) {
        // TODO: Add real module here
        var node = document.createElement("div");
        console.log('ocuocu');
        var nodeStr = "<div class='widget' data-module='module-" + Math.floor(Math.random() * 10000) +
          "' data-widget-infos='{\"posX\": " + newPosX + ", \"posY\": " + newPosY + ", \"sizeX\": 3, \"sizeY\": 3, \"resizable\": true}'>"
                        + "<span>Item 4</span><button id=\"button-test-2\">Toto123</button></div>";
        node.innerHTML = nodeStr;

        if (mcsolar.gotEmptySpace(3, 3)) {
          container.appendChild(node.firstChild);
          mcsolar.setWidgets();
        }
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
    });
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

mcsolar.trashFunc = (wgt) => {
    console.log('delete');

    wgt.el.remove();
    wgt.container.setWidgets();
};

var buttonTest = document.getElementById('button-test');
buttonTest.addEventListener('click', (e) => {
    console.log('Click on button !');
});

var buttonTest2 = document.getElementById('button-test-2');
if (buttonTest2 != null) {
  buttonTest2.addEventListener('click', (e) => {
    console.log('Click on button !');
  });
}
