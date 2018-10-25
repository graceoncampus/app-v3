import React, { PureComponent } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default class Button extends PureComponent {
  render() {
    return (
      <SafeAreaView style={[styles.screen, this.props.style]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#fff"
        />
        { this.props.children }
      </SafeAreaView>
    );
  }
}
