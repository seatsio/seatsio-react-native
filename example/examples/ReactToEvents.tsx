import SeatsioSeatingChart from '@seatsio/seatsio-react-native'
import { SelectableObject } from '@seatsio/seatsio-types'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'


class ReactToEventsExample extends React.Component {
    render () {
        return (
            <View style={this.styles.container}>
                <ScrollView style={StyleSheet.absoluteFill} contentContainerStyle={this.styles.scrollview}>
                    <Text>Demo: Simple Seating Chart, no config</Text>
                    <View style={this.styles.chart}>
                        <SeatsioSeatingChart
                            region="eu"
                            workspaceKey="publicDemoKey"
                            event="smallTheatreEvent2"
                            session={'start'}
                            onObjectSelected={(o: SelectableObject) => (o as any).pulse?.()}
                            onObjectDeselected={(o: SelectableObject) => (o as any).unpulse?.()}
                            onObjectClicked={o => console.log('object clicked: ' + o.label)}
                            onSelectedObjectBooked={o => console.log('You selected ' + o.label + ' but it became unavailable in the meantime')}
                            onSessionInitialized={holdToken => console.log('new token: ' + holdToken.token)}
                            onHoldSucceeded={(objects, ticketTypes) => console.log('objects held: ' + objects.map(o => o.label).join(', ') + ' with ticket types: ' + ticketTypes.join(', '))}
                            onHoldFailed={(objects, ticketTypes) => console.log('holding objects failed: ' + objects.map(o => o.label).join(', ') + ' with ticket types: ' + ticketTypes.join(', '))}
                            onHoldTokenExpired={() => console.log('hold expired!')}
                            onReleaseHoldSucceeded={(objects, ticketTypes) => console.log('release hold succeeded: ', objects, ticketTypes)}
                            onReleaseHoldFailed={(objects, ticketTypes) => console.log('release hold failed: ', objects, ticketTypes)}
                            onSelectionValid={() => console.log('selection valid')}
                            onSelectionInvalid={() => console.log('selection invalid')}
                            onFullScreenOpened={() => console.log('full screen opened')}
                            onFullScreenClosed={() => console.log('full screen closed')}
                            onHoldCallsInProgress={() => console.log('hold calls in progress')}
                            onHoldCallsComplete={() => console.log('hold calls complete')}
                        />
                    </View>

                </ScrollView>
            </View>
        )
    }


    styles = StyleSheet.create({
        container: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: 10,
        },
        scrollview: {
            alignItems: 'center',
            paddingVertical: 40,
        },
        chart: {
            width: '100%',
            height: 400,
        },
    })

}


export default ReactToEventsExample
