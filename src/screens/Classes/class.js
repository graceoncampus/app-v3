import React, { Component } from 'react';
import { TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Title, View, Text, Caption } from '@shoutem/ui';
import { Button, Divider, Screen } from '../../components';
import firebase from 'react-native-firebase';
import globalStyles, { headerStyles } from '../../theme';
import { Back } from '../../icons';
import { getCurrentUserData } from '../../utils';

export default class classDetails extends Component {
  static navigationOptions = ({ navigation }) => ({
      title: 'CLASS',
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
      data: {},
      thisUserData: {},
    }
    this.enroll = this.enroll.bind(this);
    this.unenroll = this.unenroll.bind(this);
  }

  componentWillMount() {
    thisUserData = getCurrentUserData();
    this.setState({
      data: this.props.navigation.getParam('data'),
      thisUserData,
    })
  }

  enroll() {
    var newData = this.state.data;
    const currentUid = firebase.auth().currentUser.uid;
    const currentName = this.state.thisUserData.firstName + ' ' + this.state.thisUserData.lastName;
    const toAdd = { UID: currentUid, name: currentName};
    newData.students.push(toAdd);
    newData.openSpots = newData.openSpots-1;
    newData.isEnrolled = true;
    firebase.firestore().collection('classes').doc(`${newData.key}`).update({
      students: newData.students,
      openSpots: newData.openSpots,
    });
    this.setState({
      data: newData,
    });
  }

  unenroll() {
    var newData = this.state.data;
    const currentUid = firebase.auth().currentUser.uid;
    newData.students = newData.students.filter(function(e) { return e.UID != currentUid });
    newData.openSpots = newData.openSpots+1;
    newData.isEnrolled = false;
    firebase.firestore().collection('classes').doc(`${newData.key}`).update({
      students: newData.students,
      openSpots: newData.openSpots,
    });
    this.setState({
      data: newData,
    });
  }

  // NEED TO MAKE UNENROLL AND CLASS FULL BUTTONS RED
  renderButton() {
    const { openSpots, isEnrolled } = this.state.data;
    if(openSpots == 0 && !isEnrolled) {
      return (
        <Button style={{ marginBottom: 15 }} onPress={() => Alert.alert('','Sorry, class is still full')}>
          <Text>CLASS FULL</Text>
        </Button>
      )
    }
    if (isEnrolled) {
      return (
        <Button style={{ marginBottom: 15 }} onPress={() => this.unenroll()}>
          <Text style={globalStyles.buttonText}>UNENROLL</Text>
        </Button>
      );
    }
    return (
      <Button style={{ marginBottom: 15 }} onPress={() => this.enroll()}>
        <Text style={globalStyles.buttonText}>ENROLL</Text>
      </Button>
    );
  }

  render = () => {
    const classData = this.state.data;
    const { classTime, day, details, endDate, instructor, location, openSpots, startDate, title, totalSpots, isEnrolled } = this.state.data;
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const startMonth = months[startDate.getMonth()];
    const startDay = startDate.getDate();
    const endMonth = months[endDate.getMonth()];
    const endDay = endDate.getDate();
    var permissions = this.state.thisUserData.permissions;

    return (
      <Screen>
      <View styleName='vertical h-center' style={{ borderBottomWidth: 1, borderBottomColor: '#ecedef' }} >
        <Divider />
        <Title>{ title }</Title>
        <Divider />
        {instructor &&
            <Caption><Caption styleName="bold">Instructor: </Caption>{instructor}</Caption>
        }
        {location &&
            <Caption><Caption styleName="bold">Location: </Caption>{location}</Caption>
        }
        <Caption><Caption styleName="bold">Dates: </Caption><Caption >{startMonth} {startDay} - {endMonth} {endDay}</Caption></Caption>
        <Caption><Caption styleName="bold">Time: </Caption><Caption >{day}, {classTime}</Caption></Caption>
        {totalSpots &&
            <Caption><Caption styleName="bold">Spots Left: </Caption>
              {openSpots}/{totalSpots}</Caption>
        }
        <Divider />
      </View>
      <ScrollView>
        { details &&
          <View style={{ backgroundColor: 'white', paddingTop: 35, paddingHorizontal: 35, paddingBottom: 50 }}>
            <Text>
              { details }
            </Text>
          </View>
        }
      </ScrollView>
      {
        (permissions!= null && permissions.classes === 1) &&
        <View style={{ flex: 0.25, paddingHorizontal: 25 }} styleName='vertical h-center v-end'>
        <Button style={{ marginBottom: 15 }} onPress={() => { this.props.navigation.navigate('ClassEnrollment', { classData }); }}>
        <Text style={globalStyles.buttonText}>VIEW ENROLLMENT</Text>
        </Button>
        </View>
      }
      {
        (firebase.auth().currentUser) &&
        <View style={{ flex: 0.25, paddingHorizontal: 25 }} styleName='vertical h-center v-end'>
        {this.renderButton()}
        </View>
      }
      </Screen> 
    );
  }
}