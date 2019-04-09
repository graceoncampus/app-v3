import React, { Component } from 'react';
import {
  View, TextInput, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';
import {
  Button, Text, Divider, Screen
} from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { Back } from '../../icons';

class UserInvite extends Component {
  /* NAVIGATION SET UP */
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('title', 'INVITE USER'),
    headerLeft: (
      <TouchableOpacity style={{ paddingLeft: 8 }} onPress={() => navigation.goBack()}>
        <Back />
      </TouchableOpacity>
    ),
    headerRight: <View />,
    ...headerStyles
  });

  /* EMAIL CONSTRUCTOR */
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      loading: false,
      focus: false,
      submitted: false
    };
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  /* CHANGES EMAIL */
  onChangeEmail(Email) {
    this.setState({ submitted: false, Email });
  }

  /* SIGN UP
   * - executes when "INVITE USER" is clicked
   * - checks email syntax
   * - checks whether the email is already on the invited list or is already a user
   * - pushes email to the goc invitation server
   */
  signUp = () => {
    this.setState({ loading: true });
    const { Email } = this.state;

    const lowercaseEmail = Email.toLowerCase();
    const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    if (re.test(lowercaseEmail)) {
      firebase
        .firestore()
        .collection('invitedUsers')
        .where('email', '==', lowercaseEmail)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            Alert.alert('', 'This email has already been invited');
            this.setState({ loading: false });
          } else {
            firebase
              .firestore()
              .collection('users')
              .where('email', '==', lowercaseEmail)
              .get()
              .then((qs) => {
                if (!qs.empty) {
                  Alert.alert('', 'An account with this email address has already been created');
                  this.setState({ loading: false });
                } else {
                  const details = {
                    token: 'GOC2017!',
                    email: lowercaseEmail
                  };
                  let formBody = [];
                  for (const property in details) {
                    const encodedKey = encodeURIComponent(property);
                    const encodedValue = encodeURIComponent(details[property]);
                    formBody.push(`${encodedKey}=${encodedValue}`);
                  }
                  formBody = formBody.join('&');
                  /* URL below pushes info to the firestore server */
                  fetch('https://graceoncampus.org/invitation', {
                    method: 'post',
                    body: formBody,
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }
                  }).then(() => {
                    Alert.alert(
                      '',
                      'User has been invited. They can now download the app and create an account!'
                    );
                    this.setState({ submitted: true });
                  });
                }
              });
          }
        });
    } else {
      Alert.alert('', 'Please enter a valid email address');
      this.setState({ loading: false });
    }
  };

  /* RENDER BUTTON
   * - asynchronous function (updates constantly)
   * - changes the button to spinner wheel, success or neutral based on state
   */
  renderButton = () => {
    const { submitted, loading } = this.state;
    if (submitted) {
      return (
        <Button success style={{ marginBottom: 15, backgroundColor: '#0ab435' }}>
          <Text style={globalStyles.buttonText}>INVITED</Text>
        </Button>
      );
    }

    if (!submitted && loading) {
      return (
        <Button style={{ marginBottom: 15, paddingVertical: 15 }}>
          <ActivityIndicator color="#fff" />
        </Button>
      );
    }

    return (
      <Button style={{ marginBottom: 15 }} onPress={this.signUp}>
        <Text style={globalStyles.buttonText}>INVITE USER</Text>
      </Button>
    );
  };

  /* MAIN PAGE FUNCTION */
  render() {
    const { Email, focus } = this.state;
    return (
      <Screen>
        <KeyboardAwareScrollView
          ref={(c) => {
            this.scroll = c;
          }}
        >
          <View
            style={[
              globalStyles.textCentric,
              {
                paddingTop: 20,
                paddingBottom: 0,
                flex: 0.8,
                backgroundColor: 'transparent'
              }
            ]}
          >
            <Text styleName="center" style={{ paddingBottom: 8 }}>Invite New User</Text>
            <Text styleName="subtitle center" style={{ paddingHorizontal: 20 }}>
              Invite a new user to create an account.
            </Text>
            <Text styleName="subtitle center" style={{ paddingHorizontal: 20 }}>
              They can use the email you enter to sign up once invited.
            </Text>
          </View>

          <View style={{ paddingHorizontal: 25, flex: 0.56 }}>
            <View style={{ paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Email </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus && globalStyles.focused]}
              onFocus={() => this.setState({ focus: true })}
              onSubmitEditing={() => this.setState({ focus: false })}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="yourbestfriend@gmail.com"
              keyboardType="email-address"
              value={Email}
              onChangeText={this.onChangeEmail}
              returnKeyType="next"
            />

            <Divider />

            <View style={{ flex: 0.25 }} styleName="vertical h-center v-end">
              {this.renderButton()}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Screen>
    );
  }
}

/* NAVIGATION */
export default UserInvite;
