import React, { Component } from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { headerStyles } from '../../theme';
import { View, Screen, Caption, Row, Image } from '@shoutem/ui';
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

    renderNode(node, index, siblings, parent, defaultRenderer) {  //render html image differently from htmlview default
      if (node.name == 'img') {
        return ( null );
      }
    }

    render = () => {
      const { date, featured_image, content, attachments } = this.state.data;
      const dateformat = new Date(date);
      const image = featured_image ? featured_image : Object.values(attachments).length ? Object.values(attachments)[0].URL : null
      return (
        <Screen>
          <Row>
            <ScrollView>
              <View styleName='vertical h-center' style={{ borderBottomWidth: 1, borderBottomColor: '#ecedef' }} >
                {image ? <Image style={{width: Dimensions.get('window').width - 30, height: (222/375) * Dimensions.get('window').width}} source={{ uri: image }}/>: null}
                <Caption>{dateformat.toDateString()}</Caption>
                <HTMLView value={content} renderNode={this.renderNode}/>
              </View>
            </ScrollView>
          </Row>
        </Screen>
      );
    }
}