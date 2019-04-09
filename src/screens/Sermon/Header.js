import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ArrowDown } from '../../icons';

const Header = ({
  onDownPress
}) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onDownPress} style={{ padding: 15 }}>
      <ArrowDown />
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
