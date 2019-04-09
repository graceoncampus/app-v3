import React, { Component } from 'react';
import {
  Linking,
  TouchableOpacity,
  ScrollView,
  View,
  ActivityIndicator,
  Image
} from 'react-native';
import firebase from 'react-native-firebase';
import { Text, Screen, Button } from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import {
  Back, Phone, Message, Mail
} from '../../icons';

const image = require('../../images/sample.png');

export default class IndividualUser extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'USER INFORMATION',
    headerLeft: (
      <TouchableOpacity style={{ paddingLeft: 8 }} onPress={() => navigation.goBack()}>
        <Back />
      </TouchableOpacity>
    ),
    headerRight: <View />,
    ...headerStyles
  });

  constructor(props) {
    super(props);
    const thisUserUID = props.navigation.getParam('UID');
    this.ref = firebase
      .firestore()
      .collection('users')
      .doc(thisUserUID);
    this.unsubscribe = null;
    this.state = {
      userData: {},
      loading: true
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (doc) => {
    if (doc.exists) {
      this.setState({
        userData: doc.data(),
        loading: false
      });
    }
  };

  render = () => {
    const { userData: user, loading } = this.state;
    if (!loading && user) {
      const name = `${user.firstName} ${user.lastName}`;
      const { birthday } = user; // NEED TO CONVERT UNIX BIRTHDAY TO REGULAR DATE
      let birthdayString = '';
      if (birthday) {
        birthdayString = `${birthday.getMonth() + 1}/${birthday.getDate()}/${birthday.getFullYear()}`;
      }
      const academic = `Class of ${user.grad}, ${user.major}`;
      return (
        <Screen>
          <ScrollView style={{ backgroundColor: 'white' }}>
            <View
              styleName="vertical h-center"
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                paddingTop: 25,
                paddingBottom: 25
              }}
            >
              <Image
                style={{
                  width: 150,
                  height: 150,
                  marginBottom: 10,
                  borderRadius: 75,
                  borderWidth: 4,
                  borderColor: 'white'
                }}
                source={image}
              />
              <Text style={{paddingBottom: 5 }}>{name}</Text>
              <Text styleName="caption">{academic}</Text>
            </View>
            <View
              styleName="horizontal space-between"
              style={{
                paddingBottom: 10,
                paddingHorizontal: 50,
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <View>
                <Button
                  clear
                  style={{ borderColor: 'transparent' }}
                  onPress={() => Linking.openURL(`tel:${user.phoneNumber}`)}
                >
                  <Phone fill="#ae956b" style={{ marginBottom: 5 }} />
                  <Text styleName="caption" style={{ color: '#ae956b' }}>
                    CALL
                  </Text>
                </Button>
              </View>
              <View>
                <Button
                  clear
                  style={{ borderColor: 'transparent' }}
                  onPress={() => Linking.openURL(`sms:${user.phoneNumber}`)}
                >
                  <Message fill="#ae956b" style={{ marginBottom: 5 }} />
                  <Text styleName="caption" style={{ color: '#ae956b' }}>
                    TEXT
                  </Text>
                </Button>
              </View>
              <View>
                <Button
                  clear
                  style={{ borderColor: 'transparent' }}
                  onPress={() => Linking.openURL(`mailto:${user.email}`)}
                >
                  <Mail fill="#ae956b" style={{ marginBottom: 5 }} />
                  <Text styleName="caption" style={{ color: '#ae956b' }}>
                    EMAIL
                  </Text>
                </Button>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: 'white',
                paddingTop: 25,
                paddingHorizontal: 35,
                paddingBottom: 25
              }}
            >
              <Text styleName="caption">Email</Text>
              <Text styleName="subtitle" style={{ paddingBottom: 10 }}>
                {user.email}
              </Text>
              <Text styleName="caption" style={{ marginTop: 4 }}>
                Phone
              </Text>
              <Text styleName="subtitle" style={{ paddingBottom: 10 }}>
                {user.phoneNumber}
              </Text>
              {user.address !== '' && (
                <View>
                  <Text styleName="caption" style={{ marginTop: 4 }}>
                    Birthday
                  </Text>
                  <Text styleName="subtitle" style={{ paddingBottom: 10 }}>
                    {birthdayString}
                  </Text>
                </View>
              )}
              {user.address !== '' && (
                <View>
                  <Text styleName="caption" style={{ marginTop: 4 }}>
                    Address
                  </Text>
                  <Text styleName="subtitle" style={{ paddingBottom: 10 }}>
                    {user.address}
                  </Text>
                </View>
              )}
              {user.homeChurch !== '' && (
                <View>
                  <Text styleName="caption" style={{ marginTop: 4 }}>
                    Home Church
                  </Text>
                  <Text styleName="subtitle" style={{ paddingBottom: 10 }}>
                    {user.homeChurch}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </Screen>
      );
    }
    return (
      <Screen>
        <View style={[globalStyles.vvCenter, globalStyles.vhCenter, { flex: 1 }]} >
          <ActivityIndicator />
        </View>
      </Screen>
    );
  };
}
