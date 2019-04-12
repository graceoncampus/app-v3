import React, { Component, Fragment } from 'react';
import {
  TouchableOpacity, View, ActivityIndicator, FlatList
} from 'react-native';
import firebase from 'react-native-firebase';
import { Screen, Text, Divider } from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { Menu, Chevron } from '../../icons';
import { getCurrentUserData } from '../../utils';

export default class MyRide extends Component {
  static navigationOptions = ({ navigation }) => ({
    drawer: () => ({
      label: 'MyRide'
    }),
    title: 'MY RIDE',
    headerLeft: (
      <TouchableOpacity style={{ padding: 15 }} onPress={() => navigation.openDrawer()}>
        <Menu />
      </TouchableOpacity>
    ),
    headerRight: <View />,
    ...headerStyles
  });

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    const thisUserData = getCurrentUserData();
    const { currentCar } = thisUserData;
    this.state = {
      myDriverData: {},
      myRidersData: [],
      loading: true,
      isRidesUp: null
    };
    this.ref = firebase
      .firestore()
      .collection('rides')
      .doc('current_rides')
      .collection('cars')
      .doc(`${currentCar}`);
    this.unsubscribe = null;
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (docs) => {
    if (docs.data()) {
      const car = docs.data();
      const myRidersData = car.riders;
      const myDriverData = car.driver;
      this.setState({
        myDriverData,
        myRidersData,
        loading: false,
        isRidesUp: true
      });
    } else {
      this.setState({
        loading: false,
        isRidesUp: false
      });
    }
  };

  renderRow = (data) => {
    const { navigation } = this.props;
    const UID = data.item.uid;
    return (
      <Fragment>
        <TouchableOpacity
          onPress={() => (UID ? navigation.navigate('UserInformation', { UID }) : null)}
          style={[globalStyles.row, globalStyles.spaceBetween]}
        >
          <Text styleName="subtitle">{data.item.name}</Text>
          {UID !== '' && (
            <View>
              <Chevron style={{ marginTop: 0 }} />
            </View>
          )}
        </TouchableOpacity>
        <Divider type="line" />
      </Fragment>
    );
  };

  render() {
    const {
      loading, isRidesUp, myDriverData, myRidersData
    } = this.state;
    const { navigation } = this.props;
    const UID = myDriverData.uid;
    if (!loading && isRidesUp) {
      return (
        <Screen>
          <TouchableOpacity
            onPress={() => (UID ? navigation.navigate('UserInformation', { UID }) : null)}
            style={[globalStyles.row, globalStyles.spaceBetween, { flexGrow: 0 }]}
          >
            <Text styleName="subtitle">{myDriverData.name}</Text>
            <View style={[globalStyles.row, globalStyles.hhEnd, { padding: 0 }]}>
              <Text styleName="center caption" style={{ textAlign: 'right' }}>
                Driver
              </Text>
              {UID !== '' && <Chevron style={{ marginLeft: 4, marginTop: 0 }} />}
            </View>
          </TouchableOpacity>
          <Divider type="line" />
          <FlatList scrollEnabled={false} data={myRidersData} renderItem={this.renderRow} />
        </Screen>
      );
    }
    if (!loading && !isRidesUp) {
      return (
        <Screen>
          <View style={[globalStyles.vvCenter, globalStyles.vhCenter, { flex: 1, marginTop: -50 }]}>
            <Text styleName="center subtitle">Rides for this Sunday are not up yet!</Text>
          </View>
        </Screen>
      );
    }
    return (
      <Screen>
        <View style={[globalStyles.vvCenter, globalStyles.vhCenter, { flex: 1 }]}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }
}
