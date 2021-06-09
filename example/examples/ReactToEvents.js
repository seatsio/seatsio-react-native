import React from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import SeatsioSeatingChart from "seatsio-react-native";

class ReactToEventsExample extends React.Component {

    render() {
        return (
            <View style={this.styles.container}>
                <ScrollView style={StyleSheet.absoluteFill} contentContainerStyle={this.styles.scrollview}>
                    <Text>Demo: Simple Seating Chart, no config</Text>
                    <View style={this.styles.chart}>
                        <SeatsioSeatingChart
                            workspaceKey="publicDemoKey"
                            event="smallTheatreEvent2"
                            session={'start'}
                            onObjectSelected={o => o.pulse()}
                            onObjectDeselected={o => o.unpulse()}
                            onObjectClicked={o => console.log("object clicked: " + o.label)}
                            onSelectedObjectBooked={o => console.log("You selected " + o.label + ' but it became unavailable in the meantime')}
                            onSessionInitialized={holdToken => console.log('new token: ' + holdToken.token)}
                            onHoldSucceeded={(objects, ticketTypes) => console.log('objects held: ' + objects.map(o => o.label).join(', ') + " with ticket types: " + ticketTypes.join(', '))}
                            onHoldFailed={(objects, ticketTypes) => console.log('holding objects failed: ' + objects.map(o => o.label).join(', ') + " with ticket types: " + ticketTypes.join(', '))}
                            onHoldTokenExpired={() => console.log('hold expired!')}
                            onReleaseHoldSucceeded={(objects, ticketTypes) => console.log('release hold succeeded: ', objects, ticketTypes)}
                            onReleaseHoldFailed={(objects, ticketTypes) => console.log('release hold failed: ', objects, ticketTypes)}
                            onSelectionValid={() => console.log("selection valid")}
                            onSelectionInvalid={() => console.log("selection invalid")}
                            onFullScreenOpened={() => console.log("full screen opened")}
                            onFullScreenClosed={() => console.log("full screen closed")}
                        />
                    </View>

                </ScrollView>
            </View>
        );
    }


    styles = StyleSheet.create({
        container: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        scrollview: {
            alignItems: 'center',
            paddingVertical: 40,
        },
        chart: {
            width: '100%',
            height: 400,
        },
    });

}


export default ReactToEventsExample;
