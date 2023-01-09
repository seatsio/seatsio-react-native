# Seats.io react-native component 

## Introduction

seatsio-react-native allows rendering seats.io seating charts inside a react-native application. 

It uses [React Native Webview](https://github.com/react-native-webview/react-native-webview) as an embedded browser.

## Usage

Tip: be sure to check out the [examples folder](https://github.com/seatsio/seatsio-react-native/tree/master/example/examples), it contains samples for many configuration options. 

### Minimal 
```jsx
import SeatsioSeatingChart from '@seatsio/seatsio-react-native';

<SeatsioSeatingChart
    region="eu"
    workspaceKey="<yourPublicWorkspaceKey>"
    event="<yourEventKey>"
/>
```

### Using sessions 
```jsx
import SeatsioSeatingChart from '@seatsio/seatsio-react-native';

<SeatsioSeatingChart
    region="eu"
    workspaceKey="<yourPublicWorkspaceKey>"
    event="<yourEventKey>"
    session="start"
    onSessionInitialized={holdToken => console.log('new token: ' + holdToken.token)}
/>
```

You can also retrieve the hold token through `chart.getHoldToken()`. Do not use `chart.holdToken` - that property is undefined:

```jsx
import SeatsioSeatingChart from '@seatsio/seatsio-react-native';

<SeatsioSeatingChart
    region="eu"
    workspaceKey="<yourPublicWorkspaceKey>"
    event="<yourEventKey>"
    session="start"
    onChartRendered={(chart) => this.chart = chart}
/>

<Button title={"getHoldToken()"} onPress={() => this.chart.getHoldToken().then(holdToken => alert(holdToken))}/>
```

### Showing seat labels
```jsx
import SeatsioSeatingChart from '@seatsio/seatsio-react-native';

<SeatsioSeatingChart
    region="eu"
    workspaceKey="<yourPublicWorkspaceKey>"
    event="<yourEventKey>"
    objectLabel={object => object.labels.own}
/>
```
