import React from 'react';
import {
  ScrollView,
  View,
  ActivityIndicator,
} from 'react-native';

export default class InfiniteScrollView extends React.Component {
  static defaultProps = {
    distanceToLoadMore: 1500,
    canLoadMore: false,
    scrollEventThrottle: 100,
    renderLoadingIndicator: () => <ActivityIndicator />,
    renderLoadingErrorIndicator: () => <View />,
    renderScrollComponent: props => <ScrollView {...props} />,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isDisplayingError: false,
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.loadMoreAsync = this.loadMoreAsync.bind(this);
  }

  getScrollResponder() {
    return this.scrollComponent.getScrollResponder();
  }

  setNativeProps(nativeProps) {
    this.scrollComponent.setNativeProps(nativeProps);
  }

  render() {
    let statusIndicator;

    if (this.state.isDisplayingError) {
      statusIndicator = React.cloneElement(
        this.props.renderLoadingErrorIndicator({ onRetryLoadMore: this.loadMoreAsync }),
        { key: 'loading-error-indicator' },
      );
    } else if (this.state.isLoading) {
      statusIndicator = React.cloneElement(
        this.props.renderLoadingIndicator(),
        { key: 'loading-indicator' },
      );
    }

    const {
      renderScrollComponent,
      ...props
    } = this.props;
    Object.assign(props, {
      onScroll: this.handleScroll,
      children: [this.props.children, statusIndicator],
    });

    return React.cloneElement(renderScrollComponent(props), {
      ref(component) { this.scrollComponent = component; },
    });
  }

  handleScroll(event) {
    if (this.props.onScroll) {
      this.props.onScroll(event);
    }

    if (this.shouldLoadMore(event)) {
      this.loadMoreAsync().catch((error) => {
        console.error('Unexpected error while loading more content:', error);
      });
    }
  }

  shouldLoadMore(event) {
    const canLoadMore = (typeof this.props.canLoadMore === 'function') ?
      this.props.canLoadMore() :
      this.props.canLoadMore;

    return !this.state.isLoading &&
      canLoadMore &&
      !this.state.isDisplayingError &&
      this.distanceFromEnd(event) < this.props.distanceToLoadMore;
  }

  async loadMoreAsync() {
    try {
      this.setState({ isDisplayingError: false, isLoading: true });
      await this.props.onLoadMoreAsync();
    } catch (e) {
      if (this.props.onLoadError) {
        this.props.onLoadError(e);
      }
      this.setState({ isDisplayingError: true });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  distanceFromEnd(event) {
    const {
      contentSize,
      contentInset,
      contentOffset,
      layoutMeasurement,
    } = event.nativeEvent;

    let contentLength;
    let trailingInset;
    let scrollOffset;
    let viewportLength;
    if (this.props.horizontal) {
      contentLength = contentSize.width;
      trailingInset = contentInset.right;
      scrollOffset = contentOffset.x;
      viewportLength = layoutMeasurement.width;
    } else {
      contentLength = contentSize.height;
      trailingInset = contentInset.bottom;
      scrollOffset = contentOffset.y;
      viewportLength = layoutMeasurement.height;
    }

    return contentLength + trailingInset - scrollOffset - viewportLength;
  }
}
