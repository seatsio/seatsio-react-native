export default class SeatsioObject {

    constructor(data, injectJsFn) {
        this.category = data.category
        this.center = data.center
        this.chart = data.chart
        this.dataPerEvent = data.dataPerEvent
        this.disabledBySocialDistancingRules = data.disabledBySocialDistancingRules
        this.forSale = data.forSale
        this.id = data.id
        this.inSelectableChannel = data.inSelectableChannel
        this.isOrphan = data.isOrphan
        this.label = data.label
        this.labels = data.labels
        this.objectType = data.objectType
        this.parent = data.parent
        this.seatId = data.seatId
        this.selectable = data.selectable
        this.selected = data.selected
        this.status = data.status
        this.uuid = data.uuid

        this.injectJsFn = injectJsFn
    }

    async isInChannel(channelKey) {
        return this.injectJsFn(`chart.findObject(${JSON.stringify(this.id)}).then(o => o.isInChannel(${JSON.stringify(channelKey)}))`)
    }

    async select(ticketType) {
        return this.injectJsFn(`chart.findObject(${JSON.stringify(this.id)}).then(o => o.select(${JSON.stringify(ticketType)}))`)
    }

    async deselect(ticketType) {
        return this.injectJsFn(`chart.findObject(${JSON.stringify(this.id)}).then(o => o.deselect(${JSON.stringify(ticketType)}))`)
    }

    async pulse() {
        return this.injectJsFn(`chart.findObject(${JSON.stringify(this.id)}).then(o => o.pulse())`)
    }

    async unpulse() {
        return this.injectJsFn(`chart.findObject(${JSON.stringify(this.id)}).then(o => o.unpulse())`)
    }


}
