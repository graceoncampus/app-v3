import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon, Screen, View, Caption, Row, ListView, Divider, Title } from '@shoutem/ui';
import firebase from 'react-native-firebase';
import { headerStyles } from '../../theme';
import { Menu } from '../../icons';

export default class Classes extends Component {
    static navigationOptions = ({ navigation }) => ({
        drawer: () => ({
          label: 'Classes',
        }),
        title: 'CLASSES',
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
    this.ref = firebase.firestore().collection('classes').orderBy('startDate', 'desc');
    this.unsubscribe = null;
    this.state = {
        classes: [],
        loading: true,
    }
  };

  componentDidMount() {
      this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
      this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    var i = 0;
    const iMax = querySnapshot.docs.length;
    const currentUid = firebase.auth().currentUser.uid;
    const classes = new Array(iMax);
    var isEnrolled = false;
    for (; i < iMax; i += 1) {
      const doc = querySnapshot.docs[i];
      for (var i = 0; i < doc.data().students.length; i += 1)
      {
          if(currentUid == doc.data().students[i]) {
            isEnrolled = true;
            break;
          }
      }
      classes[i] = {
        key: doc.id,
        isEnrolled,
        ...doc.data(),
      };
    }
    this.setState({
      classes,
      loading: false,
    });
  }

  renderRow(data) {
    const { title, openSpots, startDate, endDate, key, instructor, isEnrolled, day, classTime} = data;
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const startMonth = months[startDate.getMonth()];
    const startDay = startDate.getDate();
    const endMonth = months[endDate.getMonth()];
    const endDay = endDate.getDate();
    return (
      <TouchableOpacity onPress={() => { this.props.navigation.navigate('Class', { data, title:data.title }); }}>
        <Row>
          <View styleName="vertical stretch space-between">
            <Title>{title}</Title>
            <Caption><Caption styleName="bold">Instructor: </Caption><Caption>{ instructor }</Caption></Caption>
            <Caption><Caption styleName="bold">Dates: </Caption><Caption >{startMonth} {startDay} - {endMonth} {endDay}</Caption></Caption>
            <Caption><Caption styleName="bold">Time: </Caption><Caption >{day}, {classTime}</Caption></Caption>
            <Caption><Caption styleName="bold">Spots Left: </Caption>{ openSpots }</Caption>
          </View>
          { isEnrolled &&
            <Icon style={{ fontSize: 15, color: 'green' }} name="checkbox-on" />
          }
        </Row>
        <Divider styleName='line' />
      </TouchableOpacity>
    );
  }

  render = () => (
    <Screen>
        <ListView
        loading={this.state.loading}
        data={this.state.classes}
        renderRow={this.renderRow}
        />
    </Screen>
  )
}
