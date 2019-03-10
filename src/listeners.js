import firebase from 'react-native-firebase';
import { saveToken } from './utils';

// these callback will be triggered only when app is foreground or background
export default async (navigation) => {
  this.notificationListener = firebase.notifications().onNotification((notification) => {
    firebase.notifications().displayNotification(notification);
  });
  const ref = firebase.firestore().collection('users')
    .doc(firebase.auth().currentUser.uid);
  const snapshot = await ref.get();
  if (snapshot.exists) {
    const { permissions } = snapshot.data();
    this.notificationOpenedListener = firebase.notifications()
      .onNotificationOpened((notificationOpen) => {
        const notif = notificationOpen.notification;
        navigation.navigate(notif.data.targetScreen, {
          title: notif.data.title,
          admin: permissions.admin,
          announcement: {
            role: notif.data.role,
            title: notif.data.title,
            post: notif.data.post,
            date: notif.data.date,
          },
        });
      });
  }
  this.onTokenRefreshListener = firebase.messaging().onTokenRefresh((token) => {
    saveToken(token);
  });

  this.messageListener = firebase.messaging().onMessage((message) => {
    if (message.data && message.data.title) {
      let notification = new firebase.notifications.Notification();
      notification = notification
        .setTitle(message.data.title)
        .setBody(message.data.body)
        .setData(message.data);
      notification.android.setPriority(firebase.notifications.Android.Priority.High);
      notification.android.setChannelId('test-channel');
      firebase.notifications().displayNotification(notification);
    }
  });
};


// import firebase from 'react-native-firebase';
// import AppState from 'react-native';
// import { saveToken, setCurrentUserData } from './utils';
// let myAppState;
// // these callback will be triggered only when app is foreground or background
// export default async (navigation, ref) => {
//   AppState.addEventListener('change', (nextAppState) => {
//     if((!myAppState || !myAppState.match(/inactive|background/)) && nextAppState === 'active') {
//       ref.get().then((snapshot) => {
//         const { permissions, readList } = snapshot.data();
//         setCurrentUserData(snapshot.data()); 

//       }).catch(err => console.warn(err));
//     }
//     myAppState = nextAppState;
//   })
//   this.notificationListener = firebase.notifications().onNotification((notification) => {
//     firebase.notifications().displayNotification(notification);
//   });
//   const ref = firebase.firestore().collection('users')
//     .doc(firebase.auth().currentUser.uid);
//   const snapshot = await ref.get();
//   const { permissions } = snapshot.data();
//   this.notificationOpenedListener = firebase.notifications()
//     .onNotificationOpened((notificationOpen) => {
//       const notif = notificationOpen.notification;
//       navigation.navigate(notif.data.targetScreen, {
//         title: notif.data.title,
//         admin: permissions.admin,
//         announcement: {
//           role: notif.data.role,
//           title: notif.data.title,
//           post: notif.data.post,
//           date: notif.data.date,
//         },
//       });
//     });


//   this.onTokenRefreshListener = firebase.messaging().onTokenRefresh((token) => {
//     saveToken(token);
//   });

//   this.messageListener = firebase.messaging().onMessage((message) => {
//     if (message.data && message.data.title) {
//       let notification = new firebase.notifications.Notification();
//       notification = notification
//         .setTitle(message.data.title)
//         .setBody(message.data.body)
//         .setData(message.data);
//       notification.android.setPriority(firebase.notifications.Android.Priority.High);
//       notification.android.setChannelId('test-channel');
//       firebase.notifications().displayNotification(notification);
//     }
//   });
// };
