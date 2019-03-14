import React, { Component, Fragment } from "react";
import { TouchableOpacity, Alert } from "react-native";
import { Title, View, Text, ScrollView } from "@shoutem/ui";
import { Button, Divider, Screen, Text as CustomText } from "../../components";
import firebase from "react-native-firebase";
import globalStyles, { headerStyles } from "../../theme";
import { Back } from "../../icons";
import { getCurrentUserData } from "../../utils";
import LinearGradient from 'react-native-linear-gradient';
export default class classDetails extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "CLASS",
    headerLeft: (
      <TouchableOpacity
        style={{ padding: 15 }}
        onPress={() => navigation.goBack()}
      >
        <Back />
      </TouchableOpacity>
    ),
    headerRight: <View />,
    ...headerStyles
  });

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      thisUserData: {}
    };
    this.enroll = this.enroll.bind(this);
    this.unenroll = this.unenroll.bind(this);
  }

  componentWillMount() {
    thisUserData = getCurrentUserData();
    this.setState({
      data: this.props.navigation.getParam("data"),
      thisUserData
    });
  }

  enroll() {
    var newData = this.state.data;
    const currentUid = firebase.auth().currentUser.uid;
    const currentName =
      this.state.thisUserData.firstName +
      " " +
      this.state.thisUserData.lastName;
    const toAdd = { UID: currentUid, name: currentName };
    newData.students.push(toAdd);
    newData.openSpots = newData.openSpots - 1;
    newData.isEnrolled = true;
    firebase
      .firestore()
      .collection("classes")
      .doc(`${newData.key}`)
      .update({
        students: newData.students,
        openSpots: newData.openSpots
      });
    this.setState({
      data: newData
    });
  }

  unenroll() {
    var newData = this.state.data;
    const currentUid = firebase.auth().currentUser.uid;
    newData.students = newData.students.filter(function(e) {
      return e.UID != currentUid;
    });
    newData.openSpots = newData.openSpots + 1;
    newData.isEnrolled = false;
    firebase
      .firestore()
      .collection("classes")
      .doc(`${newData.key}`)
      .update({
        students: newData.students,
        openSpots: newData.openSpots
      });
    this.setState({
      data: newData
    });
  }

  renderButton() {
    const { openSpots, isEnrolled } = this.state.data;
    if (openSpots == 0 && !isEnrolled) {
      return (
        <Button
          style={{ marginBottom: 15, backgroundColor: "red" }}
          onPress={() => Alert.alert("", "Sorry, class is still full")}
        >
          <Text>CLASS FULL</Text>
        </Button>
      );
    }
    if (isEnrolled) {
      return (
        <Button
          style={{ marginBottom: 15, backgroundColor: "red" }}
          onPress={() => this.unenroll()}
        >
          <Text style={globalStyles.buttonText}>UNENROLL</Text>
        </Button>
      );
    }
    return (
      <Button
        style={{ marginBottom: 15, backgroundColor: "green" }}
        onPress={() => this.enroll()}
      >
        <Text style={globalStyles.buttonText}>ENROLL</Text>
      </Button>
    );
  }

  render = () => {
    const classData = this.state.data;
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
      isEnrolled
    } = this.state.data;
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const startMonth = months[startDate.getMonth()];
    const startDay = startDate.getDate();
    const endMonth = months[endDate.getMonth()];
    const endDay = endDate.getDate();
    var permissions = this.state.thisUserData.permissions;

    return (
      <Screen style={{ flexDirection: "column" }}>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#ecedef",
            paddingHorizontal: 35
          }}
        >
          <Divider />
          <Title>{title}</Title>
          <Divider height={10} />
          {instructor && (
            <CustomText>
              <CustomText styleName="caption bold">Instructor: </CustomText>
              <CustomText styleName="caption">{instructor}</CustomText>
            </CustomText>
          )}
          {location && (
            <CustomText>
              <CustomText styleName="caption bold">Location: </CustomText>
              <CustomText styleName="caption">{location}</CustomText>
            </CustomText>
          )}
          <CustomText>
            <CustomText styleName="caption bold">Dates: </CustomText>
            <CustomText styleName="caption">
              {startMonth} {startDay} - {endMonth} {endDay}
            </CustomText>
          </CustomText>
          <CustomText>
            <CustomText styleName="caption bold">Time: </CustomText>
            <CustomText styleName="caption">
              {day}, {classTime}
            </CustomText>
          </CustomText>
          {totalSpots && (
            <CustomText>
              <CustomText styleName="caption bold">Spots Left: </CustomText>
              <CustomText styleName="caption">
                {openSpots}/{totalSpots}
              </CustomText>
            </CustomText>
          )}
          <Divider height={20} />
        </View>
        <ScrollView styleName="vertical h-center">
          {details && (
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                paddingVertical: 25,
                paddingHorizontal: 35
              }}
            >
              <CustomText styleName="paragraph">{details}</CustomText>
            </View>
          )}
        </ScrollView>
        <LinearGradient
          style={{marginTop: -30, width: 1000, height:30}}
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
          pointerEvents={'none'}
        />
        <View
          style={{ height: permissions != null && permissions.classes === 1 ? 130 : 65, marginTop: 15, paddingHorizontal: 25 }}
          styleName="vertical h-center v-end v-center"
        >
          {permissions != null && permissions.classes === 1 && (
            <Button clear
              style={{ marginBottom: 15 }}
              onPress={() => {
                this.props.navigation.navigate("ClassEnrollment", {
                  classData
                });
              }}
            >
              <CustomText style={globalStyles.buttonTextGold}>
                VIEW ENROLLMENT
              </CustomText>
            </Button>
          )}
          {firebase.auth().currentUser && (
            <Fragment>
              {this.renderButton()}
            </Fragment>
          )}
        </View>
      </Screen>
    );
  };
}
