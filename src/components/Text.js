
import React, { PureComponent } from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

export default class Text extends PureComponent {
  render() {
    const style = [
      styles.base
    ]
    if (this.props.styleName) {
      this.props.styleName.split(" ").forEach(el => {
        if (styles[el]) style.push(styles[el])
      });
    }
    if (this.props.style) style.push(this.props.style);
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
  paragraph: {
    fontSize: 14,
    lineHeight: 19
  }
});
