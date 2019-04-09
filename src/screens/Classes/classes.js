import React, { Component, Fragment } from 'react';
import {
  TouchableOpacity, FlatList, View, ActivityIndicator
} from 'react-native';
import firebase from 'react-native-firebase';
import { Screen, Divider, Text } from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { Menu, Check } from '../../icons';
import { months } from '../../utils';

export const Meta = ({
  data: {
    instructor,
    startMonth,
    startDay,
    endMonth,
    endDay,
    location,
    openSpots,
    totalSpots,
    day,
    classTime
  }
}) => (
  <Fragment>
    {instructor && (
    <Text>
      <Text styleName="caption bold">Instructor: </Text>
      <Text styleName="caption">{instructor}</Text>
    </Text>
    )}
    {location && (
    <Text>
      <Text styleName="caption bold">Location: </Text>
      <Text styleName="caption">{location}</Text>
    </Text>
    )}
    <Text>
      <Text styleName="caption bold">Dates: </Text>
      <Text styleName="caption">{`${startMonth} ${startDay} - ${endMonth} ${endDay}`}</Text>
    </Text>
    <Text>
      <Text styleName="caption bold">Time: </Text>
      <Text styleName="caption">{`${day}, ${classTime}`}</Text>
    </Text>
    {totalSpots && (
    <Text>
      <Text styleName="caption bold">Spots Left: </Text>
      <Text styleName="caption">{`${openSpots}/${totalSpots}`}</Text>
    </Text>
    )}
  </Fragment>
);

export default class Classes extends Component {
  static navigationOptions = ({ navigation }) => ({
    drawer: () => ({
      label: 'Classes',
    }),
    title: 'CLASSES',
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
    this.ref = firebase.firestore().collection('classes').orderBy('startDate', 'desc');
    this.unsubscribe = null;
    this.state = {
      classes: [],
      loading: true
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const currentUid = firebase.auth().currentUser.uid;
    const classes = [];

    querySnapshot.forEach((cl) => {
      const data = cl.data();
      let isEnrolled = false;
      if (data.students) {
        const student = data.students.find(std => (std.UID === currentUid));
        if (student) isEnrolled = true;
      }
      classes.push({
        key: cl.id,
        isEnrolled,
        ...data
      });
    });

    this.setState({
      classes,
      loading: false
    });
  }

  renderClass = (data) => {
    const { navigation } = this.props;
    const {
      title, openSpots, totalSpots, startDate, endDate, instructor, isEnrolled, day, classTime
    } = data.item;
    const startMonth = months[startDate.getMonth()];
    const startDay = startDate.getDate();
    const endMonth = months[endDate.getMonth()];
    const endDay = endDate.getDate();
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Class', { data: data.item })}>
        <View style={{
          padding: 15, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
        }}
        >
          <View>
            <Text style={{ marginBottom: 7 }}>{title}</Text>
            <Meta data={{
              instructor,
              startMonth,
              startDay,
              endMonth,
              endDay,
              openSpots,
              totalSpots,
              day,
              classTime
            }}
            />
          </View>
          { isEnrolled
            && <Check />
          }
        </View>
        <Divider type="line" />
      </TouchableOpacity>
    );
  }

  render() {
    const { loading, classes } = this.state;
    if (!loading) {
      return (
        <Screen safeViewDisabled>
          <FlatList
            data={classes}
            renderItem={this.renderClass}
          />
        </Screen>
      );
    }
    return (
      <Screen safeViewDisabled>
        <View style={[globalStyles.vvCenter, globalStyles.vhCenter, { flex: 1 }]}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }
}
