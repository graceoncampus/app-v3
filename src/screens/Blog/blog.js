import React, { Component } from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { headerStyles } from '../../theme';
import { View, Caption, Image, Tile } from '@shoutem/ui';
import { Screen } from '../../components';
import { Back } from '../../icons';
import HTMLView from 'react-native-htmlview';

export default class Blog extends Component {
    //add the back button to the top
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('title', 'BLOG'),
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
      }
    }

    async componentWillMount() {
      this.setState({
        data: this.props.navigation.getParam('blog'),  //get fetched data from blogs.js 
      })
    }

    renderNode(node, index, siblings, parent, defaultRenderer) {  //don't render img tag
      if (node.name == 'img') {
        return ( null );
      }
    }

    render = () => {
      const { date, featured_image, content, attachments } = this.state.data;
      const dateformat = new Date(date);
      const image = featured_image ? featured_image : Object.values(attachments).length ? Object.values(attachments)[0].URL : null
      let cont = content.replace(/(\r\n|\n|\r)/gm, '') + '\n';

      return (
        <Screen>
          <ScrollView>
            <Tile style={{ paddingTop: 20, paddingBottom: 0, flex: 0.8, backgroundColor: 'transparent' }} styleName='text-centric'>
              <View styleName='vertical' style={{ borderBottomWidth: 1, borderBottomColor: '#ecedef' }} >
                {image ? <Image style={{width: Dimensions.get('window').width - 30, height: (222/375) * Dimensions.get('window').width}} source={{ uri: image }}/>: null}
                <Caption>{dateformat.toDateString()}</Caption>
                <HTMLView value={cont} renderNode={this.renderNode}/>
              </View>
            </Tile>
          </ScrollView>
        </Screen>
      );
    }
}