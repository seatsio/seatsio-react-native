import { WebView } from 'react-native-webview'
import * as React from 'react'
import Chart from './chart'
import Deferred from './deferred'
import { randomUuid } from './util'
import SeatsioObject, { ObjectData } from './seatsioObject'
import { ChartRendererConfigOptions, ConfigChange, Region, SeatingChart } from '@seatsio/seatsio-types'

type SeatingChartProps = Omit<ChartRendererConfigOptions,
    'onChartRenderingStarted' |
    'onChartRenderingFailed' |
    'onChartRendered' |
    'objectColor' |
    'sectionColor' |
    'objectLabel' |
    'objectIcon' |
    'isObjectVisible' |
    'canGASelectionBeIncreased' |
    'objectCategory'
> & {
    chartJsUrl?: string
    region: Region
    onChartRenderingStarted?: (chart: ReactNativeSeatingChart) => void
    onChartRenderingFailed?: (chart: ReactNativeSeatingChart) => void
    onChartRendered?: (chart: ReactNativeSeatingChart) => void
    objectColor?: string
    sectionColor?: string
    objectLabel?: string
    objectIcon?: string
    isObjectVisible?: string
    canGASelectionBeIncreased?: string
    objectCategory?: string
    onPlacesPrompt?: (
        parameters: any,
        confirmSelection: (places: number) => void
    ) => void
    onTicketTypePrompt?: (
        parameters: any,
        confirmSelection: (ticketType: string) => void
    ) => void
    onPlacesWithTicketTypesPrompt?: (
        parameters: any,
        confirmSelection: (args: any) => void
    ) => void
}

export type ReactNativeSeatingChart = Omit<SeatingChart, 'holdToken' | 'changeConfig'
> & {
    getHoldToken: () => Promise<string>
    changeConfig: (config: ReactNativeConfigChange) => Promise<void>
}

export type ReactNativeConfigChange = Omit<ConfigChange, 'objectLabel' | 'objectColor'
> & {
    objectColor?: string
    objectLabel?: string
}

export type TransformerFunction = (o: ObjectData) => SeatsioObject
export type JavaScriptInjectorFunction = (js: string, transformer?: TransformerFunction) => Deferred


export class SeatsioSeatingChart extends React.Component<SeatingChartProps> {
    private divId: string
    private promises: Record<string, Deferred>
    private webRef?: WebView | null

    constructor (props: SeatingChartProps) {
        super(props)
        this.divId = 'chart'
        this.promises = {}
    }

    async componentDidUpdate (prevProps: SeatingChartProps) {
        if (this.didPropsChange(this.props, prevProps)) {
            this.destroyChart()
            this.rerenderChart()
        }
    }

    private getChartJsUrl () {
        return (this.props.chartJsUrl || 'https://cdn-{region}.seatsio.net/chart.js').replace('{region}', this.props.region)
    }

    rerenderChart () {
        this.injectJs(
            `chart = new seatsio.SeatingChart(${this.configAsString()}).render();`
        )
    }

    destroyChart () {
        this.injectJs('chart.destroy();')
    }

    injectJs (js: string) {
        this.webRef?.injectJavaScript(js + '; true;')
    }

    injectJsAndReturnDeferredFn (js: string, transformer?: TransformerFunction) {
        const deferred = new Deferred(transformer)
        const uuid = randomUuid()
        this.registerPromise(uuid, deferred)
        this.injectJs(js + `
            .then((o) => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: "${uuid}",
                    promiseResult: "resolve",
                    data: o
                }))
            })
            .catch((e) => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: "${uuid}",
                    promiseResult: "reject",
                    data: e
                }))
            })
        `)
        return deferred
    }

    registerPromise (name: string, promise: Deferred) {
        this.promises[name] = promise
    }

    didPropsChange (prevProps: SeatingChartProps, nextProps: SeatingChartProps) {
        if (Object.keys(prevProps).length !== Object.keys(nextProps).length) {
            return true
        }

        const configKeys: (keyof SeatingChartProps)[] = Object.keys(nextProps) as (keyof SeatingChartProps)[]
        return configKeys.some((propName): boolean => {
            const prevValue = prevProps[propName]
            const nextValue = nextProps[propName]
            if (prevValue && nextValue) {
                if (typeof prevValue === 'function' && typeof nextValue === 'function') {
                    return prevValue.toString() !== nextValue.toString()
                }
                if (typeof prevValue === 'object' && typeof nextValue === 'object') {
                    return this.didPropsChange(prevValue, nextValue)
                }
            }
            return prevValue !== nextValue
        })
    }

