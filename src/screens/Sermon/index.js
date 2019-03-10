import React, { Component } from 'react';
import {
  View,
  Text,
  StatusBar,
} from 'react-native';
import Header from './Header';
import AlbumArt from './AlbumArt';
import TrackDetails from './TrackDetails';
import SeekBar from './SeekBar';
import Controls from './Controls';
import store from '../../store';
import TrackPlayer from 'react-native-track-player';

export default class Player extends Component {
  static navigationOptions = ({ navigation }) => ({
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
      paused: state.playbackState !== 'playing'
    };
  }

  componentDidMount() {
    store.subscribe(state => this.setState({
      ...state,
      paused: state.playbackState !== 'playing'
    }));
  }


  play = () => {
    TrackPlayer.play();
    this.setState({
      paused: false
    })
  }

  pause = () => {
    TrackPlayer.pause()
    this.setState({
      paused: true
    })
  }

  skipToNext = () => TrackPlayer.skipToNext().then(() => this.play())

  skipToPrevious = () => TrackPlayer.skipToPrevious().then(() => this.play())

  seek = (time) => {
    time = Math.round(time);
    TrackPlayer.seekTo(time)
    this.play()
  }

  render() {
    console.log(store)
    const { title, artist, artwork } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Header onDownPress={() => this.props.navigation.goBack()} />
        <AlbumArt url={artwork} />
        <TrackDetails title={title} artist={artist} />
        <SeekBar
          onSeek={this.seek}
          onSlidingStart={this.pause}
          currentPosition={this.state.currentPosition} />
        <Controls
          onPressPlay={this.play}
          onPressPause={this.pause}
          onBack={this.skipToPrevious}
          onForward={this.skipToNext}
          paused={this.state.paused}/>
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