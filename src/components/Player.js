import React, { Component } from 'react';
import { ProgressComponent } from 'react-native-track-player';
import {
  StyleSheet, Text, Image, TouchableOpacity, View
} from 'react-native';
import store from '../store';
import { Play, Pause } from '../icons';
import globalStyles, { variables } from '../theme';

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 2,
  },
  progress: {
    height: 4,
    width: '100%',
    flexDirection: 'row',
  },
});


class ProgressBar extends ProgressComponent {
  render() {
    return (
      <View style={styles.progress}>
        <View style={{ flex: this.getProgress(), backgroundColor: variables.primary }} />
        <View style={{ flex: 1 - this.getProgress(), backgroundColor: 'grey' }} />
      </View>
    );
  }
}

export default class Player extends Component {
  static defaultProps = {
    style: {},
  };

  state = {
    ...store.getState()
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(state => this.setState({
      ...state,
    }));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  navigate = () => {
    const { navigation } = this.props;
    navigation.navigate('SingleSermon');
  }

  render() {
    const {
      onTogglePlayback,
    } = this.props;
    const {
      artwork, title, artist, playbackState
    } = this.state;
    return (
      <React.Fragment>
        <View style={[globalStyles.vertical, styles.card]}>
          <ProgressBar />
          <TouchableOpacity
            style={[globalStyles.row, globalStyles.stretch]}
            onPress={this.navigate}
          >
            <Image style={{ width: 40, height: 40, borderRadius: 2 }} source={{ uri: artwork }} />
            <View style={[
              {
                marginLeft: 10,
                paddingRight: 10,
                flex: 0.98,
              },
              globalStyles.vertical,
            ]}
            >
              <Text numberOfLines={1} style={{ fontWeight: 'bold', marginBottom: 3 }}>
                {title}
              </Text>
              <Text
                style={[
                  { marginBottom: -2 },
                  globalStyles.small
                ]}
              >
                {artist}
              </Text>
            </View>
            <View style={[globalStyles.horizontal, globalStyles.hhEnd]}>
              <TouchableOpacity onPress={onTogglePlayback}>
                {
                    playbackState === 'playing' || playbackState === 3 ? <Pause dark width={40} />
                      : <Play dark width={40} />
                  }
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  }
}
