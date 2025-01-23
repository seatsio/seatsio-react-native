import SeatsioSeatingChart, { SeatingChart } from '@seatsio/seatsio-react-native'
import React from 'react'
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native'

class SeatingChartWithMethods extends React.Component<{}, { chart?: SeatingChart }> {
    constructor (props: {}) {
        super(props)
        this.state = {}
    }

    render () {
        const { chart } = this.state

        return (
            <View style={this.styles.container}>
                <ScrollView style={StyleSheet.absoluteFill} contentContainerStyle={this.styles.scrollview}>
                    <Text>Demo: how to call methods on chart</Text>
                    <View style={this.styles.chart}>
                        <SeatsioSeatingChart
                            region="eu"
                            workspaceKey="publicDemoKey"
                            event="largeTheatreEvent"
                            onChartRendered={(chart) => this.setState({ chart })}
                            session="start"
                        />

                    </View>
                    { chart && (
                        <View>
                            <Button title={'getHoldToken()'} onPress={() => chart.getHoldToken().then((holdToken: string) => Alert.alert(holdToken))}/>

                            <Button title={'resetView()'} onPress={() => chart.resetView()}/>
                            <Button title={'startNewSession()'} onPress={() => chart.startNewSession()}/>
                            <Button title={'listSelectedObjects()'} onPress={() => chart.listSelectedObjects().then(objects => Alert.alert(objects.map(o => o.label).join(', ')))} />
                            <Button title={'clearSelection()'} onPress={() => chart.clearSelection()}/>
                            <Button title={'selectObjects([\'Arena-1-11, \'Arena-1-12\'])'} onPress={() => { console.log('Chart', chart); chart.doSelectObjects(['Arena-1-11', 'Arena-1-12']) }}/>
                            <Button title={'deselectObjects([\'Arena-1-11\', \'Arena-1-12\'])'} onPress={() => chart.deselectObjects(['Arena-1-11', 'Arena-1-12'])}/>
                            <Button title={'selectCategories([\'35\'])'} onPress={() => chart.selectCategories(['35'])}/>
                            <Button title={'deselectCategories([\'35\'])'} onPress={() => chart.deselectCategories(['35'])}/>

                            <Button
                                title="changeConfig()"
                                onPress={() => {
                                    chart.changeConfig({
                                        objectColor: object => (object as any).isSelectable() ? 'green' : 'red',
                                        objectLabel: () => 'x',
                                        numberOfPlacesToSelect: 5
                                    })
                                }}
                            />

                            <Button title={'findObject(\'Arena-1-11\')'} onPress={() => {
                                chart.findObject('Arena-1-11').then(object => Alert.alert('object found: ' + object.label))
                            }}/>
                            <Button title={'findObject(\'A-111\')'} onPress={() => {
                                chart.findObject('A-111').catch(() => Alert.alert('object not found!'))
                            }}/>

                            <Button title={'listCategories()'} onPress={() => chart.listCategories().then(categories => console.log(categories))}/>

                            <Button title={'zoomToSelectedObjects()'} onPress={() => chart.zoomToSelectedObjects().then(() => console.log('zooming done'))}/>
                            <Button title={'zoomToFilteredCategories()'} onPress={() => chart.zoomToFilteredCategories().then(() => console.log('zooming done'))}/>
                            <Button title={'zoomToSection()'} onPress={() => chart.zoomToSection('Circle T')}/>

                        </View>
                    )}
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


export default SeatingChartWithMethods
