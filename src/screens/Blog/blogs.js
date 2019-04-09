import React, { Component, Fragment } from 'react';
import {
  TouchableOpacity, FlatList, View, ActivityIndicator
} from 'react-native';
import { AllHtmlEntities } from 'html-entities';
import FastImage from 'react-native-fast-image';

import { Screen, Text, Divider } from '../../components';
import { Menu } from '../../icons';
import { getRelativeTime } from '../../utils';
import globalStyles, { headerStyles } from '../../theme';

const entities = new AllHtmlEntities();
const postsPerPage = 10;
const fields = [
  'ID',
  'featured_image',
  'title',
  'attachments',
  'date',
  'excerpt',
  'content',
  'categories'
].join(',');
const BLOG_ENDPOINT = `https://public-api.wordpress.com/rest/v1.1/sites/graceoncampusucla.wordpress.com/posts?fields=${fields}`;
export default class Blogs extends Component {
  static navigationOptions = ({ navigation }) => ({
    drawer: () => ({
      label: 'Blogs'
    }),
    title: 'BLOG',
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

  constructor(props) {
    super(props);
    this.state = {
      blogs: [],
      currentPage: 1,
      loading: true
    };
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    const { currentPage, blogs: currentBlogs } = this.state;
    fetch(`${BLOG_ENDPOINT}&page=${currentPage}&number=${postsPerPage}`)
      .then(res => res.json())
      .then((json) => {
        const images = [];
        let category = '';
        const blogs = json.posts.map((blog) => {
          let image = null;
          if (blog.featured_image) {
            image = blog.featured_image;
          } else if (blog.attachments) {
            const attachments = Object.values(blog.attachments);
            if (attachments && attachments.length > 0) {
              image = attachments[0].URL;
            }
          }
          if (blog.categories) {
            const categories = Object.keys(blog.categories);
            if (categories && categories.length > 0) {
              category = categories[0].toUpperCase();
              if (category === 'UNCATEGORIZED') category = '';
              else category += ' | ';
            }
          }
          if (image) images.push(blog.image);
          return {
            key: blog.ID.toString(),
            title: blog.title,
            excerpt: blog.excerpt,
            date: blog.date,
            content: blog.content,
            category,
            image,
          };
        });
        this.setState({
          currentPage: currentPage + 1,
          blogs: currentBlogs.concat(blogs),
          loading: false
        });
      });
  }

  renderRow = (row) => {
    const { navigation } = this.props;
    const {
      title, date, excerpt, image, category
    } = row.item;
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Blo', {
            blog: row.item,
            title
          });
        }}
      >
        <View style={{
          flex: 1,
          marginHorizontal: 15,
          marginTop: 15,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowOpacity: 0.1,
          shadowOffset: { width: 1, height: 1 },
          backgroundColor: '#fff',
          borderRadius: 4
        }}
        >
          {image && (
            <Fragment>
              <FastImage
                style={{
                  height: 150,
                  flex: 1,
                }}
                source={{ uri: image }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Divider type="line" />
            </Fragment>

          )
          }
          <View style={{
            padding: 15,
            paddingBottom: 20
          }}
          >
            <Text styleName="bold" style={{ marginVertical: 6 }}>{entities.decode(title)}</Text>
            <Text styleName="caption">{category + getRelativeTime(new Date(date))}</Text>
            <Text
              style={{ marginTop: 10 }}
              numberOfLines={2}
              styleName="paragraph"
            >
              {entities.decode(excerpt).replace(/(<([^>]+)>)/ig, '').replace(/(\r\n|\n|\r)/gm, '')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { loading, blogs } = this.state;
    return (
      <Screen style={{ backgroundColor: '#f2f2f2' }} safeViewDisabled>
        {
        loading ? (
          <View style={[globalStyles.vvCenter, globalStyles.vhCenter, { flex: 1 }]}>
            <ActivityIndicator />
          </View>
        )
          : (
            <Fragment>
              <FlatList
                data={blogs}
                renderItem={this.renderRow}
                onEndReached={this.fetch}
                initialNumToRender={postsPerPage}
                maxToRenderPerBatch={2}
              />
            </Fragment>
          )
      }
      </Screen>
    );
  }
}
