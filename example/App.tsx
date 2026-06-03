import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SimpleSeatingChart from './examples/SimpleSeatingChart'
import SeatingChartWithMethods from './examples/SeatingChartWithMethods'
import SeatingChartWithObjectMethods from './examples/SeatingChartWithObjectMethods'
import ReactToEventsExample from './examples/ReactToEvents'
import SeatingChartWithCustomPrompts from './examples/SeatingChartWithCustomPrompts'

export default class App extends React.Component<{}, { Component: React.ComponentType | null }> {
    constructor (props: {}) {
        super(props)
        this.state = {
            Component: null,
        }
    }

    renderExample ([Component, title]: [React.ComponentType, string]) {
        return (
            <TouchableOpacity key={title} style={styles.button} onPress={() => this.setState({ Component })}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
        )
    }

    renderBackButton () {
        return (
            <TouchableOpacity style={styles.back} onPress={() => this.setState({ Component: null })}>
                <Text style={styles.backButton}>&larr;</Text>
            </TouchableOpacity>
        )
    }

    renderExamples (examples: [React.ComponentType, string][]) {
        const { Component } = this.state

        return (
            <View style={styles.container}>
                {Component
                    ? (
                        <View style={styles.chartContainer}>
                            <Component/>
                            {this.renderBackButton()}
                        </View>
                    )
                    : (
                        <ScrollView contentContainerStyle={styles.scrollview}>
                            {examples.map(example => this.renderExample(example))}
                        </ScrollView>
                    )
                }
            </View>
        )
    }

    render () {
        return this.renderExamples(
            [
                [SimpleSeatingChart, 'Simple seating chart'],
                [SeatingChartWithMethods, 'call methods on chart'],
                [SeatingChartWithObjectMethods, 'call methods on objects'],
                [ReactToEventsExample, 'React to events'],
                [SeatingChartWithCustomPrompts, 'Custom prompts']
            ]
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chartContainer: {
        flex: 1,
    },
    scrollview: {
        alignItems: 'stretch',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    button: {
        marginTop: 10,
        backgroundColor: 'rgba(220,220,220,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center',
    },
    back: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(255,255,255,0.4)',
        padding: 12,
        borderRadius: 20,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: { fontWeight: 'bold', fontSize: 30 },
})
