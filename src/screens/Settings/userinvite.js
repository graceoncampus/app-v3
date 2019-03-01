import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Title, Caption, Tile, Subtitle, FormGroup, Spinner } from '@shoutem/ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Divider, Screen } from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { Back } from '../../icons';
import firebase from 'react-native-firebase';

class UserInvite extends Component {
    /* NAVIGATION SET UP */
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('title', 'CLASS'),
        headerLeft: (
            <TouchableOpacity style={{ padding: 15 }} onPress={() => navigation.goBack()}>
                <Back />
            </TouchableOpacity>
        ),
        headerRight: (
            <View />
        ),
        ...headerStyles,
    })

  /* EMAIL CONSTRUCTOR */
  constructor(props) {
      super(props);
      this.state = {
          Email: '',
          loading: false,
          submitted: false
      };
      this.onChangeEmail = this.onChangeEmail.bind(this);
      this.signUp = this.signUp.bind(this);
  }

  /* CHANGES EMAIL */
  onChangeEmail(Email) {this.setState({ submitted: false, Email });}

  /* SIGN UP
   * - executes when "INVITE USER" is clicked
   * - checks email syntax
   * - checks whether the email is already on the invited list or is already a user
   * - pushes email to the goc invitation server
   */
  signUp = () => {
      this.setState({ loading: true });
      const {
          Email,
      } = this.state;

      const lowercaseEmail = Email.toLowerCase();
      const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

      if (re.test(lowercaseEmail)) {
          firebase.firestore().collection('invitedUsers').where('email', '==', lowercaseEmail).get().then(function(querySnapshot){
              console.log(querySnapshot);
              if (querySnapshot.docs.length > 0) {
                  alert('This email has already been invited.');
                  this.setState({ loading: false });
              } else {
                  firebase.firestore().collection('users').where('email', '==', lowercaseEmail).get().then(function(querySnapshot){
                      if (querySnapshot.docs.length > 0) {
                          alert('An account with this email address has already been created.');
                          this.setState({ loading: false });
                      } else {
                          const details = {
                              token: 'GOC2017!',
                              email: lowercaseEmail,
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
                                'Content-Type': 'application/x-www-form-urlencoded',
                              },
                          }).then(() => {
                              alert('User has been invited. They can now download the app and create an account!');
                              this.setState({ submitted: true });
                          });
                      }
                  });
              }
          });
      } else {
          alert('Please enter a valid email address');
          this.setState({ loading: false });
      }
  }

  /* RENDER BUTTON
   * - asynchronous function (updates constantly)
   * - changes the button to spinner wheel, success or neutral based on state
   */
  renderButton = () => {
    console.log("this puppy");
    console.log(this.state.submitted);
      if (this.state.submitted) {
          return (
              <Button success style={{ marginBottom: 15, backgroundColor: '#0ab435' }}>
                  <Text style={globalStyles.buttonText} >INVITED</Text>
              </Button>
          );
      }

      if (!this.state.submitted && this.state.loading) {
          return (
              <Button style={{ marginBottom: 15, paddingVertical: 15 }}>
                  <Spinner style={{ color: '#fff' }}/>
              </Button>
          );
      }

      return (
          <Button style={{ marginBottom: 15 }} onPress={this.signUp}>
              <Text style={globalStyles.buttonText} >INVITE USER</Text>
          </Button>
      );
  }

  /* MAIN PAGE FUNCTION */
  render = () => {
      const {
          Email,
      } = this.state;

        return (
            <Screen>
                <KeyboardAwareScrollView ref={(c) => { this.scroll = c; }}>
                    <Tile style={{ paddingTop: 20, paddingBottom: 0, flex: 0.8, backgroundColor: 'transparent' }} styleName='text-centric'>
                        <Title>Invite New User</Title>
                        <Subtitle>Invite a new user to create an account. Note that the email you invite will be their log in email</Subtitle>
                        <Subtitle style={{ color: '#b40a34', paddingVertical: 10 }} >{this.props.error}</Subtitle>
                    </Tile>

                    <FormGroup style={{ paddingHorizontal: 25, flex: 0.56 }}>
                        <View style={{ paddingBottom: 4, flexDirection: 'row'}}>
                            <Text>Email </Text>
                        </View>
                        <TextInput
                            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                            autoCapitalize='none'
                            autoCorrect= {false}
                            placeholder="yourbestfriend@gmail.com"
                            keyboardType="email-address"
                            value={Email}
                            onChangeText={this.onChangeEmail}
                            returnKeyType='next'
                        />

                        <Divider />

                        <View style={{ flex: 0.25 }} styleName='vertical h-center v-end'>
                            {this.renderButton()}
                        </View>
                    </FormGroup>
                </KeyboardAwareScrollView>
            </Screen>
        );
    }
}

/* NAVIGATION */
export default UserInvite;
