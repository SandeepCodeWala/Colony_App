import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import PremiumTheme from '../res/PremiumTheme';

const T = PremiumTheme;

export const useFirstRenderSkeleton = (duration = 850) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return visible;
};

const Bone = ({ style, pulse }) => (
  <Animated.View style={[styles.bone, style, { opacity: pulse }]} />
);

export const ScreenSkeleton = ({ variant = 'page' }) => {
  const pulse = useRef(new Animated.Value(0.34)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.68,
          duration: 760,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.34,
          duration: 760,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  if (variant === 'image') {
    return (
      <View style={styles.imageRoot}>
        <StatusBar backgroundColor={T.cream} barStyle="dark-content" />

        <View style={styles.imageSection}>
          <Bone pulse={pulse} style={styles.imagePanel} />
          <View style={styles.imageCopy}>
            <Bone pulse={pulse} style={styles.imageCategory} />
            <Bone pulse={pulse} style={styles.imageTitle} />
            <Bone pulse={pulse} style={styles.imageButton} />
          </View>
        </View>

        <View style={styles.imageSectionSmall}>
          <Bone pulse={pulse} style={styles.imagePanel} />
          <View style={styles.secondCopy}>
            <Bone pulse={pulse} style={styles.imageCategory} />
            <Bone pulse={pulse} style={styles.imageTitleShort} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={T.cream} barStyle="dark-content" />
      <View style={styles.header}>
        <Bone pulse={pulse} style={styles.headerTitle} />
      </View>
      <View style={styles.content}>
        <Bone pulse={pulse} style={styles.kicker} />
        <Bone pulse={pulse} style={styles.pageTitle} />
        <Bone pulse={pulse} style={styles.pageSubtitle} />
        <Bone pulse={pulse} style={styles.card} />
        <Bone pulse={pulse} style={styles.row} />
        <Bone pulse={pulse} style={styles.row} />
        <Bone pulse={pulse} style={styles.rowShort} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.surfaceSoft },
  imageRoot: { flex: 1, backgroundColor: T.surfaceSoft },
  bone: { backgroundColor: '#E7DBCC', overflow: 'hidden' },
  header: {
    height: Platform.OS === 'ios' ? 112 : 92,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: T.cream,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.border,
  },
  headerTitle: { width: 92, height: 16, borderRadius: 8 },
  content: { paddingHorizontal: 22, paddingTop: 28 },
  kicker: { width: 88, height: 9, borderRadius: 6, marginBottom: 14 },
  pageTitle: { width: '72%', height: 34, borderRadius: 10 },
  pageSubtitle: { width: '90%', height: 12, borderRadius: 6, marginTop: 14 },
  card: {
    height: 170,
    borderRadius: 18,
    marginTop: 28,
    backgroundColor: '#EDE4D8',
  },
  row: { height: 58, borderRadius: 14, marginTop: 15 },
  rowShort: { width: '74%', height: 58, borderRadius: 14, marginTop: 15 },
  imageSection: {
    height: '49%',
    minHeight: 360,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  imageSectionSmall: {
    flex: 1,
    minHeight: 240,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  imagePanel: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E9E0D5',
  },
  imageCopy: {
    paddingHorizontal: 28,
    paddingBottom: 46,
    alignItems: 'center',
  },
  secondCopy: {
    paddingHorizontal: 28,
    paddingBottom: 34,
    alignItems: 'center',
  },
  imageCategory: {
    width: 112,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#DCCFBE',
  },
  imageTitle: {
    width: '78%',
    height: 42,
    borderRadius: 12,
    marginTop: 18,
    backgroundColor: '#E1D4C4',
  },
  imageTitleShort: {
    width: '62%',
    height: 38,
    borderRadius: 12,
    marginTop: 18,
    backgroundColor: '#E1D4C4',
  },
  imageButton: {
    width: '100%',
    height: 58,
    borderRadius: 4,
    marginTop: 26,
    backgroundColor: '#F5EFE7',
    borderWidth: 1,
    borderColor: '#E1D4C4',
  },
  tabBone: {
    height: Platform.OS === 'ios' ? 94 : 78,
    flexDirection: 'row',
    backgroundColor: T.surfaceSoft,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.border,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 24, height: 24, borderRadius: 12 },
  tabLabel: { width: 42, height: 7, borderRadius: 4, marginTop: 8 },
});

export default ScreenSkeleton;
