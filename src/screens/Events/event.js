import React, { Component } from 'react';
import {
  TouchableOpacity, ScrollView, Linking,
} from 'react-native';
import { headerStyles } from '../../theme';
import { Divider, View, Screen, Text, Caption, Image } from '@shoutem/ui';
import { Back } from '../../icons';

export default class Event extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('title', 'EVENT'),
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

parseAndFindURLs(summary) {
  // Can only add one link per event description using this method
  const re = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  let url = '';
  let link = ''; // in event url does not start with https://
  url = summary.match(re);
  summary = summary.replace(/\\n/g,'\n');
  summary = summary.replace(/\\r/g,'\r');
  if (url) {
    url = url[0].trim();
    link = url;
    var prefix = 'https://';
    if (url.substr(0, prefix.length) !== prefix)
      link = prefix + link;
  }
  if (url != '') {
    var text = summary.split(url);
    return ([text[0], link, text[1]]);
  }
  return ([summary, '', '']);
}

convertToTwelveHourTime(hour) {
  if (hour >= 12) {
    hour = hour - 12;
  }
  if (hour == 0) {
    return 12;
  }
  return hour;
}

convertToMinutes(minutes) {
  var minutesString = minutes.toString();
  if (minutesString.length == 1) {
    minutesString = '0' + minutesString;
  }
  return minutesString;
}

getAMorPM(hour) {
  if (hour >= 12)
    return 'PM';
  else
    return 'AM';
}

  render() {
    const data = this.props.navigation.getParam('event');
    const description = this.parseAndFindURLs(data.summary);
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const startMonth = months[data.startDate.getMonth()];
    const endMonth = months[data.endDate.getMonth()];
    const startDay = data.startDate.getDate();
    const endDay = data.endDate.getDate();
    const startTime = this.convertToTwelveHourTime(data.startDate.getHours()) + ':' + this.convertToMinutes(data.startDate.getMinutes());
    const endTime = this.convertToTwelveHourTime(data.endDate.getHours()) + ':' + this.convertToMinutes(data.endDate.getMinutes());
    const startAMorPM = this.getAMorPM(data.startDate.getHours());
    const endAMorPM = this.getAMorPM(data.endDate.getHours());
    
    return (
      <Screen>
        <Image
          styleName="large-banner"
          source={{ uri: data.mobileImage === '' ? 'https://placeimg.com/640/480/nature' : data.mobileImage }}
        >
        </Image>
        <Divider />
        <View styleName='vertical h-center' style={{ borderBottomWidth: 1, borderBottomColor: '#ecedef' }} >
          {data.location &&
              <Caption><Caption styleName="bold">Where: </Caption>{data.location}</Caption>
          }
          {startMonth === endMonth && startDay === endDay ?
            <Caption><Caption styleName="bold">When: </Caption>{startMonth} {startDay}, {startTime} {startAMorPM} - {endTime} {endAMorPM}</Caption>
            :
            <Caption><Caption styleName="bold">When: </Caption>{startMonth} {startDay} - {endMonth} {endDay}</Caption>
          }
          <Divider />
        </View>
        <ScrollView>
        { data.summary &&
        <View style={{ backgroundColor: 'white', paddingTop: 35, paddingHorizontal: 35, paddingBottom: 50 }}>
          <Text> {description[0]}</Text>
          { (description[1] != null) &&
            <Text style={{ color: '#ae956b' }} onPress={() => Linking.openURL(description[1])} >
              {description[1]}
            </Text>
          }
          <Text>{description[2]}</Text>
         </View>
        }
        </ScrollView>
      </Screen>
    );
  }
}