    render () {
        return (
            <WebView
                ref={r => { this.webRef = r }}
                originWhitelist={['*']}
                source={{ html: this.html() }}
                injectedJavaScriptBeforeContentLoaded={this.pipeConsoleLog()}
                onMessage={this.handleMessage.bind(this)}
                style={{ backgroundColor: 'transparent' }}
            />
        )
    }

    handleMessage (event: any) {
        const message = JSON.parse(event.nativeEvent.data)
        if (message.type === 'log') {
            console.log(message.data)
        } else if (message.type === 'onChartRendered') {
            this.props.onChartRendered?.(new Chart(message.data.chart, this.injectJsAndReturnDeferredFn.bind(this)) as any)
        } else if (message.type === 'onObjectClicked') {
            this.props.onObjectClicked?.(new SeatsioObject(message.data.object, this.injectJsAndReturnDeferredFn.bind(this)) as any)
        } else if (message.type === 'onObjectSelected') {
            this.props.onObjectSelected?.(new SeatsioObject(message.data.object, this.injectJsAndReturnDeferredFn.bind(this)) as any, message.data.selectedTicketType)
        } else if (message.type === 'onObjectDeselected') {
            this.props.onObjectDeselected?.(new SeatsioObject(message.data.object, this.injectJsAndReturnDeferredFn.bind(this)) as any, message.data.deselectedTicketType)
        } else if (message.type === 'onSelectedObjectBooked') {
            this.props.onSelectedObjectBooked?.(new SeatsioObject(message.data.object, this.injectJsAndReturnDeferredFn.bind(this)) as any)
        } else if (message.type === 'onSessionInitialized') {
            this.props.onSessionInitialized?.(message.data.holdToken)
        } else if (message.type === 'onHoldSucceeded') {
            this.props.onHoldSucceeded?.(message.data.objects, message.data.ticketTypes)
        } else if (message.type === 'onHoldFailed') {
            this.props.onHoldFailed?.(message.data.objects, message.data.ticketTypes)
        } else if (message.type === 'onHoldTokenExpired') {
            this.props.onHoldTokenExpired?.()
        } else if (message.type === 'onReleaseHoldSucceeded') {
            this.props.onReleaseHoldSucceeded?.(message.data.objects, message.data.ticketTypes)
        } else if (message.type === 'onReleaseHoldFailed') {
            this.props.onReleaseHoldFailed?.(message.data.objects, message.data.ticketTypes)
        } else if (message.type === 'onSelectionValid') {
            this.props.onSelectionValid?.()
        } else if (message.type === 'onSelectionInvalid') {
            this.props.onSelectionInvalid?.(message.data.violations)
        } else if (message.type === 'onHoldCallsInProgress') {
            this.props.onHoldCallsInProgress?.()
        } else if (message.type === 'onHoldCallsComplete') {
            this.props.onHoldCallsComplete?.()
        } else if (message.type === 'onFullScreenOpened') {
            this.props.onFullScreenOpened?.()
        } else if (message.type === 'onFullScreenClosed') {
            this.props.onFullScreenClosed?.()
        } else if (message.type === 'onFilteredCategoriesChanged') {
            this.props.onFilteredCategoriesChanged?.(message.data.categories)
        } else if (message.type === 'priceFormatterRequested') {
            const formattedPrice = this.props.priceFormatter?.(message.data.price)
            if (formattedPrice) {
                this.injectJs(
                    `resolvePromise(${message.data.promiseId}, "${formattedPrice}")`
                )
            }
        } else if (message.type === 'tooltipInfoRequested') {
            const tooltipInfo = this.props.tooltipInfo?.(message.data.object)
            this.injectJs(
                `resolvePromise(${message.data.promiseId}, "${tooltipInfo}")`
            )
        } else if (message.type === 'onPlacesPromptRequested') {
            this.props.onPlacesPrompt?.(
                message.data.parameters,
                (places: number) => {
                    this.injectJs(
                        `promises[${message.data.promiseId}](${places}); delete promises[${message.data.promiseId}];`
                    )
                }
            )
        } else if (message.type === 'onTicketTypePromptRequested') {
            this.props.onTicketTypePrompt?.(
                message.data.parameters,
                (ticketType: string) => {
                    this.injectJs(
                        `promises[${message.data.promiseId}]("${ticketType}"); delete promises[${message.data.promiseId}];`
                    )
                }
            )
        } else if (message.type === 'onPlacesWithTicketTypesPromptRequested') {
            this.props.onPlacesWithTicketTypesPrompt?.(
                message.data.parameters,
                (ticketTypes: any) => {
                    const argsAsString = JSON.stringify(ticketTypes)
                    this.injectJs(
                        `promises[${message.data.promiseId}](${argsAsString}); delete promises[${message.data.promiseId}];`
                    )
                }
            )
        } else {
            const promise = this.promises[message.type]
            if (promise !== undefined) {
                if (message.promiseResult === 'resolve') {
                    promise.resolve?.(message.data)
                } else {
                    promise.reject?.(message.data)
                }
            }
        }
    }

