
import React from 'react';
import TrackPlayer from 'react-native-track-player';
import { TouchableOpacity, Text, View, ListView } from 'react-native';
import firebase from 'react-native-firebase';

import globalStyles, { headerStyles } from '../theme';
import Player from '../components/Player';
import { Menu } from '../icons';
import { Screen } from '../components';
import store from '../store';

export default class Sermons extends React.Component {
  constructor() {
    super();
    this.currentPage = 1;
    this.pageSize = 25;
    this.ref = firebase.firestore().collection('sermons').orderBy('date', 'desc');
    this.state = {
      sermons: [],
      loading: true,
      ...store.getState(),
      feed: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.selected !== r2.selected }),
    };
  }

  static navigationOptions = ({ navigation }) => ({
    drawer: () => ({
      label: 'Sermons',
    }),
    title: 'SERMONS',
    headerLeft: (
      <TouchableOpacity style={{ padding: 15 }} onPress={() => navigation.openDrawer()}>
        <Menu />
      </TouchableOpacity>
    ),
    headerRight: (
      <View />
    ),
    ...headerStyles,
  })

  componentDidMount() {
    this.loadPage();
    TrackPlayer.setupPlayer();
    TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      ],
    });
    store.subscribe((state) => {
      const { sermons } = this.state;
      let i = 0;
      const iMax = this.state.sermons.length;
      const result = new Array(iMax);
      for (; i < iMax; i += 1) {
        const sermon = { ...sermons[i] };
        if (sermon.id === state.id) {
          sermon.selected = true;
        } else sermon.selected = false;
        result[i] = sermon;
      }
      this.setState({
        ...state,
        feed: this.state.feed.cloneWithRows(result),
      });
    });
  }

  loadPage = () => {
    this.ref.limit(this.pageSize * this.currentPage)
      .get().then((querySnapshot) => {
        let i = 0;
        const iMax = querySnapshot.docs.length;
        const sermons = new Array(iMax);
        for (; i < iMax; i += 1) {
          const doc = querySnapshot.docs[i];
          const {
            URI: url,
            title,
            speaker: artist,
            passage,
            date,
          } = doc.data();
          sermons[i] = {
            id: doc.id,
            url,
            title,
            artist,
            passage,
            date,
            selected: doc.id === this.state.id,
            artwork: 'https://picsum.photos/200',
          };
        }
        this.currentPage += 1;

        TrackPlayer.add(sermons).then(() => (
          this.setState({
            loading: false,
            feed: this.state.feed.cloneWithRows(sermons),
            sermons,
          })
        ));
      });
  }

  togglePlayback = async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (store.getState().playbackState === 'playing') {
      TrackPlayer.pause();
    } else if (store.getState().playbackState === 'paused') {
      TrackPlayer.play();
    }
  }

  play = (id) => {
    TrackPlayer.skip(id);
  };

  skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (_) {
      TrackPlayer.reset();
    }
  }

  skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (_) { console.warn(_); }
  }

  renderRow = (row) => {
    const date = new Date(row.date.toString());
    return (
      <TouchableOpacity onPress={() => this.play(row.id)}>
        <View style={[{ paddingBottom: 15 }, globalStyles.borderBottom, globalStyles.row]}>
          <View style={[globalStyles.vertical]}>
            <React.Fragment>
              <View style={[globalStyles.horizontal, globalStyles.hvCenter]} >
                <View style={globalStyles.vertical}>
                  {
                    row.selected ?
                      <Text style={[globalStyles.small, globalStyles.bold, globalStyles.textSecondary]}>
                        {row.title}
                      </Text>
                    :
                    <Text style={[globalStyles.small, globalStyles.bold]}>
                      {row.title}
                    </Text>
                  }
                  {
                    row.date &&
                    <Text style={[globalStyles.caption, { marginTop: -2 }]}>
                      {`${date.getMonth()}/${date.getDate()}/${date.getFullYear()} | ${row.passage} | ${row.artist}`}
                    </Text>
                  }
                </View>
              </View>
            </React.Fragment>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    if (!this.state.loading) {
      return (
        <Screen>
          <ListView
            key={this.state.hasChanged}
            dataSource={this.state.feed}
            renderRow={row => this.renderRow(row) }
            onEndReached={() => this.loadPage()}
          />
          <Player
            onNext={() => this.skipToNext()}
            onPrevious={() => this.skipToPrevious()}
            onTogglePlayback={() => this.togglePlayback()}
          />
        </Screen>
      );
    }
    return <View />;
  }
}
