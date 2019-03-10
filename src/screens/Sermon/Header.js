import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

const Header = ({
  onDownPress
}) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onDownPress}>
      <Image style={styles.button}
        source={require('../../images/ic_keyboard_arrow_down_white.png')} />
    </TouchableOpacity>
  </View>
);

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 72,
    paddingTop: 20,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'row',
  },
  button: {
    opacity: 0.72
  }
});
