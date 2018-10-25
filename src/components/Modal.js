/* global requestAnimationFrame, cancelAnimationFrame */
import React from 'react';
import { Animated, PanResponder, StyleSheet, Platform, PixelRatio, StatusBar, Dimensions } from 'react-native';
import { clamp } from '../utils';

const statusBarHeight = StatusBar.currentHeight;
const { height: visibleHeight } = Dimensions.get('window');
const density = PixelRatio.get();

const TIME_CONTANT = 325;
const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    zIndex: 6,
  },
  animatedContainer: {
    // flex: 1,
    // alignSelf: 'stretch',
    zIndex: 7,
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

class FlickAnimation {
  constructor(animation, min, max) {
    this.onUpdate = this.onUpdate.bind(this);

    this.animation = animation;
    this.min = min;
    this.max = max;
  }

  scroll(toValue) {
    const value = clamp(toValue, this.min, this.max);
    this.animation.setValue(value);

    if (value === this.min || value === this.max) {
      this.stop();
    }
  }

  start(config) {
    this.active = true;
    this.amplitude = config.amplitude != null ? config.amplitude : 0.8;
    this.velocity = -config.velocity * density * 10;
    this.toValue = config.fromValue;
    this.startTime = Date.now();
    this.animationFrame = requestAnimationFrame(this.onUpdate);
  }

  onUpdate() {
    if (!this.active) {
      return;
    }

    const elapsedTime = Date.now() - this.startTime;
    const delta =
      -(this.amplitude * this.velocity) *
      Math.exp(-elapsedTime / TIME_CONTANT);

    if (Math.abs(delta) < 0.5) {
      return;
    }

    this.toValue += delta;
    this.scroll(this.toValue);
    this.animationFrame = requestAnimationFrame(this.onUpdate);
  }

  stop() {
    this.active = false;
    this.animation.stopAnimation();
    cancelAnimationFrame(this.animationFrame);
  }
}

const MINIMUM_VELOCITY_THRESHOLD = 0.1;

const MINIMUM_DISTANCE_THRESHOLD = 0.24;

const DEFAULT_SLIDING_DURATION = 240;

class SlidingUpPanel extends React.Component {
  static defaultProps = {
    visible: false,
    height: 300,
    draggableRange: { top: visibleHeight - 300 + 43, bottom: 0 },
    onDrag: () => {},
    onDragStart: () => {},
    onDragEnd: () => {},
    onRequestClose: () => {},
    allowMomentum: true,
    allowDragging: true,
    showBackdrop: true,
  }

  constructor(props) {
    super(props);

    this.onDrag = this.onDrag.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.renderBackdrop = this.renderBackdrop.bind(this);
    this.isInsideDraggableRange = this.isInsideDraggableRange.bind(this);
    this.triggerAnimation = this.triggerAnimation.bind(this);

    this.transitionTo = this.transitionTo.bind(this);

    this.state = {
      visible: props.visible,
    };

    const { top, bottom } = props.draggableRange;

    this.animatedValueY = this.state.visible ? -top : -bottom;
    this.translateYAnimation = new Animated.Value(this.animatedValueY);
    this.flick = new FlickAnimation(this.translateYAnimation, -top, -bottom);

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder.bind(this),
      onPanResponderGrant: this.onPanResponderGrant.bind(this),
      onPanResponderMove: this.onPanResponderMove.bind(this),
      onPanResponderRelease: this.onPanResponderRelease.bind(this),
      onPanResponderTerminate: this.onPanResponderTerminate.bind(this),
      onPanResponderTerminationRequest: () => false,
    });

    this.backdrop = null;
    this.isAtBottom = !props.visible;
    this.requestCloseTriggered = false;

    this.translateYAnimation.addListener(this.onDrag);
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && !prevProps.visible) {
      this.requestCloseTriggered = false;

      this.setState({ visible: true }, () => {
        this.transitionTo(-prevProps.draggableRange.top);
      });
      return;
    }
    const { bottom } = prevProps.draggableRange;

    if (
      !this.props.visible &&
      prevProps.visible &&
      -this.animatedValueY > bottom
    ) {
      this.requestCloseTriggered = true;

      this.transitionTo({
        toValue: -bottom,
        onAnimationEnd: () => this.setState({ visible: false }),
      });
      return;
    }

    if (
      this.props.draggableRange.top !== prevProps.draggableRange.top ||
      this.props.draggableRange.bottom !== prevProps.draggableRange.bottom
    ) {
      const { top, bottom: bott } = this.props.draggableRange;
      this.flick = new FlickAnimation(this.translateYAnimation, -top, -bott);
    }
  }

  onMoveShouldSetPanResponder(evt, gestureState) {
    return (
      this.props.allowDragging &&
      this.isInsideDraggableRange() &&
      Math.abs(gestureState.dy) > MINIMUM_DISTANCE_THRESHOLD
    );
  }

  // eslint-disable-next-line no-unused-vars
  onPanResponderGrant(evt, gestureState) {
    this.flick.stop();
    this.translateYAnimation.setOffset(this.animatedValueY);
    this.translateYAnimation.setValue(0);
    this.props.onDragStart(-this.animatedValueY);
  }

  onPanResponderMove(evt, gestureState) {
    if (!this.isInsideDraggableRange()) {
      return;
    }

    this.translateYAnimation.setValue(gestureState.dy);
  }

  // Trigger when you release your finger
  onPanResponderRelease(evt, gestureState) {
    if (!this.isInsideDraggableRange()) {
      return;
    }

    this.translateYAnimation.flattenOffset();
    const cancelFlick = this.props.onDragEnd(-this.animatedValueY);

    if (!this.props.allowMomentum || cancelFlick) {
      return;
    }

    if (Math.abs(gestureState.vy) > MINIMUM_VELOCITY_THRESHOLD) {
      this.flick.start({
        velocity: gestureState.vy,
        fromValue: this.animatedValueY,
      });
    }
  }

  // eslint-disable-next-line no-unused-vars
  onPanResponderTerminate(evt, gestureState) {
    //
  }

  isInsideDraggableRange() {
    const { top, bottom } = this.props.draggableRange;
    return this.animatedValueY >= -top && this.animatedValueY <= -bottom;
  }

  onDrag({ value }) {
    const { top, bottom } = this.props.draggableRange;

    if (value >= -bottom) {
      this.isAtBottom = true;

      if (this.backdrop != null) {
        this.backdrop.setNativeProps({ pointerEvents: 'none' });
      }

      if (!this.requestCloseTriggered) {
        this.props.onRequestClose();
      }
      return;
    }

    if (this.isAtBottom) {
      this.isAtBottom = false;

      if (this.backdrop != null) {
        this.backdrop.setNativeProps({ pointerEvents: 'box-only' });
      }
    }

    this.animatedValueY = clamp(value, -top, -bottom);
    this.props.onDrag(-this.animatedValueY);
  }

  transitionTo(mayBeValueOrOptions) {
    if (typeof mayBeValueOrOptions === 'object') {
      return this.triggerAnimation(mayBeValueOrOptions);
    }

    return this.triggerAnimation({ toValue: mayBeValueOrOptions });
  }

  triggerAnimation(options = {}) {
    const {
      toValue,
      easing,
      onAnimationEnd = () => {},
      duration = DEFAULT_SLIDING_DURATION,
    } = options;

    const animationConfig = {
      duration,
      easing,
      toValue: -Math.abs(toValue),
      delay: Platform.OS === 'android' ? 166.67 : undefined, // to make it looks smooth on android
    };

    const animation = Animated.timing(
      this.translateYAnimation,
      animationConfig,
    );

    animation.start(onAnimationEnd);
  }

  renderBackdrop() {
    if (!this.props.showBackdrop) {
      return null;
    }

    const { top, bottom } = this.props.draggableRange;

    const backdropOpacity = this.translateYAnimation.interpolate({
      inputRange: [-top, -bottom],
      outputRange: [0.75, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        key="backdrop"
        pointerEvents="box-only"
        ref={c => (this.backdrop = c)}
        onTouchStart={() => this.flick.stop()}
        onTouchEnd={() => this.props.onRequestClose()}
        style={[styles.backdrop, { opacity: backdropOpacity }]}
      />
    );
  }

  renderContent() {
    const { height, draggableRange: { top, bottom } } = this.props;

    const translateY = this.translateYAnimation.interpolate({
      inputRange: [-top, -bottom],
      outputRange: [-top, -bottom],
      extrapolate: 'clamp',
    });

    const transform = { transform: [{ translateY }] };

    const animatedContainerStyles = [
      styles.animatedContainer,
      transform,
      { height, top: visibleHeight, bottom: 0 },
    ];

    if (typeof this.props.children === 'function') {
      return (
        <Animated.View
          key="content"
          pointerEvents="box-none"
          style={animatedContainerStyles}>
          {this.props.children(this.panResponder.panHandlers)}
        </Animated.View>
      );
    }

    return (
      <Animated.View
        key="content"
        pointerEvents="box-none"
        style={animatedContainerStyles}
        {...this.panResponder.panHandlers}>
        {this.props.children}
      </Animated.View>
    );
  }

  render() {
    if (!this.state.visible) {
      return null;
    }

    return [this.renderBackdrop(), this.renderContent()];
  }
}

export default SlidingUpPanel;
