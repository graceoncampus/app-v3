import React, { Component } from 'react';
import { TouchableOpacity, StatusBar, Platform } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { View } from '@shoutem/ui';
import { headerStyles } from '../../theme';
import { Menu } from '../../icons';

import AllRides from './allRides';
import MyRide from './myRide';
import RidesSignup from './rideSignup';

export default class RidesTab extends Component {
    static navigationOptions = ({ navigation }) => ({
        drawer: () => ({
          label: 'Rides',
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
        ...headerStyles,
      })

  render = () => (
    <ScrollableTabView
      tabBarBackgroundColor='#fff'
      tabBarTextStyle={{ paddingTop: 10, fontFamily: 'Akkurat-Regular', fontSize: 13, color: '#222222', lineHeight: 15 }}
      tabBarUnderlineStyle={{ height: 2, backgroundColor: '#ae956b' }}
    >
      <MyRide navigation={this.props.navigation} tabLabel="My Ride" />
      <AllRides tabLabel="All Rides" />
      <RidesSignup tabLabel="Signup" />
    </ScrollableTabView>
  )
}