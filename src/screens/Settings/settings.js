import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Title, Tile, Subtitle, FormGroup, Spinner } from '@shoutem/ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Divider, Screen } from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { Menu } from '../../icons';
import firebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';
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
      headerRight: (
          <View />
      ),
      ...headerStyles,
  })

    constructor(props) {
        super(props);
        const thisUserData = getCurrentUserData();
        const { firstName, lastName, address, phoneNumber, birthday, grad, major, homeChurch} = thisUserData;
        // convert birthday from timestamp to MM/DD/YYYY
        let birthdayString;
        if (birthday) {
            birthdayString = (birthday.getMonth() + 1) + '/' + birthday.getDate() + '/' +  birthday.getFullYear();
        }
        else { // set birthdayString to be empty string if no birthday available currently
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
            submitted: false,
            error: false
        }
    };

    onChangeFirstName = (firstName) => { this.setState({ submitted: false, firstName }); }
    onChangeLastName = (lastName) => { this.setState({ submitted: false, lastName }); }
    onChangePhoneNumber = (phoneNumber) => { this.setState({ submitted: false, phoneNumber }); }
    onChangeAddress = (address) => { this.setState({ submitted: false, address }); }
    onChangeGrad = (grad) => { this.setState({ submitted: false, grad }); }
    onChangeMajor = (major) => { this.setState({ submitted: false, major }); }
    onChangeHomeChurch = (homeChurch) => { this.setState({ submitted: false, homeChurch }); }

    renderButton = () => {
        if (this.state.loading && !this.state.submitted) {
          return (
            <Button style={{ marginBottom: 15, paddingVertical: 15 }}>
                <Spinner style={{ color: '#fff' }}/>
            </Button>
          );
        }

        if (this.state.submitted) {
          return (
            <Button success style={{ marginBottom: 15, backgroundColor: '#0ab435' }}>
                <Text style={globalStyles.buttonText} >UPDATED</Text>
            </Button>
          );
        }

        return (
            <Button style={{ marginBottom: 15 }} onPress={this.updateInfo}>
                <Text style={globalStyles.buttonText} >UPDATE ACCOUNT</Text>
            </Button>
        );
    }

    updateInfo = () => {
        this.setState({ loading: true });
        const { firstName, lastName, birthdayString, phoneNumber, address, grad, major, homeChurch } = this.state;
        // check if required fields are filled out, show error message if not filled out properly
        // required: first, last, phone#, grad
        if (firstName == '' || lastName == '' || phoneNumber == '' || grad == '' ) {
          this.setState({ error: true, loading: false });
          Alert.alert('', 'Please fill out all required fields');
        }
        else {
          let birthday;
          if(birthdayString) {
            birthday = new Date(birthdayString);
          }
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

          currentUid = firebase.auth().currentUser._user.uid;
          firebase.firestore().collection('users').doc(`${currentUid}`).update(toUpdate);
          updateCurrentUserData(toUpdate);
          this.setState({ loading: false, submitted: true });
        }
        // if information filled out correctly, push data to Firebase, update state ( loading: false, submitted: true )
      }

    render = () => {
        const { firstName, lastName, birthdayString, phoneNumber, address, grad, major, homeChurch } = this.state;
        return (
            <Screen>
                <KeyboardAwareScrollView extraHeight={20}>
                    <Tile style={{ paddingTop: 20, paddingBottom: 0, flex: 0.8, backgroundColor: 'transparent' }} styleName='text-centric'>
                        <Title>Account Info!</Title>
                        <Subtitle>Feel free to edit any of your account information below.</Subtitle>
                        <Subtitle style={{ paddingVertical: 10 }}>
                        <Subtitle style={{ color: '#b40a34' }}>* </Subtitle>
                        <Subtitle> is required</Subtitle>
                        </Subtitle>
                    </Tile>
                    <FormGroup style={{ paddingHorizontal: 25, flex: 0.56 }}>
                        <View style={{ paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>First Name </Text>
                            <Text style={globalStyles.labelasterisk}>* </Text>
                        </View>
                        <TextInput
                        style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={firstName}
                        onChangeText={this.onChangeFirstName}
                        returnKeyType='next'
                        />
                        <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Last Name </Text>
                            <Text style={globalStyles.labelasterisk}>* </Text>
                        </View>
                        <TextInput
                        style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={lastName}
                        onChangeText={this.onChangeLastName}
                        returnKeyType='next'
                        />
                        <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Phone # </Text>
                            <Text style={globalStyles.labelasterisk}>* </Text>
                        </View>
                        <TextInput
                        style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={phoneNumber}
                        onChangeText={this.onChangePhoneNumber}
                        returnKeyType='next'
                        />
                        <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Graduation Year </Text>
                            <Text style={globalStyles.labelasterisk}>* </Text>
                        </View>
                        <TextInput
                        style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={grad}
                        onChangeText={this.onChangeGrad}
                        returnKeyType='next'
                        />
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Birthday</Text>
                        </View>
                        <DatePicker
                            date = {birthdayString}
                            style = {{ width: '100%' }}
                            mode = "date"
                            placeholder = " "
                            format = "MM/DD/YYYY"
                            confirmBtnText = "Confirm"
                            cancelBtnText = "Cancel"
                            showIcon = {false}
                            customStyles = {{
                                dateTouchBody: {
                                    color: '#202020',
                                    backgroundColor: '#F0F0F0',
                                    height: 42,
                                },
                                placeholderText: {
                                    fontStyle: 'normal',
                                    fontWeight: 'normal',
                                    color: '#C0C0C0',
                                },
                                dateInput: {
                                    backgroundColor: '#F0F0F0',
                                    borderWidth: 0,
                                    alignItems: 'flex-start',
                                    paddingVertical: 9,
                                    paddingHorizontal: 10,
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
                            onDateChange={(birthdayString) => { this.setState({ birthdayString }); }}
                        />
                        <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Address </Text>
                        </View>
                        <TextInput
                        style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={address}
                        onChangeText={this.onChangeAddress}
                        returnKeyType='next'
                        />
                        <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Major </Text>
                        </View>
                        <TextInput
                        style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={major}
                        onChangeText={this.onChangeMajor}
                        returnKeyType='next'
                        />
                        <View style={{ paddingTop: 4, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Home Church </Text>
                        </View>
                        <TextInput
                        style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={homeChurch}
                        onChangeText={this.onChangeHomeChurch}
                        returnKeyType='next'
                        />
                        <Divider />
                        <View style={{ flex: 0.25 }} styleName='vertical h-center v-end'>
                            {this.renderButton()}
                            <Button clear style={{ marginBottom: 15 }} onPress={() => {signOut()}}>
                                <Text style={globalStyles.buttonTextGold} >LOG OUT</Text>
                            </Button>
                            <Button clear style={{ marginBottom: 15 }} onPress={() => this.props.navigation.navigate('userInvite')}>
                                <Text style={globalStyles.buttonTextGold}>INVITE NEW USER</Text>
                            </Button>
                            <Button clear style={{ marginBottom: 15 }} onPress={() => this.props.navigation.navigate('changePassword')}>
                                <Text style={globalStyles.buttonTextGold}>CHANGE PASSWORD</Text>
                            </Button>
                        </View>
                    </FormGroup>
                </KeyboardAwareScrollView>
            </Screen>
        )
    }
}
