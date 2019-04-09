import React, { Component } from 'react';
import {
  View, TextInput, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';
import {
  Button, Divider, Screen, Text
} from '../components';
import globalStyles, { headerStyles } from '../theme';
import { Back } from '../icons';

export default class ForgotPassword extends Component {
  /* NAVIGATION SET UP */
  static navigationOptions = ({ navigation }) => ({
    title: 'FORGOT PASSWORD',
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
      submitted: false
    };
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.reset = this.reset.bind(this);
  }

  /* CHANGES EMAIL */
  onChangeEmail(Email) {
    this.setState({ submitted: false, Email });
  }

  /* RESET
   * - resets email
   */
  reset = () => {
    const { navigation } = this.props;
    this.setState({ loading: true });
    const { Email } = this.state;
    const auth = firebase.auth();
    auth
      .sendPasswordResetEmail(Email)
      .then(() => {
        Alert.alert('', 'A password reset email has been sent to your email address!');
        this.setState({ submitted: true });
        navigation.goBack();
      })
      .catch(() => {
        Alert.alert('', 'An account with this email address has not been created before');
        this.setState({ loading: false });
      });
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
          <Text style={globalStyles.buttonText}>EMAIL SENT!</Text>
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
      <Button style={{ marginBottom: 15 }} onPress={this.reset}>
        <Text style={globalStyles.buttonText}>RESET</Text>
      </Button>
    );
  };

  /* MAIN PAGE FUNCTION */
  render() {
    const { error } = this.props;
    const { focus } = this.state;
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
            <Text styleName="subtitle center">
              Please enter the email address for your GOC account. You'll receive 
              an email with instructions on how to reset your password.
            </Text>
            <Text styleName="subtitle center" style={{ color: '#b40a34', paddingVertical: 10 }}>
              {error}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 25, flex: 0.56 }}>
            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Email</Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus && globalStyles.focused]}
              onFocus={() => this.setState({ focus: true })}
              onSubmitEditing={() => this.setState({ focus: false })}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="gocwebteam@gmail.com"
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
