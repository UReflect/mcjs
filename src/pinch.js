export function onPinchStart(e, container) {
    container.pinch = true;
    container.pinchOpt.startdif = Math.abs(e.touches[0].pageX - e.touches[1].pageX) +
                                  Math.abs(e.touches[0].pageY - e.touches[1].pageY);
}

export function onPinchMove(e, container) {
    if (container.pinch)
        container.pinchOpt.prevdif = Math.abs(e.touches[0].pageX - e.touches[1].pageX) +
                                     Math.abs(e.touches[0].pageY - e.touches[1].pageY);
}

export function onPinchEnd(e, func, container) {
    if (container.pinch && func) {

        container.pinch = false;

        if (container.pinchOpt.prevdif > container.pinchOpt.startdif)
            func(container, 'out');
        else if (container.pinchOpt.prevdif < container.pinchOpt.startdif)
            func(container, 'in');
    }
}