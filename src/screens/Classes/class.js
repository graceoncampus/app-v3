import React, { Component } from 'react';
import {
  TouchableOpacity, ScrollView, Alert
} from 'react-native';
import { Divider, Button, Title, View, Screen, Text, Caption } from '@shoutem/ui';
import firebase from 'react-native-firebase';

export default class classDetails extends Component {
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

  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
    };
    this.unenroll = this.unenroll.bind(this);
    this.isEnrolled = this.isEnrolled.bind(this);
    this.enroll = this.enroll.bind(this);
    this.props.getClassPerm();
  }

  componentWillReceiveProps = (nextProps) => {
    const data = nextProps.userInfo;
    this.setState({
      userInfo: data,
    });
  }

  unenroll() {
    const { classData } = this.props;
    const { key } = this.props.navigation.state.params;
    const numSpots = classData[key].openSpots;
    this.props.classUnenroll(key, numSpots);
  }

  enroll() {
    const { classData } = this.props;
    const { key } = this.props.navigation.state.params;
    const numSpots = classData[key].openSpots;
    if (!this.isEnrolled()) {
      this.props.classEnroll(key, numSpots);
    }
  }

  isEnrolled() {
    const { classData } = this.props;
    const { key } = this.props.navigation.state.params;
    const currentUid = firebase.auth().currentUser.uid;
    const allStudents = classData[key].students;
    for (const student in allStudents) {
      if (allStudents.hasOwnProperty(student)) {
        if (currentUid === allStudents[student].uid) {
          return true;
        }
      }
    }
    return false;
  }

  renderButton() {
    const { classData } = this.props;
    const { key, instructor } = this.props.navigation.state.params;
    if(classData[key].openSpots == 0 && !this.isEnrolled()) {
      return (
        <Button styleName="red" onPress={() => Alert.alert('','Sorry, class is still full')}>
          <Text>Class Full</Text>
        </Button>
      )
    }
    if (this.isEnrolled()) {
      return (
        <Button styleName="red" onPress={() => this.unenroll()}>
          <Text>Unenroll</Text>
        </Button>
      );
    }
    return (
      <Button onPress={() => this.enroll()}>
        <Text>Enroll</Text>
      </Button>
    );
  }

  render = () => {
    const { classData } = this.props;
    const { key, instructor } = this.props.navigation.state.params;
    const { title, location, startDate, endDate, deadline, totalSpots, openSpots, details, day, classTime } = classData[key];
    return (
      <Screen>
        <Divider />
        <View styleName='vertical h-center' style={{ borderBottomWidth: 1, borderBottomColor: '#ecedef' }} >
          <Title>{title}</Title>
          <Divider />
          {instructor &&
              <Caption><Caption styleName="bold">Instructor: </Caption>{instructor}</Caption>
          }
          {location &&
              <Caption><Caption styleName="bold">Location: </Caption>{location}</Caption>
          }
          <Caption><Caption styleName="bold">Dates: </Caption>{moment.unix(startDate).format('MMMM Do')} - {moment.unix(endDate).format('MMMM Do')}</Caption>
          <Caption><Caption styleName="bold">Time: </Caption><Caption >{classTime}</Caption></Caption>
          <Caption><Caption styleName="bold">Day of the Week: </Caption><Caption >{day}</Caption></Caption>
          {deadline &&
              <Caption><Caption styleName="bold">Enroll By: </Caption>
                {moment.unix(deadline).format('MMMM Do')}</Caption>
          }
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
          (this.state.userInfo != null && this.state.userInfo.classes === 1) &&
           <View style={{ padding: 25 }} styleName='vertical h-center v-end'>
             <Button onPress={() => { this.props.navigation.navigate('ClassInfo', { key, instructor }); }}>
               <Text>VIEW CLASS INFORMATION</Text>
             </Button>
           </View>
        }
        {
          (firebase.auth().currentUser && this.state.userInfo.classes !== 1) &&
          <View style={{ paddingHorizontal: 25, paddingVertical: 15 }}>
            {this.renderButton()}
          </View>
        }
      </Screen>
    );
  }
}