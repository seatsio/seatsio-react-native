import SeatsioSeatingChart from '@seatsio/seatsio-react-native'
import { SeatingChart } from '@seatsio/seatsio-types'
import React from 'react'
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native'

class SimpleSeatingChartWithChangeConfig extends React.Component<{}, { chart?: SeatingChart }> {
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
                            <Button title={'getHoldToken()'} onPress={() => (chart as any).getHoldToken().then((holdToken: string) => Alert.alert(holdToken))}/>

                            <Button title={'resetView()'} onPress={() => chart.resetView()}/>
                            <Button title={'startNewSession()'} onPress={() => chart.startNewSession()}/>
                            <Button title={'listSelectedObjects()'} onPress={() => chart.listSelectedObjects().then(objects => Alert.alert(objects.map(o => o.label).join(', ')))} />
                            <Button title={'clearSelection()'} onPress={() => chart.clearSelection()}/>

                            <Button title={'selectObjects([\'A-1\', \'A-2\'])'} onPress={() => (chart as any).selectObjects(['A-1', 'A-2'])}/>
                            <Button title={'deselectObjects([\'A-1\', \'A-2\'])'} onPress={() => chart.deselectObjects(['A-1', 'A-2'])}/>

                            <Button title={'selectCategories([\'3\'])'} onPress={() => chart.selectCategories(['3'])}/>
                            <Button title={'deselectCategories([\'3\'])'} onPress={() => chart.deselectCategories(['3'])}/>

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

                            <Button title={'findObject(\'A-1\')'} onPress={() => {
                                chart.findObject('A-1').then(object => Alert.alert('object found: ' + object.label))
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


export default SimpleSeatingChartWithChangeConfig
