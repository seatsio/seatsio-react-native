

import React from 'react'
import { StyleSheet, View, Text, ScrollView, Alert, Platform } from 'react-native'
import SeatsioSeatingChart from '@seatsio/seatsio-react-native'

class SeatingChartWithCustomPrompts extends React.Component {
    handlePlacesPrompt = (params, confirmSelection) => {
        const selectedPlaces = params.selectedPlaces
        if (Platform.OS === 'ios' && Alert.prompt) {
            Alert.prompt(
                'Edit the number of selected places',
                `Current: ${selectedPlaces}`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: (amount) => {
                            const num = parseInt(amount)
                            if (!isNaN(num)) {
                                confirmSelection(num)
                            }
                        },
                    },
                ],
                'plain-text',
                String(selectedPlaces)
            )
        } else {
            // Fallback: just use current value
            confirmSelection(selectedPlaces)
        }
    }

    handleTicketTypePrompt = (params, confirmSelection) => {
        const ticketTypeOptions = params.ticketTypes.map(tt => tt.ticketType)
        const first = ticketTypeOptions[0]
        if (Platform.OS === 'ios' && Alert.prompt) {
            Alert.prompt(
                'Choose a ticket type',
                `Options: ${ticketTypeOptions.join(', ')}`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: (type) => {
                            if (type && ticketTypeOptions.includes(type)) {
                                confirmSelection(type)
                            }
                        },
                    },
                ],
                'plain-text',
                first
            )
        } else {
            // Fallback: just use first option
            confirmSelection(first)
        }
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