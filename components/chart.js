import SeatsioObject from "./seatsioObject";

export default class Chart {

    constructor(data, injectJsAndReturnDeferredFn) {
        this.data = data
        this.injectJsAndReturnDeferredFn = injectJsAndReturnDeferredFn
    }

    getHoldToken() {
        return this.injectJsAndReturnDeferredFn(`getHoldToken()`)
    }

    resetView() {
        return this.injectJsAndReturnDeferredFn('chart.resetView()')
    }

    startNewSession() {
        return this.injectJsAndReturnDeferredFn('chart.startNewSession()')
    }

    listSelectedObjects() {
        return this.injectJsAndReturnDeferredFn(`chart.listSelectedObjects()`)
    }

    clearSelection() {
        return this.injectJsAndReturnDeferredFn('chart.clearSelection()')
    }

    selectObjects(objects) {
        return this.injectJsAndReturnDeferredFn(`chart.selectObjects(${JSON.stringify(objects)})`)
    }

    deselectObjects(objects) {
        return this.injectJsAndReturnDeferredFn(`chart.deselectObjects(${JSON.stringify(objects)})`)
    }

    selectCategories(categories) {
        return this.injectJsAndReturnDeferredFn(`chart.selectCategories(${JSON.stringify(categories)})`)
    }

    deselectCategories(categories) {
        return this.injectJsAndReturnDeferredFn(`chart.deselectCategories(${JSON.stringify(categories)})`)
    }

    changeConfig(newConfig) {
        if (newConfig.objectColor) {
            newConfig.objectColor = newConfig.objectColor.toString()
        }
        if (newConfig.objectLabel) {
            newConfig.objectLabel = newConfig.objectLabel.toString()
        }
        return this.injectJsAndReturnDeferredFn('chart.changeConfig(' + JSON.stringify(newConfig) + ')')
    }

    findObject(label) {
        return this.injectJsAndReturnDeferredFn(`chart.findObject(${JSON.stringify(label)})`, o => new SeatsioObject(o, this.injectJsAndReturnDeferredFn))
    }

    listCategories() {
        return this.injectJsAndReturnDeferredFn(`chart.listCategories()`)
    }

    zoomToSelectedObjects() {
        return this.injectJsAndReturnDeferredFn(`chart.zoomToSelectedObjects()`)
    }

    zoomToFilteredCategories() {
        return this.injectJsAndReturnDeferredFn(`chart.zoomToFilteredCategories()`)
    }


}
