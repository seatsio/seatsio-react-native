# Seats.io React Native SDK 

## Introduction

seatsio-react-native allows rendering seats.io seating charts inside a React Native application. 

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

### Persisting the session token (i.e. the hold token)
Seating charts store their hold token in the session storage of the browser. Since seatsio-react-native uses a webview to show the chart,
you loose the hold token when the webview gets destroyed. That's inconvenient when you want te let the ticket buyer go back to a chart
they previously opened (and in which they selected places).

The solution is to:
1. user navigates to the chart for the first time: render the chart with `session="start"`, and implement `onSessionInitialized` to store the hold token in your app
2. user navigates away from the seating chart: webview gets destroyed
3. user navigates back to the chart: render the chart with `session="manual"` and `holdToken="<the stored hold token>"`. Previously selected seats will automatically be selected again.

### Callbacks

Some callbacks (which are internally executed inside the seats.io iFrame) need to be passed in as a string: 

- `objectColor`
- `sectionColor`
- `objectLabel`
- `objectIcon`
- `isObjectVisible`
- `canGASelectionBeIncreased`


So for example, `objectColor` would look like this:

```jsx
import SeatsioSeatingChart from '@seatsio/seatsio-react-native';

<SeatsioSeatingChart
    region="eu"
    workspaceKey="<yourPublicWorkspaceKey>"
    event="<yourEventKey>"
    objectColor="(object) => { return object.selectable ? 'green' : 'red' }"
/>
```
