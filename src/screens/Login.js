import React, { Component } from 'react';
import {
  TextInput, AsyncStorage, TouchableOpacity, View, ActivityIndicator
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';
import {
  Text, Button, Divider, Screen
} from '../components';
import globalStyles, { variables } from '../theme';
import { Logo } from '../icons';

export default class Login extends Component {
  static navigationOptions = () => ({
    header: null
  });

  state = {
    email: '',
    password: '',
    submitted: false,
    loading: false
  };

  onButtonPress = () => {
    AsyncStorage.setItem('sign_up', 'false');
    const { email, password } = this.state;
    this.setState({ submitted: true });
    if (email !== '' && password !== '') {
      this.setState({ loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(error => this.setState({ error: error.message, loading: false }));
    } else {
      this.setState({ loading: false });
    }
  };

  onChangeemail = (email) => {
    this.setState({ submitted: false });
    this.setState({ email });
  };

  onChangepassword = (password) => {
    this.setState({ submitted: false });
    this.setState({ password });
  };

  renderButton = () => {
    const { loading } = this.state;
    const { loading: propsLoading } = this.props;
    if (propsLoading && loading !== false) {
      return (
        <Button style={{ marginVertical: 10, paddingVertical: 15 }}>
          <ActivityIndicator style={{ color: '#fff' }} />
        </Button>
      );
    }

    return (
      <Button style={{ marginVertical: 10 }} onPress={this.onButtonPress}>
        <Text style={globalStyles.buttonText}>LOG IN</Text>
      </Button>
    );
  };

  render() {
    let error = ' ';
    const { navigation } = this.props;
    const {
      focus, email, password, submitted, error: err
    } = this.state;
    if (submitted) {
      if (email === '') {
        error = 'Please enter your email';
      }
      if (password === '') {
        if (error !== ' ') {
          error += ' and password';
        } else error = 'Please enter your password';
      }
    }
    if (err) {
      if (err.includes('password is invalid')) error = 'Looks like that password is invalid';
      else if (err.includes('no user record')) error = "That account doesn't exist, sign up below to create one now.";
      else error = err;
    }
    return (
      <Screen>
        <KeyboardAwareScrollView>
          <View style={globalStyles.tile}>
            <Logo
              style={{ marginTop: 50, marginBottom: 10 }}
              width={150}
              height={57.75}
              color={variables.primary}
            />
            <Text style={globalStyles.title}>GRACE ON CAMPUS</Text>
            <Text
              style={[
                globalStyles.subtitle,
                globalStyles.textCenter,
                globalStyles.textRed,
                { paddingVertical: 10 }
              ]}
            >
              {error}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 25, flex: 0.56 }}>
            <Text style={globalStyles.label}>Email</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'one' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'one' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={this.onChangeemail}
              returnKeyType="next"
            />
            <Text style={globalStyles.label}>Password</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'two' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'two' })}
              onSubmitEditing={() => {
                this.onButtonPress();
                this.setState({ focus: '' });
              }}
              placeholder="Password"
              value={password}
              secureTextEntry
              onChangeText={this.onChangepassword}
              returnKeyType="done"
            />
            {this.renderButton()}
            <TouchableOpacity
              style={{ paddingBottom: 10 }}
              onPress={() => navigation.navigate('forgotPassword')}
            >
              <View>
                <Text
                  style={[
                    globalStyles.caption,
                    globalStyles.textCenter,
                    globalStyles.textSecondary
                  ]}
                >
                  Forgot password?
                </Text>
              </View>
            </TouchableOpacity>
            <Divider type="line" />
          </View>
          <View
            style={[
              globalStyles.vertical,
              globalStyles.vhCenter,
              globalStyles.vvEnd,
              { paddingHorizontal: 25, flex: 0.14 }
            ]}
          >
            <Button
              clear
              style={{ marginBottom: 10 }}
              onPress={() => navigation.navigate('signUp')}
            >
              <Text style={globalStyles.buttonTextGold}>SIGN UP</Text>
            </Button>
            <Divider />
          </View>
        </KeyboardAwareScrollView>
      </Screen>
    );
  }
}
