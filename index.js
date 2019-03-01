import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  AppRegistry,
  SafeAreaView,
  AsyncStorage,
  Platform,
} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import SplashScreen from 'react-native-splash-screen';
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';
import globalStyles, { variables } from './src/theme';
import Login from './src/screens/Login';
import Main from './src/screens/Home';
import Sermons from './src/screens/Sermons';
import events from './src/screens/Events/events';
import event from './src/screens/Events/event';
import classes from './src/screens/Classes/classes';
import classDetails from './src/screens/Classes/class';
import classEnroll from './src/screens/Classes/classEnrollment';
import IndividualUser from './src/screens/Roster/individualUser';
import Post from './src/screens/Post';
import EditPost from './src/screens/EditPost';
import Settings from './src/screens/Settings/settings';
import UserInvite from './src/screens/Settings/userinvite';
import ChangePassword from './src/screens/Settings/changepassword';
import blogs from './src/screens/Blog/blogs';
import blog from './src/screens/Blog/blog';
import RidesTab from './src/screens/Rides/ridesTab';
import { saveToken, setCurrentUserData } from './src/utils';
import { Logo } from './src/icons';
import registerAppListener from './src/listeners';
import store from './src/store';


firebase.firestore().settings({
  persistence: true,
  ssl: true,
});

const homeStack = createStackNavigator({
  Home: { screen: Main },
  Post: { screen: Post },
  Preview: { screen: Post },
  EditPost: { screen: EditPost },
});

const sermonStack = createStackNavigator({
  Serm: { screen: Sermons },
});

const eventsStack = createStackNavigator({
  Events: { screen: events },
  Event: { screen: event },
});

const classesStack = createStackNavigator({
  Classes: { screen: classes },
  Class: { screen: classDetails },
  ClassEnrollment: { screen: classEnroll },
  UserInformation: { screen: IndividualUser }
});

const ridesStack = createStackNavigator({
  RideTab: { screen: RidesTab },
  UserInformation: { screen: IndividualUser }
})

const settingsStack = createStackNavigator({
  Setting: { screen: Settings },
  userInvite: { screen: UserInvite },
  changePassword: { screen: ChangePassword }
});

const blogStack = createStackNavigator({
  Blog: { screen: blogs },
  Blo: { screen: blog },
})


const AppStack = createDrawerNavigator({
  Home: {
    screen: homeStack,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  Sermons: sermonStack,
  Events: {
    screen: eventsStack,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  Classes: {
    screen: classesStack,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  Blog: {
    screen: blogStack,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  Rides: {
    screen: ridesStack,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  // Connect: {
  //   screen: connectStack,
  //   navigationOptions: {
  //     gesturesEnabled: false,
  //   },
  // },
  // Leadership: {
  //   screen: leadershipStack,
  //   navigationOptions: {
  //     gesturesEnabled: false,
  //   },
  // Roster: {
  //   screen: rosterStack,
  //   navigationOptions: {
  //     gesturesEnabled: false,
  //   },
  // },
  Settings: {
    screen: settingsStack,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
}, {
  drawerWidth: 160,
  contentOptions: {
    activeTintColor: '#fff',
    activeBackgroundColor: variables.primary,
    labelStyle: {
      fontFamily: 'Akkurat',
    },
    style: {
      height: 'auto',
      ...Platform.select({
        android: { paddingTop: StatusBar.currentHeight },
      }),
    },
  },
});

const AuthStack = createStackNavigator({
  Auth: {
    screen: Login,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  // ForgotPassword: {
  //   screen: ForgotPassword,
  // },
  // Signup: {
  //   screen: Signup,
  // },
}, {
  headerMode: 'none',
});

class AuthLoadingScreen extends React.Component {
  async componentDidMount() {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const firstLaunch = await AsyncStorage.getItem('first');
        const ref = firebase.firestore().collection('users').doc(user.uid);
        if (firstLaunch !== 'true') {
          firebase.messaging().hasPermission().then(hasPermission =>
            !hasPermission && firebase.messaging().requestPermission());
          firebase.messaging().getToken().then(Token => (saveToken(Token)));
          const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
            .setDescription('My apps test channel');
          firebase.notifications().android.createChannel(channel);
          AsyncStorage.setItem('first', 'true');
        }
        registerAppListener(this.props.navigation, ref);
        ref.get().then((snapshot) => {
          const { permissions, readList } = snapshot.data();
          setCurrentUserData(snapshot.data()); 
          SplashScreen.hide();
          this.props.navigation.navigate('Home', {
            permissions,
            readList,
          });
        }).catch(err => console.warn(err));
      } else {
        SplashScreen.hide();
        this.props.navigation.navigate('Auth');
      }
    });
  }

  render() {
    return (
      <SafeAreaView style={[globalStyles.vvCenter, globalStyles.vhCenter, { backgroundColor: variables.primary, flex: 1 }]}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
        <Logo style={{ marginBottom: 30 }} width={150} height={57.75} color="#fff" />
        <ActivityIndicator />
      </SafeAreaView>
    );
  }
}

const RootStack = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

AppRegistry.registerComponent('GOC', () => RootStack);

TrackPlayer.registerEventHandler(async (data) => {
  if (data.type === 'playback-track-changed') {
    if (data.nextTrack) {
      const { title, artist } = await TrackPlayer.getTrack(data.nextTrack);
      store.setState({ title, artist, id: data.nextTrack });
    }
  } else if (data.type === 'remote-play') {
    TrackPlayer.play();
  } else if (data.type === 'remote-pause') {
    TrackPlayer.pause();
  } else if (data.type === 'remote-next') {
    TrackPlayer.skipToNext();
  } else if (data.type === 'remote-previous') {
    TrackPlayer.skipToPrevious();
  } else if (data.type === 'playback-state') {
    store.setState({ playbackState: data.state });
  }
});
