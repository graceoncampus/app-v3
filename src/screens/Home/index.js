import React, { Component } from 'react';
import {
  View, TouchableOpacity, ActivityIndicator, FlatList
} from 'react-native';
import firebase from 'react-native-firebase';

import Announcement from './announcement';
import { Menu, New } from '../../icons';
import { Screen, Text } from '../../components';
import globalStyles, { headerStyles } from '../../theme';

export default class Home extends Component {
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
        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.navigate('EditPost')}>
          <New />
        </TouchableOpacity>
      ),
      ...headerStyles,
    });
  }


  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('announcements').orderBy('date', 'desc');
    this.userRef = firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid);
    this.unsubscribe = null;
    this.state = {
      posts: [],
      readList: props.navigation.getParam('readList', []) || [],
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
    const { readList } = this.state;
    const posts = [];
    querySnapshot.forEach((post) => {
      const data = post.data();
      posts.push({
        key: post.id,
        ...data,
        isRead: readList.includes(post.id)
      });
    });
    this.setState({
      posts,
      loading: false,
    });
    firebase.notifications().setBadge(posts.length - readList.length);
  }

  readListUpdate = (querySnapshot) => {
    const { posts, readList } = this.state;
    this.setState({ readList: querySnapshot.data().readList || [] });
    firebase.notifications().setBadge(posts.length - readList.length);
  }


  setRead = (announcement) => {
    const { navigation } = this.props;
    const { readList } = this.state;
    const { admin } = navigation.getParam('permissions', {
      admin: 0,
    });
    if (!announcement.isRead) {
      firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
        readList: readList.concat(announcement.key),
      });
    }
    navigation.navigate('Post', { admin, announcement });
  };

  renderAnnouncement = announcement => (
    <Announcement
      key={announcement.key}
      setRead={this.setRead}
      announcement={announcement.item}
    />
  )

  render() {
    const { loading, posts } = this.state;
    return (
      <Screen safeViewDisabled>
        {
          !loading ? (
            posts.length > 0 ? (
              <Screen safeViewDisabled>
                <FlatList data={posts} renderItem={this.renderAnnouncement} />
              </Screen>
            )
            : (
              <View style={[
                globalStyles.vertical,
                globalStyles.vvCenter,
                globalStyles.vhCenter,
                globalStyles.fillParent,
              ]}
              >
                <Text>No new announcements!</Text>
              </View>
            )
          )
            : (
              <View style={[
                globalStyles.vertical,
                globalStyles.vvCenter,
                globalStyles.vhCenter,
                globalStyles.fillParent,
              ]}
              >
                <ActivityIndicator />
              </View>
            )
        }
      </Screen>
    );
  }
}
