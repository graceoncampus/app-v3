import React from 'react';
import { TouchableOpacity } from 'react-native';
import { variables } from '../theme';

export default ({ style, clear, ...rest }) => {
  const Style = {
    backgroundColor: clear ? 'transparent' : variables.primary,
    borderColor: clear ? variables.primary : 'transparent',
    borderWidth: clear ? 1 : 0,
    borderRadius: 6,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    width: '100%',
    height: 50,
    ...style,
  };
  delete Style.underlayColor;
  return (
    <TouchableOpacity
      {...rest}
      style={Style}
    />
  );
};
