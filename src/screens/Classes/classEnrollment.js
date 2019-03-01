import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Title, View, Icon, Caption, Row, ListView, Subtitle, Divider } from '@shoutem/ui';
import { Screen } from '../../components';
import { headerStyles } from '../../theme';
import { Back } from '../../icons';

export default class classEnrollment extends Component {
  static navigationOptions = ({ navigation }) => ({
      title: 'ENROLLMENT INFORMATION',
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
    this.renderRow = this.renderRow.bind(this);
    this.state = { 
      data: this.props.navigation.getParam('classData'),
    };
  }

  renderRow(student) {
    const UID = student.UID;
    return(
      <TouchableOpacity onPress={() => { this.props.navigation.navigate('UserInformation', { UID }); }}>
        <Divider styleName='line' />
        <Row styleName="small">
          <Subtitle styleName='bold'>{`${student.name}`}</Subtitle>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
        <Divider styleName='line' />
      </TouchableOpacity>
    );
  }

  render = () => {
    const { classTime, day, endDate, instructor, location, openSpots, startDate, title, totalSpots, students } = this.state.data;
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const startMonth = months[startDate.getMonth()];
    const startDay = startDate.getDate();
    const endMonth = months[endDate.getMonth()];
    const endDay = endDate.getDate();

    return (
      <Screen>
      <View styleName='vertical h-center' style={{ borderBottomWidth: 0.4, borderBottomColor: '#ecedef' }} >
        <Divider />
        <Title>{ title } </Title>
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
      <ListView
        data={students}
        renderRow={this.renderRow}
        />
      </Screen> 
    );
  }
}