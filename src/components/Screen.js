import React, { PureComponent } from 'react';
import {
  View, SafeAreaView, StyleSheet, StatusBar
} from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default class Button extends PureComponent {
  render() {
    const { style, children, safeViewDisabled } = this.props;
    return !safeViewDisabled ? (
      <SafeAreaView style={[styles.screen, style]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#fff"
        />
        { children }
      </SafeAreaView>
    ) : (
      <View style={[styles.screen, style]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#fff"
        />
        { children }
      </View>
    );
  }
}
