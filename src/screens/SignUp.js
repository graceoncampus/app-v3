import React, { Component } from 'react';
import {
  View,
  AsyncStorage,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import firebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Button, Divider, Screen, Text
} from '../components';
import globalStyles, { headerStyles } from '../theme';
import { Back } from '../icons';

export default class SignUp extends Component {
  /* NAVIGATION SET UP */
  static navigationOptions = ({ navigation }) => ({
    title: 'SIGN UP',
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
    this.state = {
      Email: '',
      Password: '',
      Confirm_password: '',
      First_name: '',
      Last_name: '',
      Phone_number: '',
      Birthday: '',
      Graduation_year: '',
      Major: '',
      Home_church: '',
      Address: '',
      submitted: false,
      loading: false,
      error: ''
    };
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this);
    this.onChangeBirthday = this.onChangeBirthday.bind(this);
    this.onChangeGraduationYear = this.onChangeGraduationYear.bind(this);
    this.onChangeMajor = this.onChangeMajor.bind(this);
    this.onChangeHomeChurch = this.onChangeHomeChurch.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  signUp = () => {
    this.setState({ loading: true });
    const {
      Email,
      Password,
      Confirm_password,
      First_name,
      Last_name,
      Phone_number,
      Birthday,
      Graduation_year,
      Major,
      Home_church,
      Address
    } = this.state;

    let birthday;
    if (Birthday) {
      birthday = new Date(Birthday);
    }

    const eml = Email.toLowerCase();

    const Permissions = {
      admin: 0,
      carousel: 0,
      classes: 0,
      events: 0,
      rides: 0,
      sermons: 0
    };

    const toAdd = {
      address: Address,
      birthday,
      email: eml,
      firstName: First_name,
      grad: Graduation_year,
      homeChurch: Home_church,
      image: '',
      lastName: Last_name,
      major: Major,
      permissions: Permissions,
      phoneNumber: Phone_number
    };

    let error = false;
    if (
      First_name === ''
      || Last_name === ''
      || Email === ''
      || Password === ''
      || Confirm_password === ''
      || Phone_number === ''
      || Graduation_year === ''
    ) {
      this.setState({ loading: false });
      Alert.alert('', 'Please fill out all required fields');
      error = true;
    } else if (Confirm_password !== Password) {
      this.setState({ loading: false });
      Alert.alert('', 'Passwords do not match');
      error = true;
    } else if (Password.length < 6) {
      this.setState({ loading: false });
      Alert.alert('', 'Password must be at least 6 characters');
      error = true;
    } else if (Phone_number.length !== 10) {
      this.setState({ loading: false });
      Alert.alert('', 'Please enter your 10 digit phone number');
      error = true;
    }

    if (!error) {
      firebase
      .firestore()
      .collection('invitedUsers')
      .where('email', '==', eml)
      .get()
      .then(async (invitedUsers) => {
        if (!invitedUsers.empty) {
          AsyncStorage.setItem('sign_up', 'true');
          try {
            const usercred = await firebase
              .auth()
              .createUserWithEmailAndPassword(eml, Password);
            const { uid } = usercred.user._user;
            await firebase.firestore().collection('users').doc(uid).set(toAdd);
            invitedUsers.forEach(async doc => await doc.ref.delete());
            await firebase.auth().signOut();
          } catch (err) {
            Alert.alert('', err.message);
            this.setState({ loading: false });
            AsyncStorage.setItem('sign_up', 'false');
          }
        } else {
          Alert.alert(
            '',
            'This email has not been invited to create an account. Contact us at gocwebteam@gmail.com to get an invite.'
          );
          this.setState({ loading: false });
        }
      });
    } else {
      error = false;
    }
  };

  /* RENDER BUTTON
   * - asynchronous function (updates constantly)
   * - changes the button to spinner wheel, success or neutral based on state
   */
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
          <Text style={globalStyles.buttonText}>CREATED!</Text>
        </Button>
      );
    }

    return (
      <Button style={{ marginBottom: 15 }} onPress={this.signUp}>
        <Text style={globalStyles.buttonText}>SIGN UP</Text>
      </Button>
    );
  };

  onChangeEmail(Email) {
    this.setState({ submitted: false, Email });
  }

  onChangePassword(Password) {
    this.setState({ submitted: false, Password });
  }

  onChangeConfirmPassword(Confirm_password) {
    this.setState({ submitted: false, Confirm_password });
  }

  onChangeFirstName(First_name) {
    this.setState({ submitted: false, First_name });
  }

  onChangeLastName(Last_name) {
    this.setState({ submitted: false, Last_name });
  }

  onChangePhoneNumber(Phone_number) {
    this.setState({ submitted: false, Phone_number });
  }

  onChangeBirthday(Birthday) {
    this.setState({ submitted: false, Birthday });
  }

  onChangeGraduationYear(Graduation_year) {
    this.setState({ submitted: false, Graduation_year });
  }

  onChangeMajor(Major) {
    this.setState({ submitted: false, Major });
  }

  onChangeHomeChurch(Home_church) {
    this.setState({ submitted: false, Home_church });
  }

  onChangeAddress(Address) {
    this.setState({ submitted: false, Address });
  }

  render() {
    if (this.props.error) error = this.props.error;
    const {
      Email,
      Password,
      Confirm_password,
      First_name,
      Last_name,
      Phone_number,
      Birthday,
      Graduation_year,
      Major,
      Home_church,
      focus,
      Address
    } = this.state;
    return (
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
            <Text styleName="bold center" style={{ paddingBottom: 10 }}>
              Greetings!
            </Text>
            <Text styleName="center paragraph" style={{ paddingHorizontal: 25 }}>
              Creating an account and providing us with some basic info allows you to sign up for
              rides, classes, and events. Please note that you must create an account with the email
              address you were invited with.
            </Text>
            <Text styleName="center">
              <Text styleName="caption" style={{ color: '#b40a34' }}>
                *
                {' '}
              </Text>
              <Text styleName="caption"> is required</Text>
            </Text>
          </View>
          <View style={{ paddingHorizontal: 25, flex: 0.56 }}>
            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>First Name </Text>
              <Text style={globalStyles.labelasterisk}>* </Text>
            </View>
            <TextInput
              sunderlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'one' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'one' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCorrect={false}
              autoComplete={false}
              placeholder="Chris"
              value={First_name}
              onChangeText={this.onChangeFirstName}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Last Name </Text>
              <Text style={globalStyles.labelasterisk}>* </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'two' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'two' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCorrect={false}
              autoComplete={false}
              placeholder="Gee"
              value={Last_name}
              onChangeText={this.onChangeLastName}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Email </Text>
              <Text style={globalStyles.labelasterisk}>* </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'three' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'three' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete={false}
              placeholder="gocwebteam@gmail.com"
              keyboardType="email-address"
              value={Email}
              onChangeText={this.onChangeEmail}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Password </Text>
              <Text style={globalStyles.labelasterisk}>* </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'four' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'four' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              value={Password}
              autoComplete={false}
              placeholder="Password"
              secureTextEntry
              onChangeText={this.onChangePassword}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Confirm Password </Text>
              <Text style={globalStyles.labelasterisk}>* </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'five' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'five' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              value={Confirm_password}
              autoComplete={false}
              placeholder="Confirm Password"
              secureTextEntry
              onChangeText={this.onChangeConfirmPassword}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Phone Number </Text>
              <Text style={globalStyles.labelasterisk}>* </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'six' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'six' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              placeholder="Number"
              value={Phone_number}
              autoComplete={false}
              keyboardType="phone-pad"
              onChangeText={this.onChangePhoneNumber}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Graduation Year </Text>
              <Text style={globalStyles.labelasterisk}>* </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'seven' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'seven' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              placeholder="2019"
              value={Graduation_year}
              autoComplete={false}
              keyboardType="numeric"
              onChangeText={this.onChangeGraduationYear}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 3, paddingBottom: 13, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Birthday </Text>
            </View>
            <DatePicker
              date={Birthday}
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
              onDateChange={(bday) => {
                this.setState({ Birthday: bday });
              }}
            />
            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Major </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'eight' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'eight' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              placeholder="Science"
              value={Major}
              autoComplete={false}
              onChangeText={this.onChangeMajor}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Home Church </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'nine' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'nine' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              placeholder="Church"
              value={Home_church}
              autoComplete={false}
              onChangeText={this.onChangeHomeChurch}
              returnKeyType="next"
            />
            <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row' }}>
              <Text style={globalStyles.label}>Address </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[globalStyles.input, focus === 'ten' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'ten' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              placeholder="De Neve"
              value={Address}
              autoComplete={false}
              onChangeText={this.onChangeAddress}
              returnKeyType="done"
            />
            <Divider />
            {this.renderButton()}
          </View>
        </KeyboardAwareScrollView>
      </Screen>
    );
  }
}
