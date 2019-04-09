import React, { Component, Fragment } from 'react';
import { TouchableOpacity, View, FlatList } from 'react-native';
import { Screen, Divider, Text } from '../../components';
import globalStyles, { headerStyles } from '../../theme';
import { Back, Chevron } from '../../icons';

export default class classEnrollment extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('title', 'ENROLLMENT INFO'),
    headerLeft: (
      <TouchableOpacity style={{ paddingLeft: 8 }} onPress={() => navigation.goBack()}>
        <Back />
      </TouchableOpacity>
    ),
    headerRight: <View />,
    ...headerStyles
  });

  constructor(props) {
    super(props);
    this.state = {
      students: props.navigation.getParam('students', []).map(s => ({ key: s.uid, ...s }))
    };
  }

  renderRow = (student) => {
    const { UID, name } = student.item;
    const { navigation } = this.props;
    return (
      <Fragment>
        <TouchableOpacity
          key={student.key}
          onPress={() => (UID !== '' ? navigation.navigate('UserInformation', { UID }) : null)}
          style={[globalStyles.row, globalStyles.spaceBetween]}
        >
          <Text styleName="bold subtitle">{`${name}`}</Text>
          {UID !== '' && (
            <View>
              <Chevron style={{ marginTop: 0 }} />
            </View>
          )}
        </TouchableOpacity>
        <Divider type="line" />
      </Fragment>
    );
  };

  render = () => {
    const { students } = this.state;
    return (
      <Screen>
        <FlatList data={students} renderItem={this.renderRow} />
      </Screen>
    );
  };
}
