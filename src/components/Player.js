import React, { Component } from 'react';
import { ProgressComponent } from 'react-native-track-player';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TextTicker from 'react-native-text-ticker'
import store from '../store';
import { Play, Pause } from '../icons';
import globalStyles, { variables } from '../theme';
import Modal from '../components/Modal';

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 2,
  },
  progress: {
    height: 2,
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
    ...store.getState(),
    showModal: false,
  }

  componentDidMount() {
    store.subscribe(state => this.setState({
      ...state,
    }));
  }

  showModal = () => {
    this.setState({
      showModal: true,
    });
  }

  render() {
    const {
      onNext, onPrevious, onTogglePlayback,
    } = this.props;
    return (
      <React.Fragment>
        <Modal
          style={{ zIndex: 100000 }}
          visible={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}
        >
          <View style={{
            height: 300,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text>Here is the content inside panel</Text>
          </View>
        </Modal>
        <View style={[globalStyles.vertical, styles.card]}>
          <ProgressBar />
          <TouchableOpacity style={[globalStyles.row, globalStyles.stretch]} onPress={this.showModal}>
              <View style={[
                {
                  marginLeft: 20,
                  paddingRight: 10,
                  flex: 0.98,
                },
                globalStyles.vertical,
              ]}
              >
                <TextTicker
                  duration={3000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={1000}
                >
                  {this.state.title}
                </TextTicker>
                <Text
                  style={[
                    { marginBottom: -2, marginTop: -1 },
                    globalStyles.small,
                    globalStyles.textCenter,
                  ]}
                >{this.state.artist}</Text>
              </View>
              <View style={[globalStyles.horizontal, globalStyles.hhEnd]}>
                <TouchableOpacity onPress={onTogglePlayback}>
                  {
                    this.state.playbackState === 'playing' ? <Pause />
                    : <Play/>
                  }
                </TouchableOpacity>
              </View>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  }
}
