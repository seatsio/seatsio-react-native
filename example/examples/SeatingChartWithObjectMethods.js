import React from 'react'
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native'
import SeatsioSeatingChart from '@seatsio/seatsio-react-native'

class SimpleSeatingChartWithChangeConfig extends React.Component {

    render() {
        return (
            <View style={this.styles.container}>
                <ScrollView style={StyleSheet.absoluteFill} contentContainerStyle={this.styles.scrollview}>
                    <Text>Demo: call methods on Objects</Text>
                    <View style={this.styles.chart}>
                        <SeatsioSeatingChart
                            region="eu"
                            workspaceKey="publicDemoKey"
                            event="smallTheatreEvent2"
                            onChartRendered={(chart) => this.chart = chart}
                            pricing={[
                                {'category': 1, 'ticketTypes': [
                                    {'ticketType': 'adult', 'price': 30},
                                    {'ticketType': 'child', 'price': 20}
                                ]},
                                {'category': 2, 'ticketTypes': [
                                    {'ticketType': 'adult', 'price': 40},
                                    {'ticketType': 'child', 'price': 30},
                                    {'ticketType': '65+', 'price': 25}
                                ]},
                                {'category': 3, 'price': 50}
                            ]}
                        />

                    </View>
                    <Button title={'Log object properties'} onPress={() =>
                        this.chart.findObject('A-1')
                            .then((o) => o.isInChannel('1c0df13b-ecab-e55c-8fc9-799779ba18e7'))
                            .then(isInChannel => console.log('in channel: ' + isInChannel))
                    }/>
                    <Button title={'Select A-1 (adult)'} onPress={() =>
                        this.chart.findObject('A-1')
                            .then((o) => o.select('adult'))
                            .then(() => console.log('seat A-1 selected!'))
                    }/>
                    <Button title={'Select A-1 (no ticket type)'} onPress={() =>
                        this.chart.findObject('A-1')
                            .then((o) => o.select())
                            .then(() => console.log('seat A-1 selected!'))
                    }/>
                    <Button title={'Deselect A-1 (adult)'} onPress={() =>
                        this.chart.findObject('A-1')
                            .then((o) => o.deselect('adult'))
                            .then(() => console.log('seat A-1 deselected!'))
                    }/>
                    <Button title={'Deselect A-1 (no ticket type)'} onPress={() =>
                        this.chart.findObject('A-1')
                            .then((o) => o.deselect())
                            .then(() => console.log('seat A-1 deselected!'))
                    }/>
                    <Button title={'Pulse A-1'} onPress={() =>
                        this.chart.findObject('A-1')
                            .then((o) => o.pulse())
                    }/>
                    <Button title={'Unpulse A-1'} onPress={() =>
                        this.chart.findObject('A-1')
                            .then((o) => o.unpulse())
                    }/>
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


export default SimpleSeatingChartWithChangeConfig
