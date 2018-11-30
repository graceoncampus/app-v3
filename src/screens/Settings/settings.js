import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Title, Tile, Subtitle, FormGroup, Spinner } from '@shoutem/ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Divider, Screen } from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { Menu } from '../../icons';
import firebase from 'react-native-firebase'

export default class Settings extends Component {
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
        this.state = {
            firstName: '',
            lastName: '',
            birthday: '',
            phoneNumber: '',
            address: '',
            grad: '',
            major: '',
            homeChurch: '',
            loading: true,
            success: false,
            submitted: false,
        }
        this.unsubscribe = null;
        currentUid = firebase.auth().currentUser.uid;
        this.ref = firebase.firestore().collection('users').doc(`${currentUid}`);
    };

    componentDidMount() {
        this.ref.get().then(this.onCollectionUpdate);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (docs) => {
        this.setState({
            firstName: docs.data().firstName,
            lastName: docs.data().lastName,
            birthday: docs.data().birthday,
            phoneNumber: docs.data().phoneNumber,
            address: docs.data().address,
            grad: docs.data().grad,
            major: docs.data().major,
            homeChurch: docs.data().homeChurch,
            loading: false,
        });
    }

    onChangeFirstName = (firstName) => { this.setState({ submitted: false, firstName }); }
    onChangeLastName = (lastName) => { this.setState({ submitted: false, lastName }); }

    renderButton = () => {
        if (this.state.loading && !this.state.success) {
          return (
            <Button style={{ marginBottom: 15, paddingVertical: 15 }}>
                <Spinner style={{ color: '#fff' }}/>
            </Button>
          );
        }
    
        if (this.state.success) {
          return (
            <Button success style={{ marginBottom: 15, backgroundColor: '#0ab435' }}>
                <Text style={globalStyles.buttonText} >UPDATED</Text>
            </Button>
          );
        }
    
        return (
            <Button style={{ marginBottom: 15 }} onPress={() => this.updateInfo}>
                <Text style={globalStyles.buttonText} >UPDATE ACCOUNT</Text>
            </Button>
        );
    }

    updateInfo = () => {
        this.setState({ loading: true });
        const { firstName, lastName, birthday, phoneNumber, address, grad, major, homeChurch, loading } = this.state;
        // check if required fields are filled out, show error message if not filled out properly

        // if information filled out correctly, push data to Firebase, update state ( loading: false, submitted: true )
      }

    render = () => {
        const { firstName, lastName, birthday, phoneNumber, address, grad, major, homeChurch, loading } = this.state;

        if(loading) {
            return (
                <Screen></Screen>
            )
        }
        return (
            <Screen>
                <KeyboardAwareScrollView>
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
                            <Text>First Name </Text>
                            <Text style={{ color: '#b40a34' }}>* </Text>
                        </View>
                        <TextInput
                        style={{height: 42, backgroundColor: 'white', borderColor: 'gray', borderWidth: 0.4}}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={firstName}
                        onChangeText={this.onChangeFirstName}
                        returnKeyType='next'
                        />
                        <View style={{ paddingTop: 12, paddingBottom: 4, flexDirection: 'row'}}>
                            <Text>Last Name </Text>
                            <Text style={{ color: '#b40a34' }}>* </Text>
                        </View>
                        <TextInput
                        style={{height: 42, backgroundColor: 'white', borderColor: 'gray', borderWidth: 0.4}}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={lastName}
                        onChangeText={this.onChangeLastName}
                        returnKeyType='next'
                        />
                        <Divider />
                        <View style={{ flex: 0.25 }} styleName='vertical h-center v-end'>
                            {this.renderButton()}
                        </View>
                    </FormGroup>
                </KeyboardAwareScrollView>
            </Screen>
        )
    }
}