import React, { Component, Fragment } from 'react';
import {
  TouchableOpacity, Alert, ScrollView, View
} from 'react-native';
import firebase from 'react-native-firebase';
import LinearGradient from 'react-native-linear-gradient';
import {
  Button, Divider, Screen, Text
} from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { Back } from '../../icons';
import { getCurrentUserData, months } from '../../utils';

export default class classDetails extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'CLASS',
    headerLeft: (
      <TouchableOpacity style={{ paddingLeft: 8 }} onPress={() => navigation.goBack()}>
        <Back />
      </TouchableOpacity>
    ),
    headerRight: <View />,
    ...headerStyles
  });

  constructor(props) {
    super(props);
    this.state = {
      data: props.navigation.getParam('data'),
      thisUserData: getCurrentUserData()
    };
  }

  enroll = () => {
    const { data: newData, thisUserData } = this.state;
    const currentUid = firebase.auth().currentUser.uid;
    const currentName = `${thisUserData.firstName} ${thisUserData.lastName}`;
    const toAdd = { UID: currentUid, name: currentName };
    newData.students.push(toAdd);
    newData.openSpots -= 1;
    newData.isEnrolled = true;
    firebase
      .firestore()
      .collection('classes')
      .doc(`${newData.key}`)
      .update({
        students: newData.students,
        openSpots: newData.openSpots
      });
    this.setState({
      data: newData
    });
  };

  unenroll = () => {
    const { data: newData } = this.state;
    const currentUid = firebase.auth().currentUser.uid;
    newData.students = newData.students.filter(e => e.UID !== currentUid);
    newData.openSpots += 1;
    newData.isEnrolled = false;
    firebase
      .firestore()
      .collection('classes')
      .doc(`${newData.key}`)
      .update({
        students: newData.students,
        openSpots: newData.openSpots
      });
    this.setState({
      data: newData
    });
  };

  renderButton() {
    const {
      data: { openSpots, isEnrolled }
    } = this.state;
    if (openSpots === 0 && !isEnrolled) {
      return (
        <Button
          style={{ marginBottom: 15, backgroundColor: 'red' }}
          onPress={() => Alert.alert('', 'Sorry, class is still full')}
        >
          <Text>CLASS FULL</Text>
        </Button>
      );
    }
    if (isEnrolled) {
      return (
        <Button
          style={{ marginBottom: 15, backgroundColor: 'red' }}
          onPress={() => this.unenroll()}
        >
          <Text style={globalStyles.buttonText}>UNENROLL</Text>
        </Button>
      );
    }
    return (
      <Button style={{ marginBottom: 15, backgroundColor: 'green' }} onPress={() => this.enroll()}>
        <Text style={globalStyles.buttonText}>ENROLL</Text>
      </Button>
    );
  }

  render = () => {
    const {
      thisUserData,
      data,
    } = this.state;
    const {
      classTime,
      day,
      details,
      endDate,
      instructor,
      location,
      openSpots,
      startDate,
      title,
      totalSpots,
    } = data;
    const { navigation } = this.props;
    const startMonth = months[startDate.getMonth()];
    const startDay = startDate.getDate();
    const endMonth = months[endDate.getMonth()];
    const endDay = endDate.getDate();
    return (
      <Screen style={{ flexDirection: 'column' }}>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#ecedef',
            paddingHorizontal: 35
          }}
        >
          <Divider />
          <Text>{title}</Text>
          <Divider height={10} />
          {instructor && (
            <Text>
              <Text styleName="caption bold">Instructor: </Text>
              <Text styleName="caption">{instructor}</Text>
            </Text>
          )}
          {location && (
            <Text>
              <Text styleName="caption bold">Location: </Text>
              <Text styleName="caption">{location}</Text>
            </Text>
          )}
          <Text>
            <Text styleName="caption bold">Dates: </Text>
            <Text styleName="caption">{`${startMonth} ${startDay} - ${endMonth} ${endDay}`}</Text>
          </Text>
          <Text>
            <Text styleName="caption bold">Time: </Text>
            <Text styleName="caption">{`${day}, ${classTime}`}</Text>
          </Text>
          {totalSpots && (
            <Text>
              <Text styleName="caption bold">Spots Left: </Text>
              <Text styleName="caption">{`${openSpots}/${totalSpots}`}</Text>
            </Text>
          )}
          <Divider height={20} />
        </View>
        <ScrollView styleName="vertical h-center">
          {details && (
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                paddingVertical: 25,
                paddingHorizontal: 35
              }}
            >
              <Text styleName="paragraph">{details}</Text>
            </View>
          )}
        </ScrollView>
        <LinearGradient
          style={{ marginTop: -30, width: 1000, height: 30 }}
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
          pointerEvents="none"
        />
        <View
          style={{
            height:
              thisUserData && thisUserData.permissions && thisUserData.permissions.classes === 1
                ? 130
                : 65,
            marginTop: 15,
            paddingHorizontal: 25
          }}
          styleName="vertical h-center v-end v-center"
        >
          {thisUserData && thisUserData.permissions && thisUserData.permissions.classes === 1 && (
            <Button
              clear
              style={{ marginBottom: 15 }}
              onPress={() => {
                navigation.navigate('ClassEnrollment', {
                  students: data.students,
                  title
                });
              }}
            >
              <Text style={globalStyles.buttonTextGold}>VIEW ENROLLMENT</Text>
            </Button>
          )}
          {firebase.auth().currentUser && <Fragment>{this.renderButton()}</Fragment>}
        </View>
      </Screen>
    );
  };
}
