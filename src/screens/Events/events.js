import React, { Component } from 'react';
import {
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Screen, View, ListView, Image, Divider } from '@shoutem/ui';
import { headerStyles } from '../../theme';
import { Menu } from '../../icons';
import {
  ScrollDriver,
} from '@shoutem/animation';
import firebase from 'react-native-firebase';

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
    this.renderRow = this.renderRow.bind(this);
    this.driver = new ScrollDriver();
    this.ref = firebase.firestore().collection('events').orderBy('startDate', 'desc');
    this.unsubscribe = null;
    this.state = {
        events: [],
        loading: true,

    }
  };

  componentDidMount() {
      this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
      this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    var i = 0;
    const iMax = querySnapshot.docs.length;
    const events = new Array(iMax);
    for (; i < iMax; i += 1) {
      const doc = querySnapshot.docs[i];
      events[i] = {
        key: doc.id,
        ...doc.data(),
      };
    }
    this.setState({
      events,
      loading: false,
    });
  }

  renderRow(event) {
    const { key, mobileImage } = event;
    return (
        <TouchableOpacity key={key} onPress={() => { this.props.navigation.navigate('Event', { event, title:event.title }); }} >
        <Image
          styleName="large-banner"
          source={{ uri: mobileImage === '' ? 'https://placeimg.com/640/480/nature' : mobileImage }}
        >
        </Image>
        <Divider styleName='line' />
      </TouchableOpacity>
    );
  }


  render = () => (
      <Screen>
        <ScrollView {...this.driver.scrollViewProps}>
          <ListView
              loading={this.state.loading}
              data={this.state.events}
              renderRow={this.renderRow}
            />
          </ScrollView>
        </Screen>
    );
  }
