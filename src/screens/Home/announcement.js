import React from 'react';
import {
  TouchableOpacity, Linking, View, Image
} from 'react-native';

import { Text } from '../../components';
import { Chevron } from '../../icons';
import globalStyles from '../../theme';
import { parseAndFindURLs, getRelativeTime } from '../../utils';

const chrisImage = require('../../images/chris.png');
const gocImage = require('../../images/notification-icon.png');

export const Meta = ({ announcement, truncated }) => {
  const description = truncated ? announcement.post : parseAndFindURLs(announcement.post);
  return (
    <React.Fragment>
      <View style={[globalStyles.horizontal, globalStyles.hvCenter]}>
        <Image
          style={{
            borderRadius: 12,
            width: 24,
            height: 24,
            marginRight: 8
          }}
          source={announcement.role === 'Chris Gee' ? chrisImage : gocImage}
        />
        <View style={globalStyles.vertical}>
          <Text style={[globalStyles.small, globalStyles.bold]}>{announcement.role}</Text>
          {announcement.date && (
            <Text style={[globalStyles.caption, { marginTop: -4 }]}>
              {getRelativeTime(new Date(announcement.date.toString()))}
            </Text>
          )}
        </View>
      </View>
      <View style={[globalStyles.vertical, { marginTop: 12 }]}>
        <Text style={[globalStyles.subtitle, globalStyles.bold, { marginBottom: 5 }]}>
          {announcement.title}
        </Text>
        {truncated ? (
          <Text style={globalStyles.subtitle} numberOfLines={2} ellipsizeMode="tail">
            {description}
          </Text>
        ) : (
          <React.Fragment>
            <Text style={[globalStyles.subtitle]}>{description[0]}</Text>
            {description[1] !== null && (
              <Text
                style={[globalStyles.subtitle, globalStyles.textSecondary]}
                onPress={() => Linking.openURL(description[1])}
              >
                {description[1]}
              </Text>
            )}
            <Text style={[globalStyles.subtitle]}>{description[2]}</Text>
          </React.Fragment>
        )}
      </View>
    </React.Fragment>
  );
};

export default ({ announcement, setRead }) => (
  <TouchableOpacity key={announcement.key} onPress={() => setRead(announcement)}>
    <View style={[{ paddingBottom: 30 }, globalStyles.borderBottom, globalStyles.row]}>
      <View style={[globalStyles.horizontal, globalStyles.hvStart, { flex: 1 }]}>
        <View style={[globalStyles.vertical, { flex: 0.9 }]}>
          <Meta announcement={announcement} truncated />
        </View>
        <View
          style={[
            globalStyles.vertical,
            globalStyles.stretch,
            globalStyles.spaceBetween,
            globalStyles.vhEnd,
            { flex: 0.1 }
          ]}
        >
          <View
            style={{
              width: 8,
              height: 8,
              marginRight: 3,
              marginTop: 3,
              borderRadius: 4,
              backgroundColor: announcement.isRead ? 'transparent' : '#617cce',
              borderColor: '#617cce',
              borderWidth: announcement.isRead ? 1 : 0
            }}
            styleName="notification-dot"
          />
          <Chevron />
          <View
            style={{
              width: 8,
              height: 8,
              marginRight: 3,
              marginTop: 3,
              borderRadius: 4,
              borderWidth: 0.8,
              opacity: 0
            }}
            styleName="notification-dot"
          />
        </View>
      </View>
    </View>
  </TouchableOpacity>
);
