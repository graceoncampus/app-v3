import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Play, Pause, Previous, Next
} from '../../icons';


const Controls = ({
  paused,
  onPressPlay,
  onPressPause,
  onBack,
  onForward
}) => (
  <View style={styles.container}>
    <View style={{ width: 40 }} />
    <TouchableOpacity onPress={onBack}>
      <Previous width={24} />
    </TouchableOpacity>
    <View style={{ width: 20 }} />
    {!paused
      ? (
        <TouchableOpacity onPress={onPressPause}>
          <Pause width={72} />
        </TouchableOpacity>
      )
      : (
        <TouchableOpacity onPress={onPressPlay}>
          <Play width={72} />
        </TouchableOpacity>
      )
    }
    <View style={{ width: 20 }} />
    <TouchableOpacity onPress={onForward}>
      <Next width={24} />
    </TouchableOpacity>
    <View style={{ width: 40 }} />
  </View>
);

export default Controls;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  }
});
