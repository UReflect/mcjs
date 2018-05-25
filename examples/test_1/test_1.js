var mcsolar = new MC("widgetContainer", ".widget", [19, 10], false, true)

mcsolar.onPinch(function(e, type) {
    console.log('Pinch ' + type + ' !')
})