import React from 'react';
import {
  TouchableOpacity, TextInput, View, Alert, Image, Dimensions
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';

import {
  Text, Divider, Button, Screen
} from '../components';
import ProgressBar from '../components/ProgressBar';

import globalStyles, { headerStyles, variables } from '../theme';
import { Back, Eye } from '../icons';

const { width, height } = Dimensions.get('window');

const options = [
  {
    name: 'Grace on Campus'
  },
  {
    name: 'Chris Gee'
  }
];

const sendAlert = () => {
  Alert.alert('Empty Fields', 'Fill in title and post content');
};

export default class EditPost extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const preview = navigation.getParam('preview', false);
    const isEditing = navigation.getParam('isEditing', false);
    const loading = navigation.getParam('loading', false);
    const title = loading || (isEditing ? 'EDIT ANNOUNCEMENT' : 'NEW ANNOUNCEMENT');
    return {
      title,
      gesturesEnabled: false,
      headerLeft: loading ? (
        <View />
      ) : (
        <TouchableOpacity style={{ paddingLeft: 8 }} onPress={() => navigation.goBack()}>
          <Back />
        </TouchableOpacity>
      ),
      headerRight: preview && !loading && (
        <TouchableOpacity style={{ marginRight: 15 }} onPress={preview}>
          <Eye />
        </TouchableOpacity>
      ),
      ...headerStyles
    };
  };

  constructor(props) {
    super(props);
    const announcement = props.navigation.getParam('announcement', {
      post: '',
      title: '',
      role: 'Grace on Campus',
      key: undefined,
      date: new Date().toISOString()
    });
    this.ref = firebase.firestore().collection('announcements');
    this.state = {
      progress: 0,
      Post: announcement.post,
      focus: null,
      key: announcement.key,
      loading: false,
      title: announcement.title,
      selected: announcement.role
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      preview: this.preview
    });
  }

  preview = () => {
    const { Post: post, title, selected: role } = this.state;
    if (!post && !title) sendAlert();
    else {
      this.props.navigation.navigate('Preview', {
        announcement: {
          post,
          title,
          role,
          date: new Date().toISOString()
        },
        title,
        isPreview: true
      });
    }
  };

  onChangePost = (Post) => {
    this.setState({ submitted: false, Post });
  };

  onChangeTitle = (title) => {
    this.setState({ submitted: false, title });
  };

  confirmPost = () => {
    Alert.alert('Confirm Post', 'Are you sure you want to post?', [
      { text: 'Confirm', onPress: this.updateInfo },
      { text: 'Cancel', onPress: () => console.log('OK Pressed!') }
    ]);
  };

  increment = () => {
    if (this.state.progress < 100) {
      setTimeout(() => {
        this.setState({ progress: this.state.progress + 0.8 * Math.random() });
      }, 10);
    }
  };

  delete = () => {
    this.props.navigation.setParams({
      loading: 'DELETING...'
    });
    this.setState({ loading: true });
    this.ref
      .doc(this.state.key)
      .delete()
      .then(() => this.props.navigation.navigate('Home'));
  };

  update = () => {
    this.props.navigation.setParams({
      loading: 'UPDATING...'
    });
    this.setState({ loading: true });
    const { Post: post, selected: role, title } = this.state;

    this.ref
      .doc(this.state.key)
      .update({
        post,
        role,
        title
      })
      .then(() => this.props.navigation.navigate('Home'));
  };

  publish = () => {
    this.props.navigation.setParams({
      loading: 'POSTING...'
    });
    this.setState({ loading: true });
    this.ref
      .add({
        role: this.state.selected,
        post: this.state.Post,
        title: this.state.title,
        date: new Date()
      })
      .then(() => {
        this.props.navigation.navigate('Home');
      });
  };

  renderButton = () => {
    const isEditing = this.props.navigation.getParam('isEditing', false);
    return (
      <Button style={{ marginBottom: 15 }} onPress={isEditing ? this.update : this.publish}>
        <Text style={globalStyles.buttonText}>{isEditing ? 'UPDATE' : 'PUBLISH'}</Text>
      </Button>
    );
  };

  renderDelete = () => (
    <TouchableOpacity style={{ paddingTop: 10 }} onPress={this.delete}>
      <Text style={[globalStyles.caption, globalStyles.textCenter, globalStyles.textRed]}>
        DELETE ANNOUNCEMENT
      </Text>
    </TouchableOpacity>
  );

  renderOptions = () => {
    let i = 0;
    const iMax = options.length;
    const opts = new Array(iMax);
    for (; i < iMax; i += 1) {
      const { name, image_url } = options[i];
      opts[i] = (
        <View
          key={i}
          style={[
            i === 0 && globalStyles.borderTop,
            globalStyles.borderBottom,
            {
              paddingVertical: 11.5
            }
          ]}
        >
          <TouchableOpacity
            style={[globalStyles.horizontal, globalStyles.hvCenter, globalStyles.spaceBetween]}
            onPress={() => this.setState({ selected: name })}
          >
            <View style={[globalStyles.horizontal]}>
              <Image
                style={{
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  marginRight: 8
                }}
                source={{ uri: image_url }}
              />
              <Text style={[globalStyles.bold, globalStyles.small]}>{name}</Text>
            </View>
            <View
              style={[
                globalStyles.vertical,
                globalStyles.vhCenter,
                globalStyles.vvCenter,
                {
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: 'transparent',
                  borderColor: variables.primary,
                  borderWidth: 1
                }
              ]}
            >
              {this.state.selected === name && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: variables.primary
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return opts;
  };

  render = () => {
    const {
      Post, focus, title, loading
    } = this.state;
    const isEditing = this.props.navigation.getParam('isEditing', false);
    if (this.state.loading) this.increment();
    return (
      <Screen>
        {loading && (
          <React.Fragment>
            <ProgressBar
              fillStyle={{}}
              backgroundStyle={{ backgroundColor: '#cccccc' }}
              progress={this.state.progress}
              style={{ width }}
            />
            <View
              style={{
                flex: 1,
                position: 'absolute',
                left: 0,
                top: 0,
                opacity: 0.6,
                backgroundColor: 'black',
                width,
                height,
                zIndex: 10000
              }}
            />
          </React.Fragment>
        )}
        <KeyboardAwareScrollView>
          <View style={{ paddingTop: 20, paddingHorizontal: 25 }}>
            <Text style={globalStyles.label}>Title</Text>
            <TextInput
              style={[globalStyles.input, focus === 'two' && globalStyles.focused]}
              onFocus={() => this.setState({ focus: 'two' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              placeholder="Title"
              value={title}
              onChangeText={this.onChangeTitle}
              returnKeyType="next"
              underlineColorAndroid="transparent"
            />
            <Text style={globalStyles.label}>Post</Text>
            <TextInput
              multiline
              numberOfLines={8}
              onFocus={() => this.setState({ focus: 'one' })}
              onSubmitEditing={() => this.setState({ focus: '' })}
              placeholder="Post content ..."
              underlineColorAndroid="transparent"
              style={[globalStyles.multiLineInput, focus === 'one' && globalStyles.focused]}
              onChange={(event) => {
                this.setState({
                  Post: event.nativeEvent.text
                });
              }}
              value={Post}
            />
            <Text style={[{ marginBottom: 3 }, globalStyles.label]}>Post As</Text>
            {this.renderOptions()}
            <Divider />
            <Divider />
            <View
              style={[
                globalStyles.vertical,
                globalStyles.vhCenter,
                globalStyles.vvEnd,
                { flex: 0.25 }
              ]}
            >
              {this.renderButton()}
              {isEditing && this.renderDelete()}
            </View>
          </View>
          <Divider />
          <Divider />
        </KeyboardAwareScrollView>
      </Screen>
    );
  };
}
