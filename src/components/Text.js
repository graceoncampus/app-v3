
import React, { PureComponent } from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

export default class Text extends PureComponent {
  render() {
    return (
      <RNText
        {...this.props}
        style={[
          styles.base,
          this.props.style,
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'Akkurat',
    fontSize: 20,
    color: '#3a3f4b',
    lineHeight: 20,
  },
});
