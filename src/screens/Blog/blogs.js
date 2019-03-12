import React, { Component } from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import { Screen, View, Caption, Row, ListView, Image, Divider, Spinner } from '@shoutem/ui';
import { headerStyles } from '../../theme';
import { Menu } from '../../icons';
import HTMLView from 'react-native-htmlview';

export default class Blogs extends Component {
    //Add the menu button to screen
    static navigationOptions = ({ navigation }) => ({
        drawer: () => ({
          label: 'Blogs',
        }),
        title: 'BLOG',
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

    constructor(props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.state = {
            blogs: [],
            loading: true,
            imageDime: {
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
            }
        }
    };

    async componentWillMount() {
        //Get blog post data from wordpress
        const data = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/graceoncampusucla.wordpress.com/posts?fields=ID,featured_image,title,date,excerpt,attachments,content`);
        const dataJson = await data.json();
        this.setState({ 
            blogs: dataJson.posts, 
            loading: false, 
            imageDime: {        //used to adjust image dimensions
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
            }
        });
    }

    renderRow(blog) {
        //Initialize constants that we want to display
        const { title, date, excerpt } = blog;
        const htmltitle = '<h4>' + title + '</h4>';
        const image = blog.featured_image ? blog.featured_image : Object.values(blog.attachments).length ? Object.values(blog.attachments)[0].URL : null
        const dateformat = new Date(date);
        
        return (
           <TouchableOpacity onPress={() => { this.props.navigation.navigate('Blo', { blog, title:blog.title }); }} >
             {/* Display and format the title, date, image, and excerpt */}
             <Row>
                <View styleName="vertical stretch space-between">
                    <HTMLView value={htmltitle}/>
                    <Caption><Caption>Posted: </Caption>{dateformat.toDateString()}</Caption>
                    {image ? <Image style={{width: this.state.imageDime.width - 30, height: (222/375) * this.state.imageDime.width}} source={{ uri: image }}/>: null}
                    <HTMLView value={excerpt}/>
                </View>
             </Row>
             <Divider styleName='line' />
           </TouchableOpacity>
        );
    }

    render = () => {
        if (!this.state.loading) {
            return (
                <Screen>
                    <ListView
                        data={this.state.blogs}
                        renderRow={this.renderRow}
                    />
                </Screen>
            );
        }
        return (
            <Screen>
                <View styleName='vertical fill-parent v-center h-center'>
                <Spinner size="large" />
                </View>
            </Screen>
        );
    };
}