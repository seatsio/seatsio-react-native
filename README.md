# Seats.io react-native component 

## Introduction

seatsio-react-native allows rendering seats.io seating charts inside a react-native application. 

It uses [React Native Webview](https://github.com/react-native-webview/react-native-webview) as an embedded browser.

## Usage

Tip: be sure to check out the [examples folder](https://github.com/seatsio/seatsio-react-native/tree/master/example/examples), it contains samples for many configuration options. 

Minimal: 
```jsx
import SeatsioSeatingChart from '@seatsio/seatsio-react-native';

<SeatsioSeatingChart
    region="eu"
    workspaceKey="<yourPublicWorkspaceKey>"
    event="<yourEventKey>"
/>
```
