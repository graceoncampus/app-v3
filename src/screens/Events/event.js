import React, { Component } from 'react';
import {
  TouchableOpacity, ScrollView, Linking, View, Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { headerStyles } from '../../theme';
import { months } from '../../utils';
import { Screen, Divider, Text } from '../../components';
import { Back } from '../../icons';

function parseAndFindURLs(summary) {
  // Can only add one link per event description using this method
  const re = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  let url = '';
  let link = ''; // in event url does not start with https://
  url = summary.match(re);
  summary = summary.replace(/\\n/g, '\n');
  summary = summary.replace(/\\r/g, '\r');
  if (url) {
    url = url[0].trim();
    link = url;
    const prefix = 'https://';
    if (url.substr(0, prefix.length) !== prefix) link = prefix + link;
  }
  if (url !== '') {
    const text = summary.split(url);
    return [text[0], link, text[1]];
  }
  return [summary, '', ''];
}

function convertToTwelveHourTime(hour) {
  if (hour >= 12) {
    hour -= 12;
  }
  if (hour === 0) {
    return 12;
  }
  return hour;
}

function convertToMinutes(minutes) {
  let minutesString = minutes.toString();
  if (minutesString.length === 1) {
    minutesString = `0${minutesString}`;
  }
  return minutesString;
}

function getAMorPM(hour) {
  if (hour >= 12) return 'PM';
  return 'AM';
}

export default class Event extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('title', 'EVENT'),
    headerLeft: (
      <TouchableOpacity style={{ paddingLeft: 8 }} onPress={() => navigation.goBack()}>
        <Back />
      </TouchableOpacity>
    ),
    headerRight: <View />,
    ...headerStyles
  });

  render() {
    const { navigation } = this.props;
    const data = navigation.getParam('event');
    const description = parseAndFindURLs(data.summary);

    const startMonth = months[data.startDate.getMonth()];
    const endMonth = months[data.endDate.getMonth()];
    const startDay = data.startDate.getDate();
    const endDay = data.endDate.getDate();
    const startTime = `${convertToTwelveHourTime(data.startDate.getHours())}:${convertToMinutes(
      data.startDate.getMinutes()
    )}`;
    const endTime = `${convertToTwelveHourTime(data.endDate.getHours())}:${convertToMinutes(
      data.endDate.getMinutes()
    )}`;
    const startAMorPM = getAMorPM(data.startDate.getHours());
    const endAMorPM = getAMorPM(data.endDate.getHours());

    return (
      <Screen>
        <FastImage
          styleName="large-banner"
          style={{
            width: Dimensions.get('window').width,
            height: (910 / 2104) * Dimensions.get('window').width
          }}
          source={{
            uri: data.mobileImage === '' ? 'https://placeimg.com/640/480/nature' : data.mobileImage
          }}
        />
        <View
          styleName="vertical h-center"
          style={{ padding: 15 }}
        >
          {data.location && (
            <Text styleName="caption">
              <Text styleName="caption bold">Where: </Text>
              <Text styleName="caption">{data.location}</Text>
            </Text>
          )}
          {startMonth === endMonth && startDay === endDay ? (
            <Text styleName="caption">
              <Text styleName="caption bold">When: </Text>
              <Text styleName="caption">{`${startMonth} ${startDay}, ${startTime} ${startAMorPM} - ${endTime} ${endAMorPM}`}</Text>
            </Text>
          ) : (
            <Text styleName="caption">
              <Text styleName="caption bold">When: </Text>
              <Text styleName="caption">{`${startMonth} ${startDay} - ${endMonth} ${endDay}`}</Text>
            </Text>
          )}
        </View>
        <Divider type="line" />
        <ScrollView>
          {data.summary && (
            <View
              style={{
                backgroundColor: 'white',
                padding: 15
              }}
            >
              <Text styleName="paragraph">{description[0]}</Text>
              <Text styleName="paragraph">
                {description[1] && (
                  <Text
                    styleName="paragraph"
                    style={{ color: '#ae956b' }}
                    onPress={() => Linking.openURL(description[1])}
                  >
                    {description[1]}
                  </Text>
                )}
              </Text>
              <Text styleName="paragraph">{description[2]}</Text>
            </View>
          )}
        </ScrollView>
      </Screen>
    );
  }
}
