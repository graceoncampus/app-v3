import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native';
import { Title, Tile, Subtitle, FormGroup, Spinner } from '@shoutem/ui';
import { Button, Divider, Screen } from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { Menu } from '../../icons';
import firebase from 'react-native-firebase';
import { getCurrentUserData, signOut } from '../../utils';

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
        this.state = {
            firstName,
            lastName,
            birthday,
            phoneNumber,
            address,
            grad,
            major,
            homeChurch,
            loading: false,
            submitted: false,
            error: ''
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
        const { firstName, lastName, birthday, phoneNumber, address, grad, major, homeChurch, loading, error } = this.state;
        // check if required fields are filled out, show error message if not filled out properly
        // required: first, last, phone#, grad
        if (firstName == '' || lastName == '' || phoneNumber == '' || grad == '' ) {
          this.setState({ error: 'Please fill out all required fields.', loading: false });
        }
        else {
          currentUid = firebase.auth().currentUser.uid;
          firebase.firestore().collection('users').doc(`${currentUid}`).update({
            firstName,
            lastName,
            birthday,
            phoneNumber,
            address,
            grad,
            major,
            homeChurch
          });
          this.setState({ loading: false, submitted: true });
        }

        // if information filled out correctly, push data to Firebase, update state ( loading: false, submitted: true )
      }

    render = () => {
        const { firstName, lastName, birthday, phoneNumber, address, grad, major, homeChurch, loading, error } = this.state;

        return (
            <Screen>
                <ScrollView>
                    <Tile style={{ paddingTop: 20, paddingBottom: 0, flex: 0.8, backgroundColor: 'transparent' }} styleName='text-centric'>
                        <Title>Account Info!</Title>
                        <Subtitle>Feel free to edit any of your account information below.</Subtitle>
                        <Subtitle style={{ paddingVertical: 10 }}>
                        <Subtitle style={{ color: '#b40a34' }}>* </Subtitle>
                        <Subtitle> is required</Subtitle>
                        </Subtitle>
                        {(error.length > 0) &&
                          <Text style={{ color: '#b40a34', paddingBottom: 20, fontWeight: 'bold' }}>{error}</Text>
                        }
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
                </ScrollView>
            </Screen>
        )
    }
}
