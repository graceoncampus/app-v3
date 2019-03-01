import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import { Screen } from '../../components';
import { View, Subtitle, Icon, Divider, Row, ListView, Spinner, Caption, Tile, Title } from '@shoutem/ui';
import { headerStyles } from '../../theme';
import { Menu } from '../../icons';
import { getCurrentUserData } from '../../utils';

export default class MyRide extends Component {
    static navigationOptions = ({ navigation }) => ({
        drawer: () => ({
            label: 'MyRide',
        }),
        title: 'MY RIDE',
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
        this.renderRow = this.renderRow.bind(this);
        const thisUserData = getCurrentUserData();
        const { carDocID } = thisUserData;
        this.state = {
            myDriverData: {},
            myRidersData: [],
            loading: true,
            isRidesUp: null,
        }
        this.ref = firebase.firestore().collection('rides').doc('current_rides').collection('cars').doc(`${carDocID}`);
        this.unsubscribe = null;
    }

    componentDidMount() { this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate); }
  
    componentWillUnmount() { this.unsubscribe(); }
  
    onCollectionUpdate = (docs) => {
        if (docs.data() !== undefined) {
            var myDriverData = docs.data().car[0];
            var myRidersData = [];
            for(i = 1; i < docs.data().car.length; i++) {
                myRidersData.push(docs.data().car[i]);
            }
            this.setState({
                myDriverData,
                myRidersData,
                loading: false,
                isRidesUp : true,
            });
        }
        else {
            this.setState({
                loading: false,
                isRidesUp: false,
            });
        }
    }

    renderDriver = (driverData) => {
        const UID = driverData.uid;
        if (UID == "") {
            return (
                <View>
                <Divider styleName='line' />
                <Row styleName="small">
                <Subtitle>{`${driverData.name}`}</Subtitle>
                <Caption styleName='h-center v-center'>Driver</Caption>
                </Row>
                <Divider styleName='line' />
                </View>
            );
        }
        else {
        // if person does have a uid in the data then the person has an account.
        // Because of this we give option to display an individual user information page if app user clicks this box.
            return (
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('UserInformation', { UID }); }}>
                <Divider styleName='line' />
                <Row styleName="small">
                <Subtitle styleName='bold'>{`${driverData.name}`}</Subtitle>
                <Caption styleName='h-center v-center'>Driver</Caption>
                <Icon styleName="disclosure" name="right-arrow" />
                </Row>
                <Divider styleName='line' />
                </TouchableOpacity>
            );
        }
    }

    renderRow(data) {
        // if person in car being render in this instance does not have an account, there will uid value will be an empty string.
        // Because of this do not display an individual user information page for this person as it does not exist.
        const UID = data.uid;
        if (UID == "") {
            return (
                <View>
                <Divider styleName='line' />
                <Row styleName="small">
                <Subtitle>{`${data.name}`}</Subtitle>
                </Row>
                <Divider styleName='line' />
                </View>
            );
        }
        else {
        // if person does have a uid in the data then the person has an account.
        // Because of this we give option to display an individual user information page if app user clicks this box.
            return (
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('UserInformation', { UID }); }}>
                <Divider styleName='line' />
                <Row styleName="small">
                <Subtitle styleName='bold'>{`${data.name}`}</Subtitle>
                <Icon styleName="disclosure" name="right-arrow" />
                </Row>
                <Divider styleName='line' />
                </TouchableOpacity>
            );
        }
    }

    render = () => {
        if (!this.state.loading && this.state.isRidesUp) {
            return (
                <Screen>
                    {this.renderDriver(this.state.myDriverData)}
                    <ListView
                    data={this.state.myRidersData}
                    renderRow={this.renderRow}
                    /> 
                </Screen>
            );
        }
        else if (!this.state.loading && !this.state.isRidesUp) {
            return (
                <Screen>
                  <Tile style={{ paddingBottom: 0, flex: 0.8, backgroundColor: 'transparent' }} styleName='text-centric'>
                    <Title>Rides for this Sunday are not up yet!</Title>
                  </Tile>
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
