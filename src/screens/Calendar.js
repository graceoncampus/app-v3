import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';
import { Agenda } from 'react-native-calendars';
import { headerStyles } from '../theme';
import { Menu } from '../icons';
import { Screen, Text } from '../components';

const gold = '#ae956b';

const convert12hr = (date) => {
  const res = date.split(':');
  let hr = res[0];
  let mer = ' AM';
  if (hr > 12) {
    hr -= 12;
    mer = ' PM';
  }
  const final = `${hr}:${res[1]}${mer}`;
  return final;
};

const loadItems = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  let startYear = currentYear;
  let endYear = currentYear + 1;
  if (currentMonth < 7) {
    startYear = currentYear - 1;
    endYear = currentYear;
  }
  const startDate = new Date(`01 September ${startYear} 00:00 UTC`);
  const endDate = new Date(`01 July ${endYear} 00:00 UTC`);
  const dates = [];
  let currentDate = startDate;
  const addDays = function(days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

export default class Calendar extends Component {
  // Menu bar and title
  static navigationOptions = ({ navigation }) => ({
    drawer: () => ({
      label: 'Calendar'
    }),
    title: 'CALENDAR',
    headerLeft: (
      <TouchableOpacity
        style={{ padding: 15 }}
        onPress={() => navigation.openDrawer()}
      >
        <Menu />
      </TouchableOpacity>
    ),
    headerRight: <View />,
    ...headerStyles
  });

  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('calendar'); // fetch data from firestore
    const events = {};
    const allDates = loadItems();
    allDates.forEach((date) => { events[date] = []; });
    this.state = {
      events
    };
  }

  componentDidMount() {
    this.ref.onSnapshot(this.getCollection);
  }

  getCollection = (querySnapshot) => {
    const { events } = this.state;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      Object.keys(data).forEach((date) => {
        const eventsInfo = Object.values(data[date]).map((event) => {
          const start = convert12hr(event.time);
          const end = convert12hr(event.endtime);
          return ({
            text: event.text,
            time: `${start} - ${end}`,
            loc: event.location
          });
        });
        events[date] = eventsInfo;
      });
    });
    this.setState({
      events
    });
  };


  render() {
    const { events } = this.state;
    return (
    // display all events in calendar format
      <Screen safeViewDisabled>
        <Agenda
          items={events}
          renderItem={item => (
            <View
              style={{
                backgroundColor: 'white',
                flex: 1,
                borderRadius: 5,
                padding: 10,
                marginRight: 10,
                marginTop: 17,
                height: item.height
              }}
            >
              <Text style={{ marginBottom: 7 }}>{item.text}</Text>
              <Text styleName="caption">{item.time}</Text>
              <Text styleName="caption">{item.loc}</Text>
            </View>
          )}
          renderEmptyDate={() => <View style={styles.emptyDate} />}
          rowHasChanged={(r1, r2) => r1.text !== r2.text}
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
    );
  }
}
const styles = StyleSheet.create({
  emptyDate: {
    marginTop: 45,
    marginRight: 10,
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    height: 5
  }
});
