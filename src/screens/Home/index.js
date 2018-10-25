import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Spinner } from '@shoutem/ui';
import firebase from 'react-native-firebase';

import Announcement from './announcement';
import { Menu, New } from '../../icons';
import { Screen } from '../../components';
import globalStyles, { headerStyles } from '../../theme';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('announcements').orderBy('date', 'desc');
    this.userRef = firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid);
    this.unsubscribe = null;
    this.state = {
      posts: [],
      readList: props.navigation.getParam('readList', []) || [],
      admin: false,
      loading: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    this.unsubscribeRead = this.userRef.onSnapshot(this.readListUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribeRead();
  }

  onCollectionUpdate = (querySnapshot) => {
    let i = 0;
    const iMax = querySnapshot.docs.length;
    const posts = new Array(iMax);
    for (; i < iMax; i += 1) {
      const doc = querySnapshot.docs[i];
      posts[i] = {
        key: doc.id,
        ...doc.data(),
      };
    }
    this.setState({
      posts,
      loading: false,
    });
    firebase.notifications().setBadge(this.state.posts.length - this.state.readList.length);
  }

  readListUpdate = (querySnapshot) => {
    this.setState({ readList: querySnapshot.data().readList || [] });
    firebase.notifications().setBadge(this.state.posts.length - this.state.readList.length);
  }
  // async componentDidMount() {
  //   const perms = await AsyncStorage.getItem('perms')
  //   const readList = await AsyncStorage.getItem('read')
  //   .then((perms) => {

  //   }).catch(() => (console.warn('no perms')));
  //   .then(readList => this.setState({ readList: JSON.parse(readList) });
  //     else this.setState({ readList: [] });
  //   }).catch(() => (console.warn('none read')));
  // }

  static navigationOptions = ({ navigation }) => {
    const { admin } = navigation.getParam('permissions', {
      admin: 0,
    });
    return ({
      drawer: () => ({
        label: 'Announcements',
      }),
      title: 'ANNOUNCEMENTS',
      headerLeft: (
        <TouchableOpacity style={{ padding: 15 }} onPress={() => navigation.openDrawer()}>
          <Menu />
        </TouchableOpacity>
      ),
      headerRight: admin && (
        <TouchableOpacity style={{ padding: 15 }} onPress={() => navigation.navigate('EditPost')}>
          <New />
        </TouchableOpacity>
      ),
      ...headerStyles,
    });
  }

  isRead = (announcement) => {
    let result = false;
    const { readList } = this.state;
    let i = 0;
    const iMax = readList.length;
    for (; i < iMax; i += 1) {
      if (readList[i] === announcement.key) result = true;
    }
    return result;
  }

  setRead = (announcement) => {
    const { admin } = this.props.navigation.getParam('permissions', {
      admin: 0,
    });
    if (this.isRead(announcement)) {
      this.props.navigation.navigate('Post', { admin, announcement, title: announcement.title });
    } else {
      firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
        readList: this.state.readList.concat(announcement.key),
      });
      this.props.navigation.navigate('Post', { admin, announcement, title: announcement.title });
    }
  };

  renderRows = () => {
    const { posts } = this.state;
    let i = 0;
    const iMax = posts.length;
    const res = new Array(iMax);
    for (; i < iMax; i += 1) {
      const announcement = posts[i];
      res[i] = (
        <Announcement
          key={announcement.key}
          setRead={this.setRead}
          announcement={announcement}
          isRead={this.isRead(announcement)}
        />
      );
    }
    return res;
  }

  render() {
    if (!this.state.loading) {
      return (
        <Screen>
          <ScrollView>
            { this.renderRows() }
          </ScrollView>
        </Screen>
      );
    }
    return (
      <Screen>
        <View style={[
          globalStyles.vertical,
          globalStyles.vvCenter,
          globalStyles.vhCenter,
          globalStyles.fillParent,
        ]}>
          <Spinner size="large" />
        </View>
      </Screen>
    );
  }
}
