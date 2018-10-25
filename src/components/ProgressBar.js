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
    status: 0,
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
    if (this.props.progress >= 0 && this.props.progress !== prevProps.progress) {
      this.update();
    }
  }


  render() {
    const fillWidth = this.state.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0 * this.props.style.width, 1 * this.props.style.width],
    });

    return (
      <View style={[styles.background, this.props.backgroundStyle, this.props.style]}>
        <Animated.View style={[styles.fill, this.props.fillStyle, { width: fillWidth }]}/>
      </View>
    );
  }

  update = () => {
    Animated.timing(this.state.progress, {
      easing: this.props.easing,
      duration: this.props.easingDuration,
      toValue: this.props.progress,
    }).start();
  }
}
