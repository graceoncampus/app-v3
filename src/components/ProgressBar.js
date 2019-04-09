import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
} from 'react-native';
import { variables } from '../theme';

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#848895',
    height: 2,
    marginBottom: -2,
    overflow: 'hidden',
    zIndex: 20000,
  },
  fill: {
    backgroundColor: variables.primary,
    height: 3,
    marginBottom: -3,
    zIndex: 20000,
  },
});


export default class ProgressBar extends React.Component {
  state = {
    progress: new Animated.Value(0),
  };

  static defaultProps = {
    style: styles,
    easing: Easing.inOut(Easing.ease),
    easingDuration: 500,
    minimum: 0.08,
    positionUsing: '',
    speed: 200,
    trickle: true,
    trickleSpeed: 200,
  }

  componentDidUpdate(prevProps) {
    const { progress } = this.props;
    if (progress >= 0 && progress !== prevProps.progress) {
      this.update();
    }
  }

  update = () => {
    const { progress, easing, easingDuration } = this.state;
    Animated.timing(progress, {
      easing,
      duration: easingDuration,
      toValue: progress,
    }).start();
  }

  render() {
    const { progress } = this.state;
    const { style, fillStyle, backgroundStyle } = this.props;
    const fillWidth = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0 * style.width, 1 * style.width],
    });

    return (
      <View style={[styles.background, backgroundStyle, style]}>
        <Animated.View style={[styles.fill, fillStyle, { width: fillWidth }]} />
      </View>
    );
  }
}
