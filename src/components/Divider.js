import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  divider: {
    alignSelf: 'stretch',
    paddingTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    paddingTop: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5e5',
  },
  sectionHeader: {
    paddingTop: 23,
    backgroundColor: '#F2F2F2',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5e5',
  },
});


export default class Divider extends PureComponent {
  render() {
    return <View style={[styles.divider, this.props.type && styles[this.props.type]]} />;
  }
}
