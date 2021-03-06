import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  AppRegistry,
  SafeAreaView,
  AsyncStorage,
  Platform,
  Animated,
  Easing
} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import SplashScreen from 'react-native-splash-screen';
import {
  createSwitchNavigator,
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer
} from 'react-navigation';
import firebase from 'react-native-firebase';
import codePush from 'react-native-code-push';

import globalStyles, { variables } from './src/theme';
import Login from './src/screens/Login';
import Main from './src/screens/Home';
import Sermons from './src/screens/Sermons';
import Sermon from './src/screens/Sermon';
import events from './src/screens/Events/events';
import event from './src/screens/Events/event';
import classes from './src/screens/Classes/classes';
import calendar from './src/screens/Calendar';
import classDetails from './src/screens/Classes/class';
import classEnroll from './src/screens/Classes/classEnrollment';
import IndividualUser from './src/screens/Roster/individualUser';
import Post from './src/screens/Post';
import EditPost from './src/screens/EditPost';
import Settings from './src/screens/Settings/settings';
import UserInvite from './src/screens/Settings/userinvite';
import ChangePassword from './src/screens/Settings/changepassword';
import ForgotPassword from './src/screens/ForgotPassword';
import SignUp from './src/screens/SignUp';
import blogs from './src/screens/Blog/blogs';
import blog from './src/screens/Blog/blog';
import RidesTab from './src/screens/Rides/ridesTab';
import { saveToken, setCurrentUserData } from './src/utils';
import { Logo } from './src/icons';
import registerAppListener from './src/listeners';
import store from './src/store';

function fromLeft(duration = 500) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ layout, position, scene }) => {
      const { index } = scene;
      const { initWidth } = layout;

      const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [-initWidth, 0, 0]
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      });

      return { opacity, transform: [{ translateX }] };
    }
  };
}

function fromTop(duration = 500) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ layout, position, scene }) => {
      const { index } = scene;
      const { initHeight } = layout;

      const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [-initHeight, 0, 0]
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      });

      return { opacity, transform: [{ translateY }] };
    }
  };
}

function fromBottom(duration = 500) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ layout, position, scene }) => {
      const { index } = scene;
      const { initHeight } = layout;

      const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [initHeight, 0, 0]
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      });

      return { opacity, transform: [{ translateY }] };
    }
  };
}

const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  // Custom transitions go there
  if (
    prevScene
    && prevScene.route.routeName === 'Serm'
    && nextScene.route.routeName === 'SingleSermon'
  ) {
    return fromBottom();
  } if (
    prevScene
    && prevScene.route.routeName === 'SingleSermon'
    && nextScene.route.routeName === 'Serm'
  ) {
    return fromTop();
  }
  return fromLeft();
};

firebase.firestore().settings({
  persistence: true,
  ssl: true
});

const homeStack = createStackNavigator({
  Home: { screen: Main },
  Post: { screen: Post },
  Preview: { screen: Post },
  EditPost: { screen: EditPost }
});

const sermonStack = createStackNavigator(
  {
    Serm: { screen: Sermons },
    SingleSermon: { screen: Sermon }
  },
  {
    transitionConfig: nav => handleCustomTransition(nav)
  }
);

const eventsStack = createStackNavigator({
  Events: { screen: events },
  Event: { screen: event }
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
});

const settingsStack = createStackNavigator({
  Setting: { screen: Settings },
  userInvite: { screen: UserInvite },
  changePassword: { screen: ChangePassword }
});

const blogStack = createStackNavigator({
  Blog: { screen: blogs },
  Blo: { screen: blog }
});

const calendarStack = createStackNavigator({
  Calendar: { screen: calendar }
});

