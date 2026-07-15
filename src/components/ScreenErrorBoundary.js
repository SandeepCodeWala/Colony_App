import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const T = PremiumTheme;

class ScreenErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (__DEV__) {
      console.error('Screen render error:', error, info?.componentStack);
    }
  }

  retry = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.root}>
        <Text style={styles.eyebrow}>COLONY</Text>
        <Text style={styles.title}>This page could not be opened</Text>
        <Text style={styles.description}>
          Please try again. Your account and reservation details are safe.
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.82}
          onPress={this.retry}
          style={styles.button}
        >
          <Text style={styles.buttonText}>TRY AGAIN</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ScreenErrorBoundary;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: T.paper,
  },
  eyebrow: {
    fontFamily: Fonts.luxurySansMedium,
    color: T.primary,
    fontSize: 11,
    letterSpacing: 2.2,
  },
  title: {
    maxWidth: 520,
    marginTop: 14,
    fontFamily: Fonts.displaySerif,
    color: T.ink,
    fontSize: 34,
    lineHeight: 42,
    textAlign: 'center',
  },
  description: {
    maxWidth: 520,
    marginTop: 12,
    fontFamily: Fonts.luxurySansLight,
    color: T.muted,
    fontSize: 14,
    lineHeight: 23,
    textAlign: 'center',
  },
  button: {
    minWidth: 220,
    minHeight: 56,
    marginTop: 26,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: T.primary,
    borderWidth: 1,
    borderColor: T.primaryDark,
  },
  buttonText: {
    fontFamily: Fonts.luxurySansMedium,
    color: T.surface,
    fontSize: 12,
    letterSpacing: 2.3,
  },
});
