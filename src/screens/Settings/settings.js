import React from 'react';
import {
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';
import {
  Button, Divider, Screen, Text
} from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { Menu } from '../../icons';
import { getCurrentUserData, updateCurrentUserData, signOut } from '../../utils';

export default class Settings extends Component {
  /* NAVIGATION SET UP */
  static navigationOptions = ({ navigation }) => ({
    drawer: () => ({
      label: 'Settings'
    }),
    title: 'SETTINGS',
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
      firstName,
      lastName,
      address,
      phoneNumber,
      birthday,
      grad,
      major,
      homeChurch
    } = thisUserData;
    // convert birthday from timestamp to MM/DD/YYYY
    let birthdayString;
    if (birthday) {
      birthdayString = `${birthday.getMonth() + 1}/${birthday.getDate()}/${birthday.getFullYear()}`;
    } else {
      // set birthdayString to be empty string if no birthday available currently
      birthdayString = '';
    }
    this.state = {
      firstName,
      lastName,
      birthdayString,
      phoneNumber,
      address,
      grad,
      major,
      homeChurch,
      loading: false,
      submitted: false
    };
  }

  onChangeFirstName = (firstName) => {
    this.setState({ submitted: false, firstName });
  };

  onChangeLastName = (lastName) => {
    this.setState({ submitted: false, lastName });
  };

  onChangePhoneNumber = (phoneNumber) => {
    this.setState({ submitted: false, phoneNumber });
  };

  onChangeAddress = (address) => {
    this.setState({ submitted: false, address });
  };

  onChangeGrad = (grad) => {
    this.setState({ submitted: false, grad });
  };

  onChangeMajor = (major) => {
    this.setState({ submitted: false, major });
  };

  onChangeHomeChurch = (homeChurch) => {
    this.setState({ submitted: false, homeChurch });
  };

  renderButton = () => {
    const { loading, submitted } = this.state;
    if (loading && !submitted) {
      return (
        <Button style={{ marginBottom: 15, paddingVertical: 15 }}>
          <ActivityIndicator color="#fff" />
        </Button>
      );
    }

    if (submitted) {
      return (
        <Button success style={{ marginBottom: 15, backgroundColor: '#0ab435' }}>
          <Text style={globalStyles.buttonText}>UPDATED</Text>
        </Button>
      );
    }

    return (
      <Button style={{ marginBottom: 15 }} onPress={this.updateInfo}>
        <Text style={globalStyles.buttonText}>UPDATE ACCOUNT</Text>
      </Button>
    );
  };

  updateInfo = () => {
    this.setState({ loading: true });
    const {
      firstName,
      lastName,
      birthdayString,
      phoneNumber,
      address,
      grad,
      major,
      homeChurch
    } = this.state;
    // check if required fields are filled out, show error message if not filled out properly
    // required: first, last, phone#, grad
    if (!firstName || !lastName || !phoneNumber || !grad) {
      this.setState({ loading: false });
      Alert.alert('', 'Please fill out all required fields');
    } else {
      let birthday;
      if (birthdayString) birthday = new Date(birthdayString);
      const toUpdate = {
        firstName,
        lastName,
        birthday,
        phoneNumber,
        address,
        grad,
        major,
        homeChurch
      };
      const currentUid = firebase.auth().currentUser._user.uid;
      firebase
        .firestore()
        .collection('users')
        .doc(currentUid)
        .update(toUpdate);
      updateCurrentUserData(toUpdate);
      this.setState({ loading: false, submitted: true });
    }
    // if information filled out correctly, push data to Firebase, update state ( loading: false, submitted: true )
  };

  render() {
    const {
      firstName,
      lastName,
      birthdayString,
      phoneNumber,
      address,
      grad,
      major,
      homeChurch,
      focus
    } = this.state;
    const { navigation } = this.props;
    return (
      <Screen>
        <KeyboardAwareScrollView extraHeight={20}>
          <View
            style={[globalStyles.textCentric, {
              paddingTop: 20,
              paddingBottom: 0,
              flex: 0.8,
            }]}
          >
            <Text style={{ marginBottom: 8 }}>Account Info!</Text>
            <Text styleName="subtitle center">Feel free to edit any of your account information below.</Text>
            <Text style={{ paddingVertical: 10 }}>
              <Text styleName="paragraph" style={{ color: '#b40a34' }}>* </Text>
              <Text styleName="paragraph"> is required</Text>
            </Text>
          </View>
          <View style={{ paddingHorizontal: 25, flex: 0.56 }}>
            <View style={{ paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>First Name </Text>
              <Text style={globalStyles.labelasterisk}>* </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'one' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'one' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              placeholder="Chris"
              autoCorrect={false}
              value={firstName}
              onChangeText={this.onChangeFirstName}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Last Name </Text>
              <Text style={globalStyles.labelasterisk}>* </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'two' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'two' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              placeholder="Gee"
              autoCorrect={false}
              value={lastName}
              onChangeText={this.onChangeLastName}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Phone # </Text>
              <Text style={globalStyles.labelasterisk}>* </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'three' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'three' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Number"
              value={phoneNumber}
              onChangeText={this.onChangePhoneNumber}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Graduation Year </Text>
              <Text style={globalStyles.labelasterisk}>* </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'four' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'four' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              placeholder="2019"
              autoCorrect={false}
              value={grad}
              onChangeText={this.onChangeGrad}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 3, paddingBottom: 13, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Birthday</Text>
            </View>
            <DatePicker
              date={birthdayString}
              style={{ width: '100%' }}
              mode="date"
              placeholder="12/25/2000"
              format="MM/DD/YYYY"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              customStyles={{
                dateTouchBody: {
                  color: '#202020',
                  backgroundColor: '#fff',
                  height: 40,
                },
                placeholderText: {
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  color: '#C0C0C0',
                },
                dateInput: {
                  ...globalStyles.input,
                  alignItems: 'flex-start',
                  paddingVertical: 9,
                  paddingHorizontal: 10,
                  marginBottom: 10
                },
                dateText: {
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: 15,
                  color: '#202020',
                },
                btnText: {
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                },
                btnTextConfirm: {
                  color: '#202020',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                },
                btnTextCancel: {
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                },
              }}
              onDateChange={(bstring) => {
                this.setState({ birthdayString: bstring });
              }}
            />
            <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Address </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'five' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'five' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="De Neve"
              value={address}
              onChangeText={this.onChangeAddress}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Major </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'six' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'six' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Science"
              value={major}
              onChangeText={this.onChangeMajor}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Home Church </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'seven' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'seven' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              placeholder="Grace Community Church"
              autoCorrect={false}
              value={homeChurch}
              onChangeText={this.onChangeHomeChurch}
              returnKeyType="next"
            />
            <Divider />
            <View style={{ flex: 0.25 }} styleName="vertical h-center v-end">
              {this.renderButton()}
              <Button
                clear
                style={{ marginBottom: 15 }}
                onPress={() => {
                  signOut();
                }}
              >
                <Text style={globalStyles.buttonTextGold}>LOG OUT</Text>
              </Button>
              <Button
                clear
                style={{ marginBottom: 15 }}
                onPress={() => navigation.navigate('userInvite')}
              >
                <Text style={globalStyles.buttonTextGold}>INVITE NEW USER</Text>
              </Button>
              <Button
                clear
                style={{ marginBottom: 15 }}
                onPress={() => navigation.navigate('changePassword')}
              >
                <Text style={globalStyles.buttonTextGold}>CHANGE PASSWORD</Text>
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Screen>
    );
  }
}
