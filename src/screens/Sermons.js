import React from "react";
import TrackPlayer from "react-native-track-player";
import { TouchableOpacity, Text, View, ListView } from "react-native";
import firebase from "react-native-firebase";

import globalStyles, { headerStyles } from "../theme";
import Player from "../components/Player";
import { Menu } from "../icons";
import { Screen } from "../components";
import store from "../store";
export default class Sermons extends React.Component {
  constructor() {
    super();
    this.currentPage = 1;
    this.pageSize = 25;
    this.ref = firebase
      .firestore()
      .collection("sermons")
      .orderBy("date", "desc");
    this.state = {
          loading: true,
      ...store.getState(),
      feed: new ListView.DataSource({
        rowHasChanged: (r1, r2) =>
          r1.id !== r2.id || r1.selected !== r2.selected
      })
    };
  }

  static navigationOptions = ({ navigation }) => ({
    drawer: () => ({
      label: "Sermons"
    }),
    title: "SERMONS",
    headerLeft: (
      <TouchableOpacity
        style={{ padding: 15 }}
        onPress={() => navigation.openDrawer()}
      >
        <Menu />
      </TouchableOpacity>
    ),
    headerRight: <View />,
    ...headerStyles
  });

  componentDidMount() {
    this.loadPage();
    TrackPlayer.setupPlayer();
    TrackPlayer.updateOptions({
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
      ]
    });
    store.subscribe(state => {
      this.setState({
        ...state,
        hasChanged: true
      });
    });
  }

  loadPage = () => {
    this.ref
      .limit(this.pageSize * this.currentPage)
      .get()
      .then(querySnapshot => {
        const sermons = [];
        querySnapshot.forEach(doc => {
          const {
            URI: url,
            title,
            speaker: artist,
            passage,
            date
          } = doc.data();
          sermons.push({
            id: doc.id,
            url,
            title,
            artist,
            passage,
            date,
            artwork:
              "https://res.cloudinary.com/goc/image/upload/v1552010238/icon_eryqac.png"
          });
        });
        this.currentPage += 1;
        TrackPlayer.add(sermons).then(() =>
          this.setState({
            loading: false,
            feed: this.state.feed.cloneWithRows(sermons)
          })
        );
      });
  };

  togglePlayback = async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (store.getState().playbackState === "playing") {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  };

  play = id => {
    TrackPlayer.skip(id);
    TrackPlayer.play();
  };

  skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
      TrackPlayer.play();
    } catch (_) {
      TrackPlayer.reset();
    }
  };

  skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
      TrackPlayer.play();
    } catch (_) {}
  };

  renderRow = row => {
    const date = new Date(row.date.toString());
    return (
      <TouchableOpacity onPress={() => this.play(row.id)}>
        <View
          style={[
            { paddingBottom: 15 },
            globalStyles.borderBottom,
            globalStyles.row
          ]}
        >
          <View style={[globalStyles.vertical]}>
            <React.Fragment>
              <View style={[globalStyles.horizontal, globalStyles.hvCenter]}>
                <View style={globalStyles.vertical}>
                  <Text style={[globalStyles.small, globalStyles.bold]}>
                    {row.title}
                  </Text>
                  {row.date && (
                    <Text style={[globalStyles.caption, { marginTop: -2 }]}>
                      {`${date.getMonth()}/${date.getDate()}/${date.getFullYear()} | ${
                        row.passage
                      } | ${row.artist}`}
                    </Text>
                  )}
                </View>
              </View>
            </React.Fragment>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    if (!this.state.loading) {
      return (
        <Screen>
          <ListView
            dataSource={this.state.feed}
            renderRow={row => this.renderRow(row)}
            onEndReached={() => this.loadPage()}
          />
          <Player
            navigation={this.props.navigation}
            onTogglePlayback={() => this.togglePlayback()}
          />
        </Screen>
      );
    }
    return <View />;
  }
}
