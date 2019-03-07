
import React, {Component} from 'react';
import { TouchableOpacity, View } from 'react-native';
import firebase from 'react-native-firebase';
import { headerStyles } from '../theme';
import { Menu } from '../icons';
import { Screen } from '../components';
import { Title, Caption, Text } from '@shoutem/ui';
import { Agenda } from 'react-native-calendars'

export default class Calendar extends Component {
    //Menu bar and title
    static navigationOptions = ({ navigation }) => ({
      drawer: () => ({
        label: 'Calendar',
      }),
      title: 'CALENDAR',
      headerLeft: (
        <TouchableOpacity style={{ padding: 15 }} onPress={() => navigation.openDrawer()}>
          <Menu />
        </TouchableOpacity>
      ),
      headerRight: (
        <View />
      ),
      ...headerStyles,
    })

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('calendar');  //fetch data from firestore
        this.state = {
            events: [],
        };
    }

    componentDidMount() {
        this.ref.onSnapshot(this.getCollection);
    }

    getCollection = (querySnapshot) => {
        //Get all event data from firestore
        const len = querySnapshot.docs.length;
        const items = [];
        for (var i = 0; i < len; i++) {
            const curEvent = querySnapshot.docs[i];
            items[i] = {
                key: curEvent.id,
                ...curEvent.data(),
            };
        }

        let dateObj = {};
        for (var item in items[0]) {
            if (item == "key")
                continue;
            let date = item;
            let st = this.convert12hr(items[0][date]['0'].time);
            let end = this.convert12hr(items[0][date]['0'].endtime);
            let event = {
                text: items[0][date]['0'].text,
                time: st + " - " + end,
                loc: items[0][date]['0'].location
            }
            if (dateObj[date] && dateObj[date].length > 0) {
                dateObj[date].push(event);
            }
            else {
                dateObj[date] = [event];
            }
        }

        this.setState({
            events: dateObj,
        });
    }

    getTodaysDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
        dd = '0' + dd;
        }

        if (mm < 10) {
        mm = '0' + mm;
        }

        today = yyyy + '-' + mm + '-' + dd;
        return today;
    }

    convert12hr(date) {
        var res = date.split(":")
        var hr = res[0];
        var mer = " AM"
        if (hr > 12) {
            hr = hr - 12;
            mer = " PM";
        }
        var final = hr + ":" + res[1] + mer;
        return final;
    }

    render = () => {
        //display all events in calendar format
        return (
            <Screen>
                <Agenda
                    items={this.state.events}
                    selected={this.getTodaysDate.bind(this)}
                    renderItem={(item) => {
                        return (
                            <View style={{
                                backgroundColor: 'white',
                                flex: 1,
                                borderRadius: 5,
                                padding: 10,
                                marginRight: 10,
                                marginTop: 17,
                                height: item.height,
                            }}>
                                <Title>{item.text}</Title>
                                <Caption>{item.time}</Caption>
                                <Caption>{item.loc}</Caption>
                            </View>);
                    }}
                    renderEmptyDate={() => {
                        return (
                            <View style={{
                                height: 15,
                                flex: 1,
                                paddingTop: 30,
                            }}>
                            </View>
                        );
                    }}
                    renderEmptyData={() => {
                        return (
                            <View style={{
                                height: 15,
                                flex: 1,
                                paddingTop: 100,
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}>
                                <Text>No events on this day!</Text>
                            </View>
                        );
                    }}
                    rowHasChanged={(r1, r2) => {
                        return r1.text !== r2.text
                    }}
                    theme={{
                        todayTextColor: '#ae956b',
                        selectedDayBackgroundColor: '#ae956b',
                        dotColor: '#ae956b',
                        agendaDayTextColor: '#ae956b',
                        agendaDayNumColor: '#ae956b',
                        agendaTodayColor: '#ae956b',
                        agendaKnobColor: '#ae956b'
                      }}
                />
            </Screen>
        )
    }
}