import { ChartRendererConfigOptions } from "@seatsio/seatsio-types";
import SeatsioObject from "./seatsioObject";
import { JavaScriptInjectorFunction } from "./SeatsioSeatingChart";

export default class Chart {
    private data: any
    private injectJsAndReturnDeferredFn: JavaScriptInjectorFunction

    constructor(data: any, injectJsAndReturnDeferredFn: JavaScriptInjectorFunction) {
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

    selectObjects(objects: SeatsioObject[]) {
        return this.injectJsAndReturnDeferredFn(`chart.selectObjects(${JSON.stringify(objects)})`)
    }

    deselectObjects(objects: SeatsioObject[]) {
        return this.injectJsAndReturnDeferredFn(`chart.deselectObjects(${JSON.stringify(objects)})`)
    }

    selectCategories(categories: string[]) {
        return this.injectJsAndReturnDeferredFn(`chart.selectCategories(${JSON.stringify(categories)})`)
    }

    deselectCategories(categories: string[]) {
        return this.injectJsAndReturnDeferredFn(`chart.deselectCategories(${JSON.stringify(categories)})`)
    }

    // TODO: Serialzed config type?
    changeConfig(newConfig: any) {
        if (newConfig.objectColor) {
            newConfig.objectColor = newConfig.objectColor.toString()
        }
        if (newConfig.objectLabel) {
            newConfig.objectLabel = newConfig.objectLabel.toString()
        }
        return this.injectJsAndReturnDeferredFn('chart.changeConfig(' + JSON.stringify(newConfig) + ')')
    }

    findObject(label: string) {
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

    zoomToSection(section: string) {
        return this.injectJsAndReturnDeferredFn('chart.zoomToSection(' + JSON.stringify(section) + ')')
    }

    getReportBySelectability() {
        return this.injectJsAndReturnDeferredFn(`chart.getReportBySelectability()`)
    }
}
