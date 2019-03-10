import React, { Component } from 'react';
import { TouchableOpacity, TextInput, View, Text } from 'react-native';
import CheckBox from 'react-native-check-box';
import { Screen, Button, Divider } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Tile, Title, FormGroup, Subtitle, Spinner, Icon } from '@shoutem/ui';
import globalStyles, { headerStyles } from '../../theme';
import { getCurrentUserData } from '../../utils';
import { Menu } from '../../icons';
import firebase from 'react-native-firebase'

export default class RideSignup extends Component {
    static navigationOptions = ({ navigation }) => ({
        drawer: () => ({
          label: 'RideSignup',
        }),
        title: 'RIDE SIGNUP',
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
      const { firstName, lastName, address, phoneNumber, email, onlineSignUp } = thisUserData;
      var localSignupState = null;
      if (onlineSignUp === undefined) {
        localSignupState = false;
      }
      else {
        localSignupState = onlineSignUp;
      }
      this.state = {
        driver: false,
        morning: false,
        evening: false,
        staying: false,
        name: `${firstName} ${lastName}`,
        address: address,
        number: phoneNumber,
        comments: '',
        email: email,
        error: '',
        loading: false,
        signedUp: localSignupState,
      };
      this.onChangeName = this.onChangeName.bind(this);
      this.onChangeAddress = this.onChangeAddress.bind(this);
      this.onChangeNumber = this.onChangeNumber.bind(this);
      this.onChangeComment = this.onChangeComment.bind(this);
      this.onChangeEmail = this.onChangeEmail.bind(this);
    }

  onChangeAddress = address => (this.setState({ address }))
  onChangeNumber = number => (this.setState({ number }))
  onChangeComment = comments => (this.setState({ comments }))
  onChangeEmail = email => (this.setState({ email }))
  onChangeName = name => (this.setState({ name }))

  signUp = () => {
    this.setState({ error: '', loading: true });
    const { name, address, number, comments, email, morning, evening, staying, driver } = this.state;
    const { currentUser } = firebase.auth();
    var uid = currentUser.uid;
    let time = '';
    time += morning ? 'Morning, ' : '';
    time += evening ? 'Evening, ' : '';
    time += staying ? 'Staying' : '';
    if (name === '' || address === '' || number === '' || number === '' || email === '' || time === '') {
      this.scroll.scrollToPosition(0, 0, true);
      return this.setState({ error: 'Please fill out all fields' });
    }
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
    if(currentUser.email !== email) {
      uid = "";
    }
    const postData = { name, address, number, comments, email, driver, morning, evening, staying, uid, timestamp };
    this.ref = firebase.firestore().collection('ridesSignup');
    this.ref2 = firebase.firestore().collection('users').doc(`${uid}`);
    this.ref.add(postData).then(this.ref2.update({onlineSignUp: true}).then((this.setState({
      signedUp: true,
      focus: '',
      morning: false,
      evening: false,
      staying: false,
      loading: false,
      name: '',
      address: '',
      number: '',
      comments: '',
      email: '',
    }))));
  }

  renderButton = () => {
    if (this.state.loading && this.state.error != 'Please fill out all fields') {
      return (
        <Button style={{ paddingVertical: 15 }}>
          <Spinner style={{ color: '#fff' }}/>
        </Button>
      );
    }
    return (
      <Button style={{ marginBottom: 15 }} onPress={this.signUp}>
        <Text style={globalStyles.buttonText}>SIGN UP</Text>
      </Button>
    );
  }

  render = () => {
    const { name, address, number, comments, email, morning, evening, staying, error, driver, signedUp } = this.state;
    if (signedUp == true){
      return (
        <Screen>
          <Tile style={{ paddingBottom: 0, flex: 0.8, backgroundColor: 'transparent' }} styleName='text-centric'>
            <Icon style={{ color: '#008000', fontSize: 60, paddingBottom: 40 }} name="checkbox-on" />
            <Title>You've successfully signed up for a ride online!</Title>
          </Tile>
        </Screen>
      );
    }
    return (
      <Screen>
        <KeyboardAwareScrollView ref={(c) => { this.scroll = c; }}>
        <Tile style={{ paddingTop: 20, paddingBottom: 0, flex: 0.8, backgroundColor: 'transparent' }} styleName='text-centric'>
          <Title>Do It!</Title>
            <Subtitle>Sign up for a ride to church for this coming Sunday</Subtitle>
            {(error.length > 0) &&
              <Text style={{ color: '#b40a34', paddingBottom: 20, fontWeight: 'bold' }}>{error}</Text>
            }
          </Tile>
          <FormGroup style={{ paddingHorizontal: 25, flex: 0.56 }}>
          <View style={{ paddingBottom: 4, flexDirection: 'row'}}>
            <Text>Name</Text>
          </View>
          <TextInput
            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: 'white', borderColor: 'gray', borderWidth: 0.4}}
            placeholder="Chris Gee"
            value={name}
            onChangeText={this.onChangeName}
            returnKeyType='next'
          />
          <View style={{  paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
            <Text>Address</Text>
          </View>
          <TextInput
            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: 'white', borderColor: 'gray', borderWidth: 0.4}}
            placeholder="Hedrick Hall"
            value={address}
            onChangeText={this.onChangeAddress}
            returnKeyType='next'
          />
          <View style={{  paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
            <Text>Phone Number</Text>
          </View>
          <TextInput
            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: 'white', borderColor: 'gray', borderWidth: 0.4}}
            placeholder="(310)694-5216"
            value={number}
            keyboardType='phone-pad'
            onChangeText={this.onChangeNumber}
            returnKeyType='next'
          />
          <View style={{  paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
            <Text>Email</Text>
          </View>
          <TextInput
            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: 'white', borderColor: 'gray', borderWidth: 0.4}}
            autoCapitalize='none'
            autoCorrect={false}
            placeholder="gocrides@gmail.com"
            keyboardType="email-address"
            value={email}
            onChangeText={this.onChangeEmail}
            returnKeyType='next'
          />
          <View style={{  paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
            <Text>Comments</Text>
          </View>
          <TextInput
            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: 'white', borderColor: 'gray', borderWidth: 0.4}}
            autoCorrect={false}
            placeholder="Jireh please"
            value={comments}
            onChangeText={this.onChangeComment}
            returnKeyType='next'
          />
          <CheckBox
            style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 10 }}
            onClick={() => (this.setState({ driver: !driver }))}
            isChecked={driver}
            checkBoxColor={'#ae956b'}
            leftText={'Driver'}
            leftTextStyle={{
              fontFamily: 'Akkurat',
              fontStyle: 'normal',
              fontWeight: 'normal',
              color: '#3a3f4b',
              fontSize: 15,
              lineHeight: 18,
            }}
          />
          <CheckBox
            style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 10 }}
            onClick={() => (this.setState({ morning: !morning }))}
            isChecked={morning}
            leftText={'Morning (8:30 AM - 12:00 PM)'}
            checkBoxColor={'#ae956b'}
            leftTextStyle={{
              fontFamily: 'Akkurat',
              fontStyle: 'normal',
              fontWeight: 'normal',
              color: '#3a3f4b',
              fontSize: 15,
              lineHeight: 18,
            }}
          />
          <CheckBox
            style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 10 }}
            onClick={() => (this.setState({ staying: !staying }))}
            isChecked={staying}
            checkBoxColor={'#ae956b'}
            leftText={'Staying (8:30 AM - 7:30 PM)'}
            leftTextStyle={{
              fontFamily: 'Akkurat',
              fontStyle: 'normal',
              fontWeight: 'normal',
              color: '#3a3f4b',
              fontSize: 15,
              lineHeight: 18,
            }}
          />
          <CheckBox
            style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 10 }}
            onClick={() => (this.setState({ evening: !evening }))}
            isChecked={evening}
            checkBoxColor={'#ae956b'}
            leftText={'Evening (6:00 PM - 7:30 PM)'}
            leftTextStyle={{
              fontFamily: 'Akkurat',
              fontStyle: 'normal',
              fontWeight: 'normal',
              color: '#3a3f4b',
              fontSize: 15,
              lineHeight: 18,
            }}
          />
          <Divider />
          {this.renderButton()}
        </FormGroup>
        </KeyboardAwareScrollView>
      </Screen>
    );
  }
}