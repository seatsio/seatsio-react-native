

import React from 'react'
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native'
import SeatsioSeatingChart from '@seatsio/seatsio-react-native'

class SeatingChartWithCustomPrompts extends React.Component {
    handlePlacesPrompt = (params, confirmSelection) => {
        // you can show a dialogue here to capture the required data
        confirmSelection(Math.random() * 10)
    }

    handleTicketTypePrompt = (params, confirmSelection) => {
        // you can show a dialogue here to capture the required data
        const ticketTypeOptions = params.ticketTypes.map(tt => tt.ticketType)
        confirmSelection(ticketTypeOptions[0])
    }

    handleOnPlacesWithTicketTypesPrompt = (params, confirmSelection) => {
        confirmSelection({ Child: Math.random() * 10 })
    }

    render () {
        return (
            <View style={this.styles.container}>
                <ScrollView style={StyleSheet.absoluteFill} contentContainerStyle={this.styles.scrollview}>
                    <Text style={{ fontWeight: 'bold' }}>Demo: onPlacesPrompt</Text>
                    <View style={this.styles.chart}>
                        <SeatsioSeatingChart
                            region="eu"
                            workspaceKey="publicDemoKey"
                            event="smallTheatreEvent2"
                            pricing={[{ category: 2, price: 40 }]}
                            onPlacesPrompt={this.handlePlacesPrompt}
                        />
                    </View>

                    <Text style={{ marginTop: 40, fontWeight: 'bold' }}>Demo: onTicketTypePrompt</Text>
                    <View style={this.styles.chart}>
                        <SeatsioSeatingChart
                            region="eu"
                            workspaceKey="publicDemoKey"
                            event="smallTheatreEvent2"
                            pricing={[
                                {
                                    category: 1, ticketTypes: [
                                        { ticketType: 'Adult', price: 8 },
                                        { ticketType: 'Child', price: 12 }
                                    ]
                                }
                            ]}
                            objectWithoutPricingSelectable={false}
                            onTicketTypePrompt={this.handleTicketTypePrompt}
                        />
                    </View>

                    <Text style={{ marginTop: 40, fontWeight: 'bold' }}>Demo: handleOnPlacesWithTicketTypesPrompt</Text>
                    <View style={this.styles.chart}>
                        <SeatsioSeatingChart
                            region="eu"
                            workspaceKey="publicDemoKey"
                            event="smallTheatreEvent2"
                            pricing={[
                                { category: 1, price: 30 },
                                { category: 5, ticketTypes: [
                                    { ticketType: 'Adult', price: 8 },
                                    { ticketType: 'Child', price: 12 }]
                                },
                                { category: 3, price: 50 }
                            ]}
                            objectWithoutPricingSelectable={false}
                            onPlacesWithTicketTypesPrompt={this.handleOnPlacesWithTicketTypesPrompt}
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

export default SeatingChartWithCustomPrompts
