import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { variables } from '../theme';

export default class Button extends Component {
  render() {

    const style = {
      backgroundColor: this.props.clear ? 'transparent' : variables.primary,
      borderColor: this.props.clear ? variables.primary : 'transparent',
      borderWidth: this.props.clear ? 1 : 0,
      borderRadius: 6,
      paddingHorizontal: 15,
      paddingVertical: 15,
      width: '100%',
      height: 50,
      ...this.props.style,
    };
    delete style.underlayColor;
    return (
      <TouchableOpacity
        {...this.props}
        style={style}
      />
    );
  }
}
