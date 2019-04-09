import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Screen } from '../components';

import globalStyles, { headerStyles } from '../theme';
import { Meta } from './Home/announcement';
import { Back, Edit } from '../icons';

export default class Post extends Component {
    static navigationOptions = ({ navigation }) => ({
      title: navigation.getParam('title', 'ANNOUNCEMENT'),
      headerLeft: (
        <TouchableOpacity style={{ paddingLeft: 8 }} onPress={() => navigation.goBack()}>
          <Back />
        </TouchableOpacity>
      ),
      headerRight: navigation.getParam('admin', false) && !navigation.getParam('isPreview', false) ? (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => {
            navigation.navigate('EditPost', {
              isEditing: true,
              announcement: navigation.getParam('announcement', {}),
            });
          }}
        >
          <Edit />
        </TouchableOpacity>
      ) : <View />,
      ...headerStyles,
    })

    constructor(props) {
      super(props);
      this.state = {
        announcement: props.navigation.state.params.announcement
      };
    }

    render() {
      const { announcement } = this.state;
      return (
        <Screen>
          <View style={[
            globalStyles.vertical,
            globalStyles.vvStart,
            { paddingTop: 15, paddingHorizontal: 25 },
          ]}
          >
            <Meta announcement={announcement} />
          </View>
        </Screen>
      );
    }
}
