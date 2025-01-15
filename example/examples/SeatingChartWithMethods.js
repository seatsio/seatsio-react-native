import React from 'react';
import {ScrollView, StyleSheet, Text, View, Button} from 'react-native';
import SeatsioSeatingChart from '@seatsio/seatsio-react-native';

class SimpleSeatingChartWithChangeConfig extends React.Component {

    render() {
        return (
            <View style={this.styles.container}>
                <ScrollView style={StyleSheet.absoluteFill} contentContainerStyle={this.styles.scrollview}>
                    <Text>Demo: how to call methods on chart</Text>
                    <View style={this.styles.chart}>
                        <SeatsioSeatingChart
                            region="eu"
                            workspaceKey="publicDemoKey"
                            event="largeTheatreEvent"
                            onChartRendered={(chart) => this.chart = chart}
                            session="start"
                        />

                    </View>

                    <View>
                        <Button title={"getHoldToken()"} onPress={() => this.chart.getHoldToken().then(holdToken => alert(holdToken))}/>

                        <Button title={"resetView()"} onPress={() => this.chart.resetView()}/>
                        <Button title={"startNewSession()"} onPress={() => this.chart.startNewSession()}/>
                        <Button title={"listSelectedObjects()"} onPress={() => this.chart.listSelectedObjects().then(objects => alert(objects.map(o => o.label).join(', ')))} />
                        <Button title={"clearSelection()"} onPress={() => this.chart.clearSelection()}/>

                        <Button title={"selectObjects(['A-1', 'A-2'])"} onPress={() => this.chart.selectObjects(['A-1', 'A-2'])}/>
                        <Button title={"deselectObjects(['A-1', 'A-2'])"} onPress={() => this.chart.deselectObjects(['A-1', 'A-2'])}/>

                        <Button title={"selectCategories(['3'])"} onPress={() => this.chart.selectCategories(['3'])}/>
                        <Button title={"deselectCategories(['3'])"} onPress={() => this.chart.deselectCategories(['3'])}/>

                        <Button
                            title="changeConfig()"
                            onPress={() => {
                                this.chart.changeConfig({
                                    objectColor: object => object.isSelectable() ? 'green' : 'red',
                                    objectLabel: () => 'x',
                                    numberOfPlacesToSelect: 5
                                })
                            }}
                        />

                        <Button title={"findObject('A-1')"} onPress={() => {
                            this.chart.findObject('A-1').then(object => alert('object found: ' + object.label))
                        }}/>
                        <Button title={"findObject('A-111')"} onPress={() => {
                            this.chart.findObject('A-111').catch(() => alert('object not found!'))
                        }}/>

                        <Button title={"listCategories()"} onPress={() => this.chart.listCategories().then(categories => console.log(categories))}/>

                        <Button title={"zoomToSelectedObjects()"} onPress={() => this.chart.zoomToSelectedObjects().then(() => console.log("zooming done"))}/>
                        <Button title={"zoomToFilteredCategories()"} onPress={() => this.chart.zoomToFilteredCategories().then(() => console.log("zooming done"))}/>
                        <Button title={"zoomToSection()"} onPress={() => this.chart.zoomToSection('Circle T').then(() => console.log("zooming done"))}/>

                    </View>
                </ScrollView>

            </View>
        );
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
    });

}


export default SimpleSeatingChartWithChangeConfig;
