import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import firebase from 'react-native-firebase';
import FastImage from 'react-native-fast-image';
import { Screen, Divider, Text } from '../../components';
import { headerStyles } from '../../theme';
import { Menu } from '../../icons';

export default class Events extends Component {
  static navigationOptions = ({ navigation }) => ({
    drawer: () => ({
      label: 'Events',
    }),
    title: 'EVENTS',
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
    this.ref = firebase.firestore().collection('events').orderBy('startDate', 'desc');
    this.unsubscribe = null;
    this.state = {
      events: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const events = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        key: doc.id,
        ...data
      });
    });
    this.setState({
      events,
      loading: false,
    });
  }

  renderEvent = (event) => {
    const { mobileImage, title } = event.item;
    const { navigation } = this.props;
    return (
      <TouchableOpacity key={event.key} onPress={() => { navigation.navigate('Event', { event: event.item, title }); }}>
        <FastImage
          style={{
            height: 200,
            flex: 1,
            width: Dimensions.get('window').width
          }}
          source={{ uri: mobileImage === '' ? 'https://placeimg.com/640/480/nature' : mobileImage }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }


  render = () => {
    const { loading, events } = this.state;
    if (!loading) {
      return (
        <Screen>
          <FlatList
            data={events}
            renderItem={this.renderEvent}
          />
        </Screen>
      );
    }
    if (!loading && events === []) {
      return (
        <Screen>
          <View style={{ paddingBottom: 0, flex: 0.8, backgroundColor: 'transparent' }} styleName="text-centric">
            <Text>No upcoming events!</Text>
          </View>
        </Screen>
      );
    }
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }
}
