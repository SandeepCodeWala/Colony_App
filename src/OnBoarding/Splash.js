import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { AppImages, Colors } from '../res';

export default function Splash() {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;  // initial scale
  const opacityAnim = useRef(new Animated.Value(0.8)).current; // initial opacity

  useEffect(() => {
    // Combine scale bounce + fade
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.0,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.9,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={AppImages.logo}
        style={[
          styles.img,
          { 
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.APPCOLOR,
  },
  img: {
    width: 200,
    height: 80,
  },
});
