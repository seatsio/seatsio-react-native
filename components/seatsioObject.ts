import { InteractiveObject, SeatingChart } from "@seatsio/seatsio-types"
import Deferred from "./deferred"
import { JavaScriptInjectorFunction } from "./SeatsioSeatingChart"

interface ObjectData {
    category: string
    center: any
    chart: SeatingChart
    dataPerEvent: any
    disabledBySocialDistancingRules: boolean
    forSale: boolean
    id: string
    inSelectableChannel: boolean
    isOrphan: boolean
    label: string
    objectType: string
    labels: InteractiveObject['labels']
    parent: any
    seatId: string
    selectable: boolean
    selected: boolean
    status: string
    uuid: string
}

export default class SeatsioObject {
    public category: string
    public center: any
    public chart: SeatingChart
    public dataPerEvent: any
    public disabledBySocialDistancingRules: boolean
    public forSale: boolean
    public id: string
    public inSelectableChannel: boolean
    public isOrphan: boolean
    public label: string
    public objectType: string
    public labels: InteractiveObject['labels']
    public parent: any
    public seatId: string
    public selectable: boolean
    public selected: boolean
    public status: string
    public uuid: string

    private injectJsFn: JavaScriptInjectorFunction

    constructor(data: ObjectData, injectJsFn: JavaScriptInjectorFunction) {
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

    async isInChannel(channelKey: string) {
        return this.injectJsFn(`chart.findObject(${JSON.stringify(this.id)}).then(o => o.isInChannel(${JSON.stringify(channelKey)}))`)
    }

    async select(ticketType: string) {
        return this.injectJsFn(`chart.findObject(${JSON.stringify(this.id)}).then(o => o.select(${JSON.stringify(ticketType)}))`)
    }

    async deselect(ticketType: string) {
        return this.injectJsFn(`chart.findObject(${JSON.stringify(this.id)}).then(o => o.deselect(${JSON.stringify(ticketType)}))`)
    }

    async pulse() {
        return this.injectJsFn(`chart.findObject(${JSON.stringify(this.id)}).then(o => o.pulse())`)
    }

    async unpulse() {
        return this.injectJsFn(`chart.findObject(${JSON.stringify(this.id)}).then(o => o.unpulse())`)
    }


}
