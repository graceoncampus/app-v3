import React, { Component } from 'react';
import {
  ActivityIndicator, View, TextInput, TouchableOpacity, Alert
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';
import {
  Button, Divider, Screen, Text
} from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { Back } from '../../icons';

class ChangePassword extends Component {
  /* NAVIGATION SET UP */
  static navigationOptions = ({ navigation }) => ({
    title: 'CHANGE PASSWORD',
    headerLeft: (
      <TouchableOpacity style={{ paddingLeft: 8 }} onPress={() => navigation.goBack()}>
        <Back />
      </TouchableOpacity>
    ),
    headerRight: <View />,
    ...headerStyles
  });

  /* PASSWORD CONSTRUCTOR */
  constructor(props) {
    super(props);

    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    };
    this.change = this.change.bind(this);
    this.onChangeOld = this.onChangeOld.bind(this);
    this.onChangeNew = this.onChangeNew.bind(this);
    this.onChangeConfirm = this.onChangeConfirm.bind(this);
  }

  /* CHANGES PASSWORD */
  onChangeOld(oldPassword) {
    this.setState({ submitted: false, oldPassword });
  }

  onChangeNew(newPassword) {
    this.setState({ submitted: false, newPassword });
  }

  onChangeConfirm(confirmNewPassword) {
    this.setState({ submitted: false, confirmNewPassword });
  }

  /* CHANGE
   * - executes when "CHANGE PASSWORD" is clicked
   * - checks if password is less than six characters long
   * - checks if password and password confirmation match
   * - changes password
   */
  change = () => {
    const { navigation } = this.props;
    this.setState({ loading: true });
    const { oldPassword, newPassword, confirmNewPassword } = this.state;
    if (newPassword.length < 6) {
      this.setState({ newPassword: '', confirmNewPassword: '', loading: false });
      Alert.alert('', 'Password needs to be at least 6 characters');
    } else if (newPassword !== confirmNewPassword) {
      this.setState({ newPassword: '', confirmNewPassword: '', loading: false });
      Alert.alert('', 'Passwords you entered do not match');
    } else {
      const { currentUser } = firebase.auth();
      const { email } = currentUser;
      firebase
        .auth()
        .signInWithEmailAndPassword(email, oldPassword)
        .then(() => {
          firebase
            .auth()
            .currentUser.updatePassword(newPassword)
            .then(
              () => {
                Alert.alert('', 'Password change successful');
                this.setState({ loading: false, submitted: true });
                navigation.goBack();
              },
              () => {
                Alert.alert('', 'Password change failed');
                this.setState({ loading: false });
              }
            );
        })
        .catch(() => {
          Alert.alert('', 'Current password is incorrect');
          this.setState({ loading: false });
        });
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
          <Text style={globalStyles.buttonText}>CHANGED</Text>
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
      <Button style={{ marginBottom: 15 }} onPress={this.change}>
        <Text style={globalStyles.buttonText}>CHANGE PASSWORD</Text>
      </Button>
    );
  };

  /* MAIN PAGE FUNCTION */
  render() {
    const {
      oldPassword, newPassword, confirmNewPassword, focus
    } = this.state;
    return (
      <Screen>
        <KeyboardAwareScrollView
          ref={(c) => {
            this.scroll = c;
          }}
        >
          <View style={{ paddingHorizontal: 25, flex: 0.56 }}>
            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Current Password </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'one' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'one' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter old password"
              value={oldPassword}
              onChangeText={this.onChangeOld}
              returnKeyType="next"
              secureTextEntry
            />
            <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>New Password </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'two' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'two' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={this.onChangeNew}
              returnKeyType="next"
              secureTextEntry
            />
            <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Confirm Password </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'three' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'three' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChangeText={this.onChangeConfirm}
              returnKeyType="next"
              secureTextEntry
            />
            <Divider />
            <View style={{ flex: 0.25 }} styleName="vertical h-center v-end">
              {this.renderButton()}
            </View>
          </View>
          <Divider />
          <Divider />
          <Divider />
        </KeyboardAwareScrollView>
      </Screen>
    );
  }
}

/* NAVIGATION */
export default ChangePassword;
