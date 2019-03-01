import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Title, Caption, Tile, Subtitle, FormGroup, Spinner, Icon } from '@shoutem/ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Divider, Screen } from '../components';
import globalStyles, { headerStyles } from '../theme';
import { Back } from '../icons';
import firebase from 'react-native-firebase';

export default class ForgotPassword extends Component {
    /* NAVIGATION SET UP */
    static navigationOptions = ({ navigation }) => ({
        title: "FORGOT PASSWORD",
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
            submitted: false,
        };
        this.onChangeEmail = this.onChangeEmail.bind(this);
    }

    /* CHANGES EMAIL */
    onChangeEmail(Email) {
        this.setState({ submitted: false, Email });
    }

    /* RESET
     * - resets email
     */
    reset = () => {
        this.setState({ loading: true });
        const { Email } = this.state;
        const auth = firebase.auth();
        auth.sendPasswordResetEmail(Email).then(() => {
            alert('A password reset email has been sent to your email address.');
            this.setState({ submitted: true });
        }).catch(() => {
            alert('An account with this email address has not been created before.');
            this.setState({ loading: false });
        });
    }

    /* RENDER BUTTON
     * - asynchronous function (updates constantly)
     * - changes the button to spinner wheel, success or neutral based on state
     */
     renderButton = () => {
         if (this.state.submitted) {
             return (
                 <Button success style={{ marginBottom: 15, backgroundColor: '#0ab435' }}>
                     <Text style={globalStyles.buttonText} >EMAIL SENT!</Text>
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
             <Button style={{ marginBottom: 15 }} onPress={this.reset}>
                 <Text style={globalStyles.buttonText} >RESET</Text>
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
                        <Subtitle>Please enter the email address for your GOC account. An email will be sent to your email address indicating instructions on how to reset your password.</Subtitle>
                        <Subtitle style={{ color: '#b40a34', paddingVertical: 10 }} >{this.props.error}</Subtitle>
                    </Tile>
                    <FormGroup style={{ paddingHorizontal: 25, flex: 0.56 }}>
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text style={globalStyles.label}>Email</Text>
                        </View>
                        <TextInput
                            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                            autoCapitalize='none'
                            autoCorrect= {false}
                            placeholder="chessrocks1221@gmail.com"
                            onChangeText={this.onChangeEmail}
                            returnKeyType='next'
                        />
                        <Divider />
                        <View style={{ flex: 0.25 }} styleName='vertical h-center v-end'>
                            {this.renderButton()}
                        </View>
                    </FormGroup>
                    <Divider />
                    <Divider />
                    <Divider />
                </KeyboardAwareScrollView>
            </Screen>
        );
    }
}
