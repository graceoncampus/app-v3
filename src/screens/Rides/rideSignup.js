import React, { Component } from 'react';
import {
  TouchableOpacity, TextInput, View, Alert, ActivityIndicator
} from 'react-native';
import CheckBox from 'react-native-check-box';
import firebase from 'react-native-firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  Text, Screen, Button, Divider
} from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { getCurrentUserData } from '../../utils';
import { Menu, Check } from '../../icons';

export default class RideSignup extends Component {
  static navigationOptions = ({ navigation }) => ({
    drawer: () => ({
      label: 'RideSignup'
    }),
    title: 'RIDE SIGNUP',
    headerLeft: (
      <TouchableOpacity style={{ padding: 15 }} onPress={() => navigation.openDrawer()}>
        <Menu />
      </TouchableOpacity>
    ),
    headerRight: <View />,
    ...headerStyles
  });

  constructor(props) {
    super(props);
    const thisUserData = getCurrentUserData();
    const {
      firstName, lastName, address, phoneNumber, email, onlineSignUp
    } = thisUserData;
    let localSignupState = null;
    if (onlineSignUp === undefined) {
      localSignupState = false;
    } else {
      localSignupState = onlineSignUp;
    }
    this.state = {
      driver: false,
      morning: false,
      evening: false,
      staying: false,
      name: `${firstName} ${lastName}`,
      address,
      number: phoneNumber,
      comments: '',
      email,
      error: false,
      loading: false,
      signedUp: localSignupState
    };
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeNumber = this.onChangeNumber.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
  }

  onChangeAddress = address => this.setState({ address });

  onChangeNumber = number => this.setState({ number });

  onChangeComment = comments => this.setState({ comments });

  onChangeEmail = email => this.setState({ email });

  onChangeName = name => this.setState({ name });

