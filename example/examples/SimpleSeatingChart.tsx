import React from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import SeatsioSeatingChart from '@seatsio/seatsio-react-native'

class SimpleSeatingChart extends React.Component {

    render () {
        return (
            <View style={this.styles.container}>
                <ScrollView contentContainerStyle={this.styles.scrollview}>
                    <Text>Demo: Simple Seating Chart, no config</Text>
                    <View style={this.styles.chart}>
                        <SeatsioSeatingChart
                            region="eu"
                            workspaceKey="publicDemoKey"
                            event="smallTheatreEvent2"
                        />
                    </View>

                </ScrollView>
            </View>
        )
    }


    styles = StyleSheet.create({
        container: {
            flex: 1,
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


export default SimpleSeatingChart
