import SeatsioSeatingChart from '@seatsio/seatsio-react-native'
import { SeatingChart, SelectableObject } from '@seatsio/seatsio-types'
import React from 'react'
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native'

class SeatingChartWithObjectMethods extends React.Component<{}, { chart?: SeatingChart }> {
    constructor (props: {}) {
        super(props)
        this.state = {}
    }

    render () {
        const { chart } = this.state
        return (
            <View style={this.styles.container}>
                <ScrollView style={StyleSheet.absoluteFill} contentContainerStyle={this.styles.scrollview}>
                    <Text>Demo: call methods on Objects</Text>
                    <View style={this.styles.chart}>
                        <SeatsioSeatingChart
                            region="eu"
                            workspaceKey="publicDemoKey"
                            event="smallTheatreEvent2"
                            onChartRendered={(chart) => this.setState({ chart })}
                            pricing={[
                                { 'category': 1, 'ticketTypes': [
                                    { 'ticketType': 'adult', 'price': 30 },
                                    { 'ticketType': 'child', 'price': 20 }
                                ] },
                                { 'category': 2, 'ticketTypes': [
                                    { 'ticketType': 'adult', 'price': 40 },
                                    { 'ticketType': 'child', 'price': 30 },
                                    { 'ticketType': '65+', 'price': 25 }
                                ] },
                                { 'category': 3, 'price': 50 }
                            ]}
                        />

                    </View>
                    { chart && (
                        <>
                            <Button title={'Log object properties'} onPress={() =>
                                chart.findObject('A-1')
                                    .then((o: SelectableObject) => (o as any).isInChannel?.('1c0df13b-ecab-e55c-8fc9-799779ba18e7'))
                                    .then(isInChannel => console.log('in channel: ' + isInChannel))
                            }/>
                            <Button title={'Select A-1 (adult)'} onPress={() =>
                                chart.findObject('A-1')
                                    .then((o) => o.select('adult'))
                                    .then(() => console.log('seat A-1 selected!'))
                            }/>
                            <Button title={'Select A-1 (no ticket type)'} onPress={() =>
                                chart.findObject('A-1')
                                    .then((o) => o.select())
                                    .then(() => console.log('seat A-1 selected!'))
                            }/>
                            <Button title={'Deselect A-1 (adult)'} onPress={() =>
                                chart.findObject('A-1')
                                    .then((o) => o.deselect('adult'))
                                    .then(() => console.log('seat A-1 deselected!'))
                            }/>
                            <Button title={'Deselect A-1 (no ticket type)'} onPress={() =>
                                chart.findObject('A-1')
                                    .then((o) => o.deselect())
                                    .then(() => console.log('seat A-1 deselected!'))
                            }/>
                            <Button title={'Pulse A-1'} onPress={() =>
                                chart.findObject('A-1')
                                    .then((o: SelectableObject) => (o as any).pulse?.())
                            }/>
                            <Button title={'Unpulse A-1'} onPress={() =>
                                chart.findObject('A-1')
                                    .then((o: SelectableObject) => (o as any).unpulse?.())
                            }/>
                        </>
                    )}
                    <View>

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


export default SeatingChartWithObjectMethods
