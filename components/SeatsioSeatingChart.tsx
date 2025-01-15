import {WebView} from 'react-native-webview';
import React from 'react';
import Chart from "./chart";
import Deferred from "./deferred";
import {randomUuid} from "./util";
import SeatsioObject from "./seatsioObject";
import { ChartRendererConfigOptions, Region } from '@seatsio/seatsio-types'

type SeatingChartProps = ChartRendererConfigOptions & {
    chartJsUrl?: string
    region: Region
}

// Check type for o parameter
export type JavaScriptInjectorFunction = (js: string, transformer?: (o: any) => any) => Deferred

class SeatsioSeatingChart extends React.Component<SeatingChartProps, {}> {
    private divId: string
    private promises: { [key: string]: Deferred }
    // TODO: Fix ref type
    private webRef?: any

    constructor(props: SeatingChartProps) {
        super(props);
        this.divId = 'chart';
        this.promises = {}
    }

    async componentDidUpdate(prevProps: SeatingChartProps) {
        if (this.didPropsChange(this.props, prevProps)) {
            this.destroyChart();
            this.rerenderChart();
        }
    }

    private getChartJsUrl() {
        return (this.props.chartJsUrl || 'https://cdn-{region}.seatsio.net/chart.js').replace('{region}', this.props.region)
    }

    rerenderChart() {
        this.injectJs(
            `chart = new seatsio.SeatingChart(${this.configAsString()}).render();`
        );
    }

    destroyChart() {
        this.injectJs('chart.destroy();');
    }

    injectJs(js: string) {
        this.webRef?.injectJavaScript(js + '; true;');
    }

    injectJsAndReturnDeferredFn(js: string, transformer?: (o: any) => any) {
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

    registerPromise<T>(name: string, promise: Deferred) {
        this.promises[name] = promise
    }

    didPropsChange(prevProps: SeatingChartProps, nextProps: SeatingChartProps) {
        if (Object.keys(prevProps).length !== Object.keys(nextProps).length) {
            return true;
        }

        const configKeys: (keyof SeatingChartProps)[] = Object.keys(nextProps) as (keyof SeatingChartProps)[]
        return configKeys.some((propName): boolean => {
            let prevValue = prevProps[propName];
            let nextValue = nextProps[propName];
            if (prevValue && nextValue) {
                if (typeof prevValue === 'function' && typeof nextValue === 'function') {
                    return prevValue.toString() !== nextValue.toString();
                }
                if (typeof prevValue === 'object' && typeof nextValue === 'object') {
                    return this.didPropsChange(prevValue, nextValue);
                }
            }
            return prevValue !== nextValue;
        });
    }

    render() {
        return (
            <WebView
                ref={r => (this.webRef = r) as any}
                originWhitelist={['*']}
                source={{html: this.html()}}
                injectedJavaScriptBeforeContentLoaded={this.pipeConsoleLog()}
                onMessage={this.handleMessage.bind(this)}
                style={{ backgroundColor: 'transparent' }}
            />
        );
    }

    handleMessage(event: any) {
        let message = JSON.parse(event.nativeEvent.data);
        if (message.type === 'log') {
            console.log(message.data);
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
            // FIXME: What should the property on message.data be?
            this.props.onSelectionInvalid?.(message.data.violations)
        } else if (message.type === 'onFullScreenOpened') {
            this.props.onFullScreenOpened?.()
        } else if (message.type === 'onFullScreenClosed') {
            this.props.onFullScreenClosed?.()
        } else if (message.type === 'onFilteredCategoriesChanged') {
            this.props.onFilteredCategoriesChanged?.(message.data.categories)
        } else if (message.type === 'priceFormatterRequested') {
            let formattedPrice = this.props.priceFormatter?.(message.data.price)
            formattedPrice && this.injectJs(
                `resolvePromise(${message.data.promiseId}, "${formattedPrice}")`
            );
        } else if (message.type === 'tooltipInfoRequested') {
            let tooltipInfo = this.props.tooltipInfo?.(message.data.object)
            this.injectJs(
                `resolvePromise(${message.data.promiseId}, "${tooltipInfo}")`
            );
        } else {
            let promise = this.promises[message.type];
            if (promise !== undefined) {
                if (message.promiseResult === 'resolve') {
                    promise.resolve?.(message.data)
                } else {
                    promise.reject?.(message.data)
                }
            }
        }
    }

    html() {
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
        `;
    }

    registerPostMessage(event: any, callbackParams: any) {
        const data = callbackParams.map((param: any) => param + ': ' + param).join(', ')
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

    configAsString() {
        let {
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
            ...config
        } = this.props;
        config.divId = this.divId;
        let configString = JSON.stringify(config).slice(0, -1);
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
            `;
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
            `;
        }
        if (objectColor) {
            configString += `
                , "objectColor": (obj, defaultColor, extraConfig) => {
                        ${objectColor.toString()}
                        return objectColor(obj, defaultColor, extraConfig);
                }
            `;
        }
        if (sectionColor) {
            configString += `
                , "sectionColor": (section, defaultColor, extraConfig) => {
                        ${sectionColor.toString()}
                        return sectionColor(section, defaultColor, extraConfig);
                }
            `;
        }
        if (objectLabel) {
            configString += `
                , "objectLabel": (object, defaultLabel, extraConfig) => {
                        ${objectLabel.toString()}
                        return objectLabel(object, defaultLabel, extraConfig);
                }
            `;
        }
        if (objectIcon) {
            configString += `
                , "objectIcon": (object, defaultIcon, extraConfig) => {
                        ${objectIcon.toString()}
                        return objectIcon(object, defaultIcon, extraConfig);
                }
            `;
        }
        if (isObjectVisible) {
            configString += `
                , "isObjectVisible": (object, extraConfig) => {
                        ${isObjectVisible.toString()}
                        return isObjectVisible(object, extraConfig);
                }
            `;
        }
        if (canGASelectionBeIncreased) {
            configString += `
                , "canGASelectionBeIncreased": (gaArea, defaultValue, extraConfig, ticketType) => {
                        ${canGASelectionBeIncreased.toString()}
                        return canGASelectionBeIncreased(gaArea, defaultValue, extraConfig, ticketType);
                }
            `;
        }
        if (objectCategory) {
            configString += `
                , "objectCategory": (object, categories, defaultCategory, extraConfig) => {
                        ${objectCategory.toString()}
                        return objectCategory(object, categories, defaultCategory, extraConfig);
                }
            `;
        }
        configString += '}';
        return configString;
    }

    pipeConsoleLog() {
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
        `;
    }
}

export default SeatsioSeatingChart;
