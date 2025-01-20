import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SimpleSeatingChart from './examples/SimpleSeatingChart'
import SeatingChartWithMethods from './examples/SeatingChartWithMethods'
import SeatingChartWithObjectMethods from './examples/SeatingChartWithObjectMethods'
import ReactToEventsExample from './examples/ReactToEvents'

export default class App extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            Component: null,
        }
    }

    renderExample ([Component, title]) {
        return (
            <TouchableOpacity key={title} style={styles.button} onPress={() => this.setState({ Component })}>
                <Text>{title}</Text>
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

    renderExamples (examples) {
        const { Component } = this.state

        return (
            <View style={styles.container}>
                {Component && <Component/>}
                {Component && this.renderBackButton()}
                {!Component && (
                    <ScrollView style={StyleSheet.absoluteFill} contentContainerStyle={styles.scrollview}
                        showsVerticalScrollIndicator={false}>
                        {examples.map(example => this.renderExample(example))}
                    </ScrollView>
                )}
            </View>
        )
    }

    render () {
        return this.renderExamples(
            [
                [SimpleSeatingChart, 'Simple seating chart'],
                [SeatingChartWithMethods, 'call methods on chart'],
                [SeatingChartWithObjectMethods, 'call methods on objects'],
                [ReactToEventsExample, 'React to events']
            ]
        )
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    scrollview: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    button: {
        flex: 1,
        marginTop: 10,
        backgroundColor: 'rgba(220,220,220,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    back: {
        position: 'absolute',
        top: 30,
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
