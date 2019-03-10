
import React, {Component} from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';
import { headerStyles } from '../theme';
import { Menu } from '../icons';
import { Screen } from '../components';
import { Title, Caption, Text } from '@shoutem/ui';
import { Agenda } from 'react-native-calendars'

const gold = '#ae956b';
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
            events: {},
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
        
        //Fill the calendar with empty dates
        var allDates = this.loadItems();
        let dateObj = {};
        for (var i in allDates) {
            let date = allDates[i];
            dateObj[date] = [];
        }

        //Put in non-empty dates 
        for (var item in items[0]) {
            if (item == "key")
                continue;
            let date = item;
            let start = this.convert12hr(items[0][date]['0'].time);
            let end = this.convert12hr(items[0][date]['0'].endtime);
            let event = {
                text: items[0][date]['0'].text,
                time: start + " - " + end,
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

    loadItems() {
        //Get empty dates to fill the calendar with
        var startDate = new Date('01 October 2018 00:00 UTC');
        var endDate = new Date('01 July 2019 00:00 UTC');
        var dates = [],
        currentDate = startDate,
        addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
        while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate = addDays.call(currentDate, 1);
        }
        return dates;
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
                                <Title style={{fontSize: 22}}>{item.text}</Title>
                                <Caption style={{fontSize: 14}}>{item.time}</Caption>
                                <Caption style={{fontSize: 14}}>{item.loc}</Caption>
                            </View>);
                    }}
                    renderEmptyDate={() => {
                        return(
                            <View style={styles.emptyDate}></View>
                        )
                    }}
                    rowHasChanged={(r1, r2) => {
                        return r1.text !== r2.text
                    }}
                    theme={{
                        todayTextColor: gold,
                        selectedDayBackgroundColor: gold,
                        dotColor: gold,
                        agendaDayTextColor: gold,
                        agendaDayNumColor: gold,
                        agendaTodayColor: gold,
                        agendaKnobColor: gold
                      }}
                />
            </Screen>
        )
    }
}
const styles = StyleSheet.create({
    emptyDate: {
        marginTop: 45,
        marginRight: 10,
        borderTopWidth: 1,
        borderTopColor: '#dddddd',
        height: 5,
    }
  });