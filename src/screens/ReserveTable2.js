import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelloWorldScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                    // fill the screen
    justifyContent: 'center',    // center vertically
    alignItems: 'center',        // center horizontally
    backgroundColor: '#fff',     // white background
  },
  text: {
    fontSize: 24,               // large text
    fontWeight: 'bold',
    color: '#000',              // black color
  },
});

export default HelloWorldScreen;