const AppStack = createDrawerNavigator(
  {
    Home: {
      screen: homeStack,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Rides: {
      screen: ridesStack,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Sermons: sermonStack,
    Calendar: {
      screen: calendarStack,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Events: {
      screen: eventsStack,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Classes: {
      screen: classesStack,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Blog: {
      screen: blogStack,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Settings: {
      screen: settingsStack,
      navigationOptions: {
        gesturesEnabled: false
      }
    }
  },
  {
    drawerWidth: 160,
    contentOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor: variables.primary,
      labelStyle: {
        fontFamily: 'Akkurat',
        fontSize: 16
      },
      style: {
        height: 'auto',
        ...Platform.select({
          android: { paddingTop: StatusBar.currentHeight }
        })
      }
    }
  }
);

const AuthStack = createStackNavigator(
  {
    Auth: {
      screen: Login,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    forgotPassword: {
      screen: ForgotPassword
    },
    signUp: {
      screen: SignUp
    }
  }
);

class AuthLoadingScreen extends React.Component {
  async componentDidMount() {
    const { navigation } = this.props;
    firebase.auth().onAuthStateChanged(async (user) => {
      const signedUp = await AsyncStorage.getItem('sign_up');
      const token = await AsyncStorage.getItem('token');
      if (user && (!signedUp || signedUp === 'false')) {
        const firstLaunch = await AsyncStorage.getItem('first');
        const hasPermission = await firebase.messaging().hasPermission();
        const ref = firebase
          .firestore()
          .collection('users')
          .doc(user.uid);
        if (hasPermission && !token) {
          firebase
            .messaging()
            .getToken()
            .then(Token => saveToken(Token));
        }
        if (firstLaunch !== 'true') {
          if (!hasPermission) {
            try {
                await firebase.messaging().requestPermission();
                firebase
                  .messaging()
                  .getToken()
                  .then(Token => saveToken(Token))
                  .catch(e => console.log(e));
            } catch (error) {
              console.log(error);
            }            
          }
          // const channel = new firebase.notifications.Android.Channel(
          //   'announcements',
          //   'announcements',
          //   firebase.notifications.Android.Importance.Max
          // ).setDescription('announcements');
          // firebase.notifications().android.createChannel(channel);
          AsyncStorage.setItem('first', 'true');
        }
        firebase.messaging().subscribeToTopic('announcements');
        registerAppListener(navigation, ref);
        ref
          .get()
          .then((snapshot) => {
            if (snapshot.data() !== undefined) {
              const { permissions, readList } = snapshot.data();
              setCurrentUserData(snapshot.data());
              SplashScreen.hide();
              navigation.navigate('Home', {
                permissions,
                readList
              });
            }
          })
          .catch(err => console.warn(err));
      } else {
        SplashScreen.hide();
        navigation.navigate('Auth');
      }
    });
  }

  render() {
    return (
      <SafeAreaView
        style={[
          globalStyles.vvCenter,
          globalStyles.vhCenter,
          { backgroundColor: variables.primary, flex: 1 }
        ]}
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Logo style={{ marginBottom: 30 }} width={150} height={57.75} color="#fff" />
        <ActivityIndicator color="#fff" />
      </SafeAreaView>
    );
  }
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME
};

const RootStack = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
);

const AppContainer = createAppContainer(RootStack);
class Root extends React.Component {
  componentDidMount() {
    codePush.notifyAppReady();
  }
  render() {
    return <AppContainer />
  }
}
Root = codePush(codePushOptions)(Root);
AppRegistry.registerComponent('GOC', () => Root);
TrackPlayer.registerPlaybackService(() => async () => {
  TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
  TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
  TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.destroy());
  TrackPlayer.addEventListener('remote-next', () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener('remote-previous', () => TrackPlayer.skipToPrevious());
  TrackPlayer.addEventListener('playback-track-changed', async (data) => {
    if (data.nextTrack) {
      const trackData = await TrackPlayer.getTrack(data.nextTrack);
      store.setState(trackData);
    }
  });
  TrackPlayer.addEventListener('playback-state', (data) => {
    store.setState({ playbackState: data.state });
  });
});
