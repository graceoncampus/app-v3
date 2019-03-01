import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Divider, Caption, Spinner, Subtitle, ScrollView, Tile, Title } from '@shoutem/ui';
import { Screen } from '../../components';
import { headerStyles } from '../../theme';
import { Menu } from '../../icons';
import firebase from 'react-native-firebase';

export default class AllRides extends Component {
  static navigationOptions = ({ navigation }) => ({
    drawer: () => ({
      label: 'AllRides',
    }),
    title: 'ALL RIDES',
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
    this.state = {
        allRidesData: {},
        loading: true,
        isRidesUp: null,
    }
    this.ref = firebase.firestore().collection('rides').doc('current_rides').collection('cars');
    this.unsubscribe = null;
}

componentDidMount() { this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate); }

componentWillUnmount() { this.unsubscribe(); }

onCollectionUpdate = (querySnapshot) => {
  const iMax = querySnapshot.docs.length;
  if (querySnapshot.docs != 0) {
    var i = 0;
    const allRidesData = new Array(iMax);
    for (; i < iMax; i += 1) {
      const doc = querySnapshot.docs[i];
      allRidesData[i] = doc.data().car;
    }
    this.setState({
        allRidesData,
        loading: false,
        isRidesUp: true,
    });
  }
  else {
    this.setState({
      isRidesUp: false,
      loading: false,
    });
  }
}

renderRides() {
  const { allRidesData } = this.state;
  return allRidesData.map((car, i) => {
    var riderNames = [];
    for(i = 1; i < car.length; i++) {
      riderNames.push(car[i].name);
    };
    if (i % 2 === 0) {
      return (
        <View style={{ paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#fff' }} styleName='horizontal space-between v-start' key={i}>
          <Subtitle style={{ textAlign: 'right' }}>{car[0].name}</Subtitle>
          <Subtitle style={{ textAlign: 'right' }}>{riderNames.join('\n')}</Subtitle>
        </View>
      );
    }
    return (
      <View style={{ paddingVertical: 10, paddingHorizontal: 15 }} styleName='horizontal space-between v-start' key={i}>
        <Subtitle style={{ textAlign: 'right' }}>{car[0].name}</Subtitle>
        <Subtitle style={{ textAlign: 'right' }}>{riderNames.join('\n')}</Subtitle>
      </View>
    );
  });
}

render = () => {
  if (!this.state.loading && this.state.isRidesUp) {
    return (
      <Screen>
        <Divider styleName="section-header">
        <Caption>Driver</Caption>
          <Caption>Riders</Caption>
          </Divider>
          <ScrollView>
            {this.renderRides()}
          </ScrollView>
        </Screen>
      );
    }
  else if (!this.state.loading && !this.state.isRidesUp) {
    return (
      <Screen>
        <Tile style={{ paddingBottom: 0, flex: 0.8, backgroundColor: 'transparent' }} styleName='text-centric'>
        <Title>Rides for this Sunday are not up yet!</Title>
                </Tile>
              </Screen>
    );
  }
    return (
      <Screen>
        <View styleName='vertical fill-parent v-center h-center'>
          <Spinner size="large" />
          </View>
      </Screen>
    );
  }
}