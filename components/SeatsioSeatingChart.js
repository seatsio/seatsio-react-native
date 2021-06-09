import {WebView} from 'react-native-webview';
import React from 'react';
import PropTypes from 'prop-types';
import Chart from "./chart";
import Deferred from "./deferred";
import {randomUuid} from "./util";
import SeatsioObject from "./seatsioObject";

class SeatsioSeatingChart extends React.Component {
    constructor(props) {
        super(props);
        this.divId = 'chart';
        this.promises = {}
    }

    async componentDidUpdate(prevProps) {
        if (this.didPropsChange(this.props, prevProps)) {
            this.destroyChart();
            this.rerenderChart();
        }
    }

    rerenderChart() {
        this.injectJs(
            `chart = new seatsio.SeatingChart(${this.configAsString()}).render();`
        );
    }

    destroyChart() {
        this.injectJs('chart.destroy();');
    }

    injectJs(js) {
        this.webRef.injectJavaScript(js + '; true;');
    }

    injectJsAndReturnDeferredFn(js, transformer) {
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

    registerPromise(name, promise) {
        this.promises[name] = promise
    }

    didPropsChange(prevProps, nextProps) {
        if (Object.keys(prevProps).length !== Object.keys(nextProps).length) {
            return true;
        }
        return Object.keys(nextProps).some(propName => {
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
                ref={r => (this.webRef = r)}
                originWhitelist={['*']}
                source={{html: this.html()}}
                injectedJavaScriptBeforeContentLoaded={this.pipeConsoleLog()}
                onMessage={this.handleMessage.bind(this)}
            />
        );
    }

    handleMessage(event) {
        let message = JSON.parse(event.nativeEvent.data);
        if (message.type === 'log') {
            console.log(message.data);
        } else if (message.type === 'onChartRendered') {
            this.props.onChartRendered(new Chart(message.data.chart, this.injectJsAndReturnDeferredFn.bind(this)));
        } else if (message.type === 'onObjectClicked') {
            this.props.onObjectClicked(new SeatsioObject(message.data.object, this.injectJsAndReturnDeferredFn.bind(this)));
        } else if (message.type === 'onObjectSelected') {
            this.props.onObjectSelected(new SeatsioObject(message.data.object, this.injectJsAndReturnDeferredFn.bind(this)), message.data.selectedTicketType)
        } else if (message.type === 'onObjectDeselected') {
            this.props.onObjectDeselected(new SeatsioObject(message.data.object, this.injectJsAndReturnDeferredFn.bind(this)), message.data.deselectedTicketType)
        } else if (message.type === 'onSelectedObjectBooked') {
            this.props.onSelectedObjectBooked(new SeatsioObject(message.data.object, this.injectJsAndReturnDeferredFn.bind(this)))
        } else if (message.type === 'onSessionInitialized') {
            this.props.onSessionInitialized(message.data.holdToken)
        } else if (message.type === 'onHoldSucceeded') {
            this.props.onHoldSucceeded(message.data.objects, message.data.ticketTypes)
        } else if (message.type === 'onHoldFailed') {
            this.props.onHoldFailed(message.data.objects, message.data.ticketTypes)
        } else if (message.type === 'onHoldTokenExpired') {
            this.props.onHoldTokenExpired()
        } else if (message.type === 'onReleaseHoldSucceeded') {
            this.props.onReleaseHoldSucceeded(message.data.objects, message.data.ticketTypes)
        } else if (message.type === 'onReleaseHoldFailed') {
            this.props.onReleaseHoldFailed(message.data.objects, message.data.ticketTypes)
        } else if (message.type === 'onSelectionValid') {
            this.props.onSelectionValid()
        } else if (message.type === 'onSelectionInvalid') {
            this.props.onSelectionInvalid()
        } else if (message.type === 'onFullScreenOpened') {
            this.props.onFullScreenOpened()
        } else if (message.type === 'onFullScreenClosed') {
            this.props.onFullScreenClosed()
        } else if (message.type === 'onFilteredCategoriesChanged') {
            this.props.onFilteredCategoriesChanged(message.data.categories)
        } else if (message.type === 'priceFormatterRequested') {
            let formattedPrice = this.props.priceFormatter(message.data.price);
            this.injectJs(
                `resolvePromise(${message.data.promiseId}, "${formattedPrice}")`
            );
        } else if (message.type === 'tooltipInfoRequested') {
            let tooltipInfo = this.props.tooltipInfo(message.data.object);
            this.injectJs(
                `resolvePromise(${message.data.promiseId}, "${tooltipInfo}")`
            );
        } else {
            let promise = this.promises[message.type];
            if (promise !== undefined) {
                if (message.promiseResult === 'resolve') {
                    promise.resolve(message.data)
                } else {
                    promise.reject(message.data)
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
                <script src="${this.props.chartJsUrl}"></script>
            </head>
            <body>
                <div id="${this.divId}"></div>
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

    registerPostMessage(event, callbackParams) {
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
                })));
            };
            console.debug = console.log;
            console.info = console.log;
            console.warn = console.log;
            console.error = console.log;
        `;
    }
}

SeatsioSeatingChart.defaultProps = {
    chartJsUrl: 'https://cdn.seatsio.net/chart.js'
};

SeatsioSeatingChart.propTypes = {
    event: PropTypes.string,
    events: PropTypes.array,
    workspaceKey: PropTypes.string.isRequired,
    onChartRendered: PropTypes.func,
    onObjectClicked: PropTypes.func,
    onObjectSelected: PropTypes.func,
    onObjectDeselected: PropTypes.func,
    onSelectedObjectBooked: PropTypes.func,
    onSessionInitialized: PropTypes.func,
    onHoldSucceeded: PropTypes.func,
    onHoldFailed: PropTypes.func,
    onHoldTokenExpired: PropTypes.func,
    onReleaseHoldSucceeded: PropTypes.func,
    onReleaseHoldFailed: PropTypes.func,
    onSelectionValid: PropTypes.func,
    onSelectionInvalid: PropTypes.func,
    onFullScreenOpened: PropTypes.func,
    onFullScreenClosed: PropTypes.func,
    onFilteredCategoriesChanged: PropTypes.func,
    pricing: PropTypes.array,
    priceFormatter: PropTypes.func,
    numberOfPlacesToSelect: PropTypes.number,
    objectWithoutPricingSelectable: PropTypes.bool,
    objectWithoutCategorySelectable: PropTypes.bool,
    selectedObjects: PropTypes.array,
    colorScheme: PropTypes.string,
    tooltipInfo: PropTypes.func,
    objectTooltip: PropTypes.object,
    language: PropTypes.string,
    messages: PropTypes.object,
    maxSelectedObjects: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
    selectedObjectsInputName: PropTypes.string,
    unavailableCategories: PropTypes.array,
    availableCategories: PropTypes.array,
    selectableObjects: PropTypes.array,
    filteredCategories: PropTypes.array,
    objectColor: PropTypes.func,
    sectionColor: PropTypes.func,
    objectLabel: PropTypes.func,
    objectIcon: PropTypes.func,
    isObjectVisible: PropTypes.func,
    canGASelectionBeIncreased: PropTypes.func,
    showRowLabels: PropTypes.bool,
    alwaysShowSectionContents: PropTypes.bool,
    session: PropTypes.oneOf(['continue', 'manual', 'start', 'none']),
    holdToken: PropTypes.string,
    holdOnSelectForGAs: PropTypes.bool,
    showLegend: PropTypes.bool,
    legend: PropTypes.object,
    multiSelectEnabled: PropTypes.bool,
    showMinimap: PropTypes.bool,
    showSectionPricingOverlay: PropTypes.bool,
    showActiveSectionTooltipOnMobile: PropTypes.bool,
    showViewFromYourSeatOnMobile: PropTypes.bool,
    showViewFromYourSeatOnDesktop: PropTypes.bool,
    selectionValidators: PropTypes.array,
    categories: PropTypes.array,
    categoryFilter: PropTypes.object,
    objectCategories: PropTypes.object,
    objectCategory: PropTypes.func,
    extraConfig: PropTypes.object,
    mode: PropTypes.string,
    inputDevice: PropTypes.oneOf(['auto', 'cursor', 'touch']),
    loading: PropTypes.string,
    ticketListings: PropTypes.array,
    showZoomOutButtonOnMobile: PropTypes.bool,
    showFullScreenButton: PropTypes.bool,
    channels: PropTypes.array
};

export default SeatsioSeatingChart;
