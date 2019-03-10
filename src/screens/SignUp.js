import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, StatusBar, ScrollView } from 'react-native';
import { Title, Caption, Tile, Subtitle, FormGroup, Spinner, Icon } from '@shoutem/ui';
import { Button, Divider, Screen } from '../components';
import globalStyles, { headerStyles } from '../theme';
import { Back } from '../icons';
import firebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';

export default class SignUp extends Component {
    /* NAVIGATION SET UP */
    static navigationOptions = ({ navigation }) => ({
        title: "SIGN UP",
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

    signUp() {
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
            Address,
        } = this.state;

        const eml = Email.toLowerCase();

        const Permissions = {
            admin: 0,
            carousel: 0,
            classes: 0,
            events: 0,
            rides: 0,
            sermons: 0
        }

        const toAdd = {
            address: Address,
            birthday: Birthday,
            email: eml,
            firstName: First_name,
            grad: Graduation_year,
            homeChurch: Home_church,
            image: '',
            lastName: Last_name,
            major: Major,
            permissions: Permissions,
            phoneNumber: Phone_number
        }

        let error = false;
        if (First_name === '' || Last_name === '' || Email === '' || Password === '' || Confirm_password === '' || Phone_number === '' || Graduation_year === '') {
            this.setState({ loading: false });
            alert('Please fill out all fields');
            error = true;
        }
        else if (Confirm_password !== Password) {
            this.setState({ loading: false });
            alert('Passwords do not match');
            error = true;
        }
        else if (Password.length < 6) {
            this.setState({ loading: false });
            alert('Password must be at least 6 characters');
            error = true;
        }
        else if (Phone_number.length !== 10) {
            this.setState({ loading: false });
            alert('Please enter your 10 digit phone number');
            error = true;
        }

        if (!error) {
            firebase.firestore().collection('users').where('email', '==', eml).get().then((querySnapshot) => {
                if (querySnapshot.docs != 0) {
                    alert('An account with this email has already been created');
                    this.setState({ loading: false });
                } else {
                    firebase.firestore()
                            .collection('invitedUsers')
                            .where('email', '==', eml)
                            .get().then((querySnapshot) => {
                        if (querySnapshot.docs != 0) {
                            firebase.auth().createUserWithEmailAndPassword(eml, Password).then((userCred) => {
                                const uid = userCred.user.uid
                                firebase.firestore().collection('users').doc(uid).set(toAdd).then(() => {
                                    firebase.firestore().collection('invitedUsers').where('email', '==', eml).get().then((querySnapshot) => {
                                        querySnapshot.forEach(function(doc) {
                                          doc.ref.delete();
                                        });
                                    });
                                });
                                firebase.auth().signOut();
                            }).then(() => {
                                this.props.navigation.goBack();
                            })
                        } else {
                            alert('This email has not been invited to create an account. Contact us at gocwebteam@gmail.com to get an invite.');
                            this.setState({ loading: false });
                        }
                    })
                }
            });
        } else {
            error = false;
        }
    }

    /* RENDER BUTTON
     * - asynchronous function (updates constantly)
     * - changes the button to spinner wheel, success or neutral based on state
     */
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
                 <Text style={globalStyles.buttonText} >CREATED!</Text>
             </Button>
           );
         }

         return (
             <Button style={{ marginBottom: 15 }} onPress={this.signUp}>
                 <Text style={globalStyles.buttonText} >SIGN UP</Text>
             </Button>
         );
     }

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
        const { loading, submitted } = this.state;

        let error = '';
        if (this.props.error) error = this.props.error;
        const {
          focus,
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
          Address,
        } = this.state;
        return (
            <Screen>
                <ScrollView>
                    <Tile style={{ paddingTop: 20, paddingBottom: 0, flex: 0.8, backgroundColor: 'transparent' }} styleName='text-centric'>
                        <Title>Greetings!</Title>
                        <Subtitle>
                            Creating an account and providing us with some basic info allows you to sign up for rides, classes, and events. Please note that you must create an account with the email address you were invited with.
                        </Subtitle>
                        <Subtitle style={{ paddingVertical: 10 }}>
                            <Subtitle style={{ color: '#b40a34' }}>* </Subtitle>
                            <Subtitle> is required</Subtitle>
                        </Subtitle>
                    </Tile>
                    <FormGroup style={{ paddingHorizontal: 25, flex: 0.56 }}>
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>First Name</Text>
                            <Text style={globalStyles.labelasterisk}>* </Text>
                        </View>
                        <TextInput
                            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                            autoCapitalize = 'none'
                            autoCorrect = {false}
                            placeholder ="Jane"
                            value = {First_name}
                            onChangeText = {this.onChangeFirstName}
                            returnKeyType = 'next'
                        />
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Last Name</Text>
                            <Text style={globalStyles.labelasterisk}>* </Text>
                        </View>
                        <TextInput
                            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                            autoCapitalize ='none'
                            autoCorrect = {false}
                            placeholder = "Zhang"
                            value = {Last_name}
                            onChangeText = {this.onChangeLastName}
                            returnKeyType ='next'
                        />
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Email</Text>
                            <Text style={globalStyles.labelasterisk}>* </Text>
                        </View>
                        <TextInput
                            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                            autoCapitalize = 'none'
                            autoCorrect = {false}
                            placeholder = "chessrocks1221@gmail.com"
                            keyboardType = "email-address"
                            value = {Email}
                            onChangeText = {this.onChangeEmail}
                            returnKeyType = 'next'
                        />
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Password</Text>
                            <Text style={globalStyles.labelasterisk}>* </Text>
                        </View>
                        <TextInput
                            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                            value = {Password}
                            placeholder = "iluvchess123"
                            secureTextEntry
                            onChangeText = {this.onChangePassword}
                            returnKeyType='next'
                        />
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Confirm Password</Text>
                            <Text style={globalStyles.labelasterisk}>* </Text>
                        </View>
                        <TextInput
                            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                            value = {Confirm_password}
                            placeholder = "iluvchess123"
                            secureTextEntry
                            onChangeText = {this.onChangeConfirmPassword}
                            returnKeyType = 'next'
                        />
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Phone Number</Text>
                            <Text style={globalStyles.labelasterisk}>* </Text>
                        </View>
                        <TextInput
                            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                            placeholder = "Yo digits"
                            value = {Phone_number}
                            keyboardType = 'phone-pad'
                            onChangeText = {this.onChangePhoneNumber}
                            returnKeyType = 'next'
                        />
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Graduation Year</Text>
                            <Text style={globalStyles.labelasterisk}>* </Text>
                        </View>
                        <TextInput
                            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                            placeholder = "2019"
                            value = {Graduation_year}
                            keyboardType = 'numeric'
                            onChangeText = {this.onChangeGraduationYear}
                            returnKeyType = 'next'
                        />
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Birthday</Text>
                        </View>
                        <DatePicker
                            date = {Birthday}
                            style = {{ width: '100%' }}
                            mode = "date"
                            placeholder = "12/25/0000"
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
                            onDateChange={(bday) => { this.setState({ Birthday: bday }); }}
                        />
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Major</Text>
                        </View>
                        <TextInput
                            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                            placeholder = "Basket Weaving"
                            value = {Major}
                            onChangeText = {this.onChangeMajor}
                            returnKeyType = 'next'
                        />
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Home Church</Text>
                        </View>
                        <TextInput
                            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                            placeholder = "Grace Community Church"
                            value = {Home_church}
                            onChangeText = {this.onChangeHomeChurch}
                            returnKeyType = 'next'
                        />
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Address</Text>
                        </View>
                        <TextInput
                            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                            placeholder = "424 Veteran Ave"
                            value = {Address}
                            onChangeText = {this.onChangeAddress}
                            returnKeyType = 'done'
                        />
                        <Divider />
                        {this.renderButton()}
                    </FormGroup>
                    <Divider />
                    <Divider />
                    <Divider />
                </ScrollView>
            </Screen>
        );
    }
}
