import React from 'react';

import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { ProgressComponent } from 'react-native-track-player';
import Slider from 'react-native-slider';

const minutesAndSeconds = position => ([
  (`0${Math.floor(position / 60)}`).slice(-2),
  (`0${Math.floor(position % 60)}`).slice(-2),
]);

class SeekBar extends ProgressComponent {
  render() {
    const { onSlidingStart, onSeek } = this.props;
    const elapsed = minutesAndSeconds(this.state.position);
    const remaining = minutesAndSeconds(this.state.duration - this.state.position);
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.text}>
            {`${elapsed[0]}:${elapsed[1]}`}
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={[styles.text, { width: 40 }]}>
            {this.state.duration > 1 && `-${remaining[0]}:${remaining[1]}`}
          </Text>
        </View>
        <Slider
          maximumValue={Math.max(this.state.duration, 1, this.state.position + 1)}
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSeek}
          value={this.state.position}
          style={styles.slider}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="rgba(255, 255, 255, 0.14)"
          thumbStyle={styles.thumb}
          trackStyle={styles.track}
        />
      </View>
    );
  }
}

export default SeekBar;

const styles = StyleSheet.create({
  slider: {
    marginTop: -12,
  },
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  track: {
    height: 2,
    borderRadius: 1,
  },
  thumb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  text: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 12,
    textAlign: 'center',
  }
});