  signUp = () => {
    this.setState({ error: false, loading: true });
    const {
      name,
      address,
      number,
      comments,
      email,
      morning,
      evening,
      staying,
      driver
    } = this.state;
    const { currentUser } = firebase.auth();
    let { uid } = currentUser;
    let time = '';
    time += morning ? 'Morning, ' : '';
    time += evening ? 'Evening, ' : '';
    time += staying ? 'Staying' : '';
    if (name === '' || address === '' || number === '' || email === '') {
      Alert.alert('', 'Please fill out all fields');
      return this.setState({ error: true });
    }
    if (time === '') {
      Alert.alert('', 'Please select which services you would like to attend');
      return this.setState({ error: true });
    }
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles'
    });
    if (currentUser.email !== email) {
      uid = '';
    }
    const postData = {
      name,
      address,
      number,
      comments,
      email,
      driver,
      morning,
      evening,
      staying,
      uid,
      timestamp
    };
    this.ref = firebase.firestore().collection('ridesSignup');
    this.ref2 = firebase
      .firestore()
      .collection('users')
      .doc(`${uid}`);
    this.ref.add(postData).then(() => this.ref2
      .update({ onlineSignUp: true })
      .then(() => this.setState({
        signedUp: true,
        morning: false,
        evening: false,
        staying: false,
        loading: false,
        name: '',
        address: '',
        number: '',
        comments: '',
        email: ''
      }))
      .catch(() => console.log("didn't update user")));
  };

  renderButton = () => {
    const { loading, error } = this.state;
    if (loading && !error) {
      return (
        <Button style={{ paddingVertical: 15 }}>
          <ActivityIndicator color="#fff" />
        </Button>
      );
    }
    return (
      <Button style={{ marginBottom: 15 }} onPress={this.signUp}>
        <Text style={globalStyles.buttonText}>SIGN UP</Text>
      </Button>
    );
  };

  render = () => {
    const {
      name,
      address,
      number,
      comments,
      email,
      focus,
      morning,
      evening,
      staying,
      driver,
      signedUp
    } = this.state;
    return signedUp ? (
      <Screen>
        <View style={[globalStyles.vvCenter, globalStyles.vhCenter, { flex: 1, marginTop: -50 }]}>
          <Check fill="#ae956b" style={{ paddingBottom: 45 }} width={30} />
          <Text styleName="center subtitle" style={{ paddingHorizontal: 50 }}>
            You've successfully signed up for a ride online!
          </Text>
        </View>
      </Screen>
    ) : (
      <Screen>
        <KeyboardAwareScrollView extraHeight={20}>
          <View
            style={{
              paddingTop: 20,
              paddingBottom: 0,
              flex: 0.8,
              backgroundColor: 'transparent'
            }}
            styleName="text-centric"
          >
            <Text styleName="center subtitle" style={{ paddingHorizontal: 50, paddingBottom: 20 }}>
              Sign up for a ride to church for this coming Sunday
            </Text>
          </View>
          <View style={{ paddingHorizontal: 25, flex: 0.56 }}>
            <View style={{ paddingBottom: 4, flexDirection: 'row' }}>
              <Text styleName="paragraph">Name</Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'one' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'one' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Chris Gee"
              keyboardType="email-address"
              value={name}
              onChangeText={this.onChangeName}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text styleName="paragraph">Address</Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'two' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'two' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Hedrick Hall"
              keyboardType="email-address"
              value={address}
              onChangeText={this.onChangeAddress}
              returnKeyType="next"
            />

            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text styleName="paragraph">Phone Number</Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'three' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'three' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="(310)694-5216"
              keyboardType="phone-pad"
              value={number}
              onChangeText={this.onChangeNumber}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text styleName="paragraph">Email</Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'four' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'four' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="gocrides@gmail.com"
              keyboardType="email-address"
              value={email}
              onChangeText={this.onChangeEmail}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text styleName="paragraph">Comments</Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'five' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'five' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Jireh please"
              value={comments}
              onChangeText={this.onChangeComment}
              returnKeyType="next"
            />
            <CheckBox
              style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 10 }}
              onClick={() => this.setState({ driver: !driver })}
              isChecked={driver}
              checkBoxColor="#ae956b"
              leftText="Driver"
              leftTextStyle={{
                fontFamily: 'Akkurat',
                fontStyle: 'normal',
                fontWeight: 'normal',
                color: '#3a3f4b',
                fontSize: 15,
                lineHeight: 18
              }}
            />
            <CheckBox
              style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 10 }}
              onClick={() => this.setState({ morning: !morning })}
              isChecked={morning}
              leftText="Morning (8:30 AM - 12:00 PM)"
              checkBoxColor="#ae956b"
              leftTextStyle={{
                fontFamily: 'Akkurat',
                fontStyle: 'normal',
                fontWeight: 'normal',
                color: '#3a3f4b',
                fontSize: 15,
                lineHeight: 18
              }}
            />
            <CheckBox
              style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 10 }}
              onClick={() => this.setState({ staying: !staying })}
              isChecked={staying}
              checkBoxColor="#ae956b"
              leftText="Staying (8:30 AM - 7:30 PM)"
              leftTextStyle={{
                fontFamily: 'Akkurat',
                fontStyle: 'normal',
                fontWeight: 'normal',
                color: '#3a3f4b',
                fontSize: 15,
                lineHeight: 18
              }}
            />
            <CheckBox
              style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 10 }}
              onClick={() => this.setState({ evening: !evening })}
              isChecked={evening}
              checkBoxColor="#ae956b"
              leftText="Evening (6:00 PM - 7:30 PM)"
              leftTextStyle={{
                fontFamily: 'Akkurat',
                fontStyle: 'normal',
                fontWeight: 'normal',
                color: '#3a3f4b',
                fontSize: 15,
                lineHeight: 18
              }}
            />
            <Divider />
            {this.renderButton()}
          </View>
        </KeyboardAwareScrollView>
      </Screen>
    );
  };
}
