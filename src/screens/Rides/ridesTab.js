import React, { Component } from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import firebase from 'react-native-firebase';
import { Screen } from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { Menu } from '../../icons';

import AllRides from './allRides';
import MyRide from './myRide';
import RidesSignup from './rideSignup';

export default class RidesTab extends Component {
  static navigationOptions = ({ navigation }) => ({
    drawer: () => ({
      label: 'Rides'
    }),
    title: 'RIDES',
    headerLeft: (
      <TouchableOpacity style={{ padding: 15 }} onPress={() => navigation.openDrawer()}>
        <Menu />
      </TouchableOpacity>
    ),
    headerRight: (
      <View />
    ),
    ...headerStyles
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isRidesUp: false
    };
    this.ref = firebase.firestore().collection('rides').doc('current_rides').collection('cars');
    this.unsubscribe = null;
  }

  componentDidMount() { this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate); }

  componentWillUnmount() { this.unsubscribe(); }

  onCollectionUpdate = (querySnapshot) => {
    if (querySnapshot.empty) {
      this.setState({
        isRidesUp: false,
        loading: false,
      });
    } else {
      this.setState({
        isRidesUp: true,
        loading: false
      });
    }
  }

  render() {
    const { navigation } = this.props;
    const { isRidesUp, loading } = this.state;
    if (loading) {
      return (
        <Screen>
          <View style={[globalStyles.vvCenter, globalStyles.vhCenter, { flex: 1 }]}>
            <ActivityIndicator />
          </View>
        </Screen>
      );
    }
    if (!isRidesUp) {
      return (
        <RidesSignup />
      );
    }
    return (
      <ScrollableTabView
        tabBarBackgroundColor="#fff"
        tabBarTextStyle={{
          paddingTop: 10,
          fontFamily: 'Akkurat',
          fontSize: 13,
          color: '#222222',
          lineHeight: 15
        }}
        tabBarUnderlineStyle={{ height: 2, backgroundColor: '#ae956b' }}
      >
        <MyRide navigation={navigation} tabLabel="My Ride" />
        <AllRides tabLabel="All Rides" />
        <RidesSignup tabLabel="Signup" />
      </ScrollableTabView>
    );
  }
}
