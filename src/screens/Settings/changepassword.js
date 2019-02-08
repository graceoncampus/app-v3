import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Title, Caption, Tile, Subtitle, FormGroup, Spinner } from '@shoutem/ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Divider, Screen } from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { Back } from '../../icons';
import firebase from 'react-native-firebase';

class ChangePassword extends Component {
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

    /* PASSWORD CONSTRUCTOR */
    constructor(props) {
        super(props);

        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            focus: null,
        };
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
        this.setState({ loading: true });
        const {
            oldPassword,
            newPassword,
            confirmNewPassword,
        } = this.state;
        if (newPassword.length < 6) {
            this.setState({ newPassword: '', confirmNewPassword: '', loading: false });
        } else if (newPassword !== confirmNewPassword) {
            this.setState({ newPassword: '', confirmNewPassword: '', loading: false });
        } else {
            const { currentUser } = firebase.auth();
            const email = currentUser.email;
            firebase.auth().signInWithEmailAndPassword(email, oldPassword)
            .then(() => {
                firebase.auth().currentUser.updatePassword(newPassword).then(() => {
                    alert('Password change successful');
                    this.setState({ loading: false, submitted: true });
                }, () => {
                    alert('Password change failed');
                    this.setState({ loading: false });
                });
            }).catch(() => {
                alert('Old password incorrect');
                this.setState({ loading: false });
            });
        }
    }

    /* RENDER BUTTON
     * - asynchronous function (updates constantly)
     * - changes the button to spinner wheel, success or neutral based on state
     */
     renderButton = () => {
         if (this.state.submitted) {
             return (
                 <Button success style={{ marginBottom: 15, backgroundColor: '#0ab435' }}>
                     <Text style={globalStyles.buttonText} >CHANGED</Text>
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
             <Button style={{ marginBottom: 15 }} onPress={this.change}>
                 <Text style={globalStyles.buttonText} >CHANGE PASSWORD</Text>
             </Button>
         );
     }

     /* MAIN PAGE FUNCTION */
    render = () => {
        const {
            oldPassword,
            newPassword,
            confirmNewPassword,
            focus,
        } = this.state;
        return (
            <Screen>
                <KeyboardAwareScrollView ref={(c) => { this.scroll = c; }}>
                    <Tile style={{ paddingTop: 20, paddingBottom: 0, flex: 0.8, backgroundColor: 'transparent' }} styleName='text-centric'>
                        <Title>Change Your Password</Title>
                    </Tile>

                    <FormGroup style={{ paddingHorizontal: 25, flex: 0.56 }}>
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text>Old Password </Text>
                        </View>
                        <TextInput
                            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                            autoCapitalize='none'
                            autoCorrect= {false}
                            placeholder="Enter old password"
                            value={oldPassword}
                            onChangeText={this.onChangeOld}
                            returnKeyType='next'
                            secureTextEntry={true}
                        />
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text>New Password </Text>
                        </View>
                        <TextInput
                            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                            autoCapitalize='none'
                            autoCorrect= {false}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChangeText={this.onChangeNew}
                            returnKeyType='next'
                            secureTextEntry={true}
                        />
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text>Confirm Password </Text>
                        </View>
                        <TextInput
                            style={{color: '#202020', paddingLeft: 10, height: 42, backgroundColor: '#F0F0F0'}}
                            autoCapitalize='none'
                            autoCorrect= {false}
                            placeholder="Confirm new password"
                            value={confirmNewPassword}
                            onChangeText={this.onChangeConfirm}
                            returnKeyType='next'
                            secureTextEntry={true}
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

/* NAVIGATION */
export default ChangePassword;
