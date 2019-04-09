
import React, { PureComponent } from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

export default class Text extends PureComponent {
  render() {
    const { styleName, style: customStyles } = this.props;
    const style = [
      styles.base
    ];
    if (styleName) {
      styleName.split(' ').forEach((el) => {
        if (styles[el]) style.push(styles[el]);
      });
    }
    if (customStyles) style.push(customStyles);
    return (
      <RNText
        {...this.props}
        style={style}
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
  caption: {
    fontSize: 12,
    lineHeight: 16,
    color: '#666666'
  },
  bold: {
    fontFamily: 'Akkurat-Bold'
  },
  center: {
    textAlign: 'center'
  },
  h1: {
    fontSize: 40,
    lineHeight: 44,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 19
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23
  }
});
