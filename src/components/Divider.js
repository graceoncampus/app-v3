import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  divider: {
    alignSelf: 'stretch',
    paddingTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  line: {
    paddingTop: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5e5'
  },
  sectionHeader: {
    paddingTop: 23,
    backgroundColor: '#F2F2F2',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5e5'
  }
});

export default class Divider extends PureComponent {
  render() {
    const {
      type, height, style, children
    } = this.props;
    return (
      <View
        style={[
          styles.divider,
          type && styles[type],
          height && { paddingTop: height },
          style
        ]}
      >
        {children}
      </View>
    );
  }
}