    html () {
        return `
            <html lang="en">
            <head>
                <title>seating chart</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <script src="${this.getChartJsUrl()}"></script>
            </head>
            <body style="margin: 0; padding: 0;">
                <div id="${this.divId}" style="width: 100%; height: 100%;"></div>
                <script>
                    let promises = [];
                    let promiseCounter = 0;

                    const resolvePromise = (promiseId, data) => {
                        promises[promiseId](data)
                    }
                    
                    let chart = new seatsio.SeatingChart(${this.configAsString()}).render();
                    
                    const getHoldToken = () => {
                        return Promise.resolve(chart.holdToken)
                    }
                    
                </script>
            </body>
            </html>
        `
    }

    registerPostMessage (event: string, callbackParams: string[]) {
        const data = callbackParams.map(param => param + ': ' + param).join(', ')
        return `
                , "${event}": (${callbackParams.join(', ')}) => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: "${event}",
                        data: {
                            ${data}
                        }
                    }))
                }
            `
    }

    configAsString () {
        const {
            onChartRendered,
            onObjectClicked,
            onObjectSelected,
            onObjectDeselected,
            onSelectedObjectBooked,
            onSessionInitialized,
            onHoldSucceeded,
            onHoldFailed,
            onHoldTokenExpired,
            onReleaseHoldSucceeded,
            onReleaseHoldFailed,
            onSelectionValid,
            onSelectionInvalid,
            onHoldCallsInProgress,
            onHoldCallsComplete,
            onFullScreenOpened,
            onFullScreenClosed,
            onFilteredCategoriesChanged,
            priceFormatter,
            tooltipInfo,
            objectColor,
            sectionColor,
            objectLabel,
            objectIcon,
            isObjectVisible,
            canGASelectionBeIncreased,
            objectCategory,
            onPlacesPrompt,
            onTicketTypePrompt,
            onPlacesWithTicketTypesPrompt,
            ...config
        } = this.props
        config.divId = this.divId
        let configString = JSON.stringify(config).slice(0, -1)
        if (onChartRendered) {
            configString += this.registerPostMessage('onChartRendered', ['chart'])
        }
        if (onObjectClicked) {
            configString += this.registerPostMessage('onObjectClicked', ['object'])
        }
        if (onObjectSelected) {
            configString += this.registerPostMessage('onObjectSelected', ['object', 'selectedTicketType'])
        }
        if (onObjectDeselected) {
            configString += this.registerPostMessage('onObjectDeselected', ['object', 'deselectedTicketType'])
        }
        if (onSelectedObjectBooked) {
            configString += this.registerPostMessage('onSelectedObjectBooked', ['object'])
        }
        if (onSessionInitialized) {
            configString += this.registerPostMessage('onSessionInitialized', ['holdToken'])
        }
        if (onHoldSucceeded) {
            configString += this.registerPostMessage('onHoldSucceeded', ['objects', 'ticketTypes'])
        }
        if (onHoldFailed) {
            configString += this.registerPostMessage('onHoldFailed', ['objects', 'ticketTypes'])
        }
        if (onHoldTokenExpired) {
            configString += this.registerPostMessage('onHoldTokenExpired', [])
        }
        if (onReleaseHoldSucceeded) {
            configString += this.registerPostMessage('onReleaseHoldSucceeded', ['objects', 'ticketTypes'])
        }
        if (onReleaseHoldFailed) {
            configString += this.registerPostMessage('onReleaseHoldFailed', ['objects', 'ticketTypes'])
        }
        if (onSelectionValid) {
            configString += this.registerPostMessage('onSelectionValid', [])
        }
        if (onSelectionInvalid) {
            configString += this.registerPostMessage('onSelectionInvalid', [])
        }
        if (onHoldCallsInProgress) {
            configString += this.registerPostMessage('onHoldCallsInProgress', [])
        }
        if (onHoldCallsComplete) {
            configString += this.registerPostMessage('onHoldCallsComplete', [])
        }
        if (onFullScreenOpened) {
            configString += this.registerPostMessage('onFullScreenOpened', [])
        }
        if (onFullScreenClosed) {
            configString += this.registerPostMessage('onFullScreenClosed', [])
        }
        if (onFilteredCategoriesChanged) {
            configString += this.registerPostMessage('onFilteredCategoriesChanged', ['categories'])
        }
        if (priceFormatter) {
            configString += `
                , "priceFormatter": (price) => {
                    promiseCounter++;
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: "priceFormatterRequested",
                        data: {
                            promiseId: promiseCounter,
                            price: price
                        }
                    }));
                    return new Promise((resolve) => {
                        promises[promiseCounter] = resolve;
                    });
                }
            `
        }
        if (tooltipInfo) {
            configString += `
                , "tooltipInfo": (object) => {
                    promiseCounter++;
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: "tooltipInfoRequested",
                        data: {
                            promiseId: promiseCounter,
                            object: object
                        }
                    }));
                    return new Promise((resolve) => {
                        promises[promiseCounter] = resolve;
                    });
                }
            `
        }
        if (objectColor) {
            configString += ', "objectColor": ' + objectColor
        }
        if (sectionColor) {
            configString += ', "sectionColor": ' + sectionColor
        }
        if (objectLabel) {
            configString += ', "objectLabel": ' + objectLabel
        }
        if (objectIcon) {
            configString += ', "objectIcon": ' + objectIcon
        }
        if (isObjectVisible) {
            configString += ', "isObjectVisible": ' + isObjectVisible
        }
        if (canGASelectionBeIncreased) {
            configString += ', "canGASelectionBeIncreased": ' + canGASelectionBeIncreased
        }
        if (objectCategory) {
            configString += ', "objectCategory": ' + objectCategory
        }
        if (onPlacesPrompt) {
            configString += `
                , "onPlacesPrompt": (parameters, confirmSelection) => {
                    promiseCounter++;
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: "onPlacesPromptRequested",
                        data: {
                            promiseId: promiseCounter,
                            parameters: parameters
                        }
                    }));
                    promises[promiseCounter] = confirmSelection;
                }
            `
        }
        if (onTicketTypePrompt) {
            configString += `
                , "onTicketTypePrompt": (parameters, confirmSelection) => {
                    promiseCounter++;
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: "onTicketTypePromptRequested",
                        data: {
                            promiseId: promiseCounter,
                            parameters: parameters
                        }
                    }));
                    promises[promiseCounter] = confirmSelection;
                }
            `
        }
        if (onPlacesWithTicketTypesPrompt) {
            configString += `
                   , "onPlacesWithTicketTypesPrompt": (parameters, confirmSelection) => {
                      promiseCounter++;
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: "onPlacesWithTicketTypesPromptRequested",
                        data: {
                          promiseId: promiseCounter,
                          parameters: parameters
                        }
                      }));
                      promises[promiseCounter] = confirmSelection;
                    }
            `
        }
        configString += '}'
        return configString
    }

    pipeConsoleLog () {
        return `
            console = new Object();
            console.log = function(log) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: "log",
                    data: log
                }));
            };
            console.debug = console.log;
            console.info = console.log;
            console.warn = console.log;
            console.error = console.log;
        `
    }
}

export default SeatsioSeatingChart
