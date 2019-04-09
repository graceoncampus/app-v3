import React, { Component } from 'react';
import {
  View,
  StatusBar
} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import Header from './Header';
import AlbumArt from './AlbumArt';
import TrackDetails from './TrackDetails';
import SeekBar from './SeekBar';
import Controls from './Controls';
import store from '../../store';

export default class Player extends Component {
  static navigationOptions = () => ({
    drawer: () => ({
      label: 'Sermons',
    }),
    header: null
  })

  constructor() {
    super();
    const state = store.getState();
    this.state = {
      ...state,
      paused: state.playbackState !== 'playing' && state.playbackState !== 3
    };
  }

  componentDidMount() {
    store.subscribe(state => this.setState({
      ...state,
      paused: state.playbackState !== 'playing' && state.playbackState !== 3
    }));
  }


  play = () => {
    TrackPlayer.play();
    this.setState({
      paused: false
    });
  }

  pause = () => {
    TrackPlayer.pause();
    this.setState({
      paused: true
    });
  }

  skipToNext = () => TrackPlayer.skipToNext().then(() => this.play())

  skipToPrevious = () => TrackPlayer.skipToPrevious().then(() => this.play())

  seek = (time) => {
    const tmp = Math.round(time);
    TrackPlayer.seekTo(tmp);
    this.play();
  }

  render() {
    const { navigation } = this.props;
    const {
      title, artist, artwork, paused, currentPosition
    } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Header onDownPress={() => navigation.goBack()} />
        <AlbumArt url={artwork} />
        <TrackDetails title={title} artist={artist} />
        <SeekBar
          onSeek={this.seek}
          onSlidingStart={this.pause}
          currentPosition={currentPosition}
        />
        <Controls
          onPressPlay={this.play}
          onPressPause={this.pause}
          onBack={this.skipToPrevious}
          onForward={this.skipToNext}
          paused={paused}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#222222',
  }
};
