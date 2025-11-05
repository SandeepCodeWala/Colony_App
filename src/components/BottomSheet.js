import React, { forwardRef, useImperativeHandle, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const BottomSheet = forwardRef(({ children, height = 350 }, ref) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const isOpen = useSharedValue(false);

  // ✅ OPEN SHEET
  const open = useCallback(() => {
    isOpen.value = true;
    translateY.value = withSpring(SCREEN_HEIGHT - height, {
      damping: 20,
      stiffness: 120,
    });
  }, [height]);

  // ✅ CLOSE SHEET
  const close = useCallback(() => {
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
    isOpen.value = false;
  }, []);

  // ✅ DRAG DOWN TO CLOSE
  const onGesture = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true },
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translateY.value,
      },
    ],
  }));

  // ✅ Expose open() & close()
  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.View style={[styles.overlay, isOpen.value ? { opacity: 1 } : { opacity: 0 }]} />

      {/* Tap outside to close */}
      {isOpen.value && (
        <TouchableWithoutFeedback onPress={close}>
          <View style={styles.touchableArea} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.sheet, { height }, animatedStyle]}>
        {/* Handle Bar */}
        <PanGestureHandler onGestureEvent={onGesture}>
          <View style={styles.handleWrapper}>
            <View style={styles.handleBar} />
          </View>
        </PanGestureHandler>

        {/* CONTENT */}
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          {children}
        </View>
      </Animated.View>
    </GestureHandlerRootView>
  );
});

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  touchableArea: {
    flex: 1,
  },
  sheet: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'absolute',
    bottom: 0,
  },
  handleWrapper: {
    alignItems: 'center',
    padding: 10,
  },
  handleBar: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
});
