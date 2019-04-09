import React, { Component } from 'react';
import {
  TouchableOpacity, ScrollView, Dimensions, View
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import FastImage from 'react-native-fast-image';
import { AllHtmlEntities } from 'html-entities';
import LinearGradient from 'react-native-linear-gradient';

import { headerStyles } from '../../theme';
import { Screen, Text } from '../../components';
import { Back } from '../../icons';
import { getRelativeTime } from '../../utils';

const { width } = Dimensions.get('window');
const entities = new AllHtmlEntities();

export default class Blog extends Component {
    // add the back button to the top
    static navigationOptions = ({ navigation }) => ({
      title: entities.decode(navigation.getParam('title', 'BLOG')),
      headerLeft: (
        <TouchableOpacity style={{ paddingLeft: 8 }} onPress={() => navigation.goBack()}>
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
      const { navigation } = props;
      this.state = {
        data: navigation.getParam('blog'),
      };
    }

    render = () => {
      const {
        data: {
          date, image, category, content, title
        }
      } = this.state;
      const cont = `${content.replace(/(\r\n|\n|\r)/gm, '')}\n`;

      return (
        <Screen>
          <ScrollView style={{ flex: 1 }}>
            {
              image && (
                <FastImage
                  source={{ uri: image }}
                  style={{
                    width,
                    height: (222 / 375) * width
                  }}
                />
              )
            }
            <View style={{
              padding: 15,
              paddingBottom: 20
            }}
            >
              <Text styleName="bold" style={{ marginVertical: 6 }}>{entities.decode(title)}</Text>
              <Text styleName="caption" style={{ marginBottom: 10 }}>{category + getRelativeTime(new Date(date))}</Text>
              <HTMLView paragraphBreak={'\n'} value={cont} renderNode={node => (node.name === 'img' ? null : undefined)} />
            </View>
          </ScrollView>
          <LinearGradient
            style={{ marginTop: -60, width: 1000, height: 60 }}
            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
            pointerEvents="none"
          />
        </Screen>
      );
    }
}
