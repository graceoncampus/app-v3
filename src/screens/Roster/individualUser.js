import React, { Component } from 'react';
import { Linking, TouchableOpacity, ScrollView } from 'react-native';
import { Icon, Button, Title, View, Screen, Text, Caption, Heading, Image, Spinner } from '@shoutem/ui';
import { headerStyles } from '../../theme';
import { Back } from '../../icons';
import firebase from 'react-native-firebase';

export default class IndividualUser extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'USER INFORMATION',
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
        const thisUserUID = this.props.navigation.getParam('UID');
        this.ref = firebase.firestore().collection('users').doc(`${thisUserUID}`);
        this.unsubscribe = null;
        this.state = {
            userData: {},
            loading: true,
        }
    }

    componentDidMount() { this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate); }
  
    componentWillUnmount() { this.unsubscribe(); }
  
    onCollectionUpdate = (docs) => {
        this.setState({
            userData: docs.data(),
            loading: false,
        });
    }

    render = () => {
        const user = this.state.userData;
        const name = `${user.firstName} ${user.lastName}`;
        const bday = user.birthday // NEED TO CONVERT UNIX BIRTHDAY TO REGULAR DATE
        const academic = `Class of ${user.grad}, ${user.major}`;
        const image = require('../../images/sample.png');
        if(this.state.loading == false) {
            return (
            <Screen>
                <ScrollView style={{ backgroundColor: 'white' }}>
                <View styleName='vertical h-center' style={{ backgroundColor: 'white', paddingTop: 25, paddingBottom: 25 }}>
                    <Image
                    style={{ width: 150, height: 150, marginBottom: 10, borderRadius: 75, borderWidth: 4, borderColor: 'white' }}
                    source={image}
                    />
                    <Heading>{name}</Heading>
                    <Caption>{academic}</Caption>
                </View>
                <View styleName='horizontal space-between' style={{ paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ecedef', borderTopWidth: 1, borderTopColor: '#ecedef'}}>
                    <View>
                    <Button styleName='stacked clear' onPress={() => Linking.openURL(`tel:${user.phoneNumber}`)} >
                        <Icon name="call" />
                        <Text>CALL</Text>
                    </Button>
                    </View>
                    <View>
                    <Button styleName='stacked clear' onPress={() => Linking.openURL(`sms:${user.phoneNumber}`)} >
                        <Icon name="social-wall" />
                        <Text>TEXT</Text>
                    </Button>
                    </View>
                    <View>
                    <Button styleName='stacked clear' onPress={() => Linking.openURL(`mailto:${user.email}`)} >
                        <Icon name="email" />
                        <Text>EMAIL</Text>
                    </Button>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', paddingTop: 25, paddingHorizontal: 35, paddingBottom: 25 }}>
                    <Caption>Email</Caption>
                    <Title style={{ fontSize: 18 }}>{user.email}</Title>
                    <Caption style={{ marginTop: 4 }}>Phone</Caption>
                    <Title style={{ fontSize: 18 }}>{user.phoneNumber}</Title>
                    { user.address !== '' &&
                    <View>
                        <Caption style={{ marginTop: 4 }}>Birthday</Caption>
                        <Title style={{ fontSize: 18 }}>{bday}</Title>
                    </View>
                    }
                    { user.address !== '' &&
                    <View>
                        <Caption style={{ marginTop: 4 }}>Address</Caption>
                        <Title style={{ fontSize: 18 }}>{user.address}</Title>
                    </View>
                    }
                    { user.homeChurch !== '' &&
                    <View>
                        <Caption style={{ marginTop: 4 }}>Home Church</Caption>
                        <Title style={{ fontSize: 18 }}>{user.homeChurch}</Title>
                    </View>
                    }
                </View>
                </ScrollView>
            </Screen>
            );
        }
        return (
        <Screen>
            <View styleName='vertical fill-parent v-center h-center'>
            <Spinner size="large" />
            </View>
        </Screen>
        );
    }
}
