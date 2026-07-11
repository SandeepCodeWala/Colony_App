import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Easing,
} from 'react-native';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import SettingHeader from './SettingHeader';
import ReserveHeader from './ReserveHeader';
import { ScreenSkeleton, useFirstRenderSkeleton } from './LuxurySkeleton';

export const T = PremiumTheme;

const fontMed = Fonts.luxurySansMedium;
const fontReg = Fonts.luxurySansLight;
const fontBold = Fonts.luxurySansMedium;

export const FadeInUp = ({ children, delay = 0, style }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(22)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 580,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 580,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
};

export const PressScale = ({ children, onPress, disabled, style }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = value => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 22,
      bounciness: 7,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => !disabled && animateTo(0.975)}
        onPressOut={() => !disabled && animateTo(1)}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const CravPage = ({
  children,
  title,
  onBack,
  header = 'setting',
  scroll = true,
  contentStyle,
  skeleton = true,
  skeletonDuration = 650,
}) => {
  const Header = header === 'reserve' ? ReserveHeader : SettingHeader;
  const isSkeletonVisible = useFirstRenderSkeleton(skeletonDuration);
  const body = (
    <FadeInUp style={[styles.content, contentStyle]}>{children}</FadeInUp>
  );

  if (skeleton && isSkeletonVisible) return <ScreenSkeleton variant="page" />;

  return (
    <View style={styles.page}>
      <View style={styles.bgOrbLarge} />
      <View style={styles.bgOrbSmall} />
      {!!title && <Header title={title} onBack={onBack} />}
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {body}
        </ScrollView>
      ) : (
        body
      )}
    </View>
  );
};

export const Hero = ({ kicker = 'COLONY', title, subtitle, align = 'left' }) => (
  <FadeInUp style={[styles.hero, align === 'center' && styles.centerHero]}>
    <View style={[styles.kickerPill, align === 'center' && styles.centerSelf]}>
      <Text style={styles.kicker}>{kicker}</Text>
    </View>
    <Text style={[styles.heroTitle, align === 'center' && styles.centerText]}>{title}</Text>
    {!!subtitle && (
      <Text style={[styles.heroSub, align === 'center' && styles.centerText]}>
        {subtitle}
      </Text>
    )}
  </FadeInUp>
);

export const PremiumCard = ({ children, style, delay = 0 }) => (
  <FadeInUp delay={delay}>
    <View style={[styles.card, style]}>{children}</View>
  </FadeInUp>
);

export const LuxeSectionHeader = ({ eyebrow, title, right }) => (
  <View style={styles.sectionHeader}>
    <View style={{ flex: 1 }}>
      {!!eyebrow && <Text style={styles.sectionEyebrow}>{eyebrow}</Text>}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {right}
  </View>
);

export const LuxeTabs = ({ tabs = [], activeKey, onChange, style }) => (
  <View style={[styles.tabsWrap, style]}>
    {tabs.map((tab, index) => {
      const active = tab.key === activeKey;
      return (
        <PressScale
          key={tab.key}
          onPress={() => onChange?.(tab.key)}
          style={[
            styles.tabPress,
            index !== 0 && styles.tabPressSpacing,
          ]}
        >
          <View style={[styles.tabItem, active && styles.tabItemActive]}>
            <Text numberOfLines={1} style={[styles.tabText, active && styles.tabTextActive]}>
              {tab.label}
            </Text>
            <View style={[styles.tabUnderline, active && styles.tabUnderlineActive]} />
          </View>
        </PressScale>
      );
    })}
  </View>
);

export const FoodImageCard = ({
  image,
  title,
  kicker,
  subtitle,
  children,
  disabled,
  delay = 0,
}) => (
  <FadeInUp delay={delay}>
    <View style={[styles.foodCard, disabled && styles.disabledCard]}>
      <ImageBackground
        source={image}
        style={styles.foodImage}
        imageStyle={styles.foodImageRadius}
      >
        <View style={styles.foodOverlay} />
        <View style={styles.foodTopGlow} />
        <View style={styles.foodBadge}>
          <Text style={styles.foodBadgeText}>{kicker}</Text>
        </View>
      </ImageBackground>
      <View style={styles.foodBody}>
        <Text style={styles.foodTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.foodSub}>{subtitle}</Text>}
        {children}
      </View>
    </View>
  </FadeInUp>
);

export const CravButton = ({
  title,
  onPress,
  variant = 'dark',
  disabled,
  style,
}) => (
  <PressScale disabled={disabled} onPress={onPress}>
    <View
      style={[
        styles.btn,
        variant === 'outline' && styles.btnOutline,
        variant === 'ghost' && styles.btnGhost,
        disabled && styles.btnDisabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.btnText,
          (variant === 'outline' || variant === 'ghost') && styles.btnOutlineText,
          disabled && styles.btnDisabledText,
        ]}
      >
        {title}
      </Text>
    </View>
  </PressScale>
);

export const InfoRow = ({ label, value, locked }) => (
  <View style={styles.infoRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
    {locked ? <Text style={styles.locked}>LOCKED</Text> : null}
  </View>
);

export const MiniStat = ({ label, value }) => (
  <View style={styles.miniStat}>
    <Text style={styles.miniValue}>{value}</Text>
    <Text style={styles.miniLabel}>{label}</Text>
  </View>
);

export const EmptyState = ({ title, subtitle }) => (
  <PremiumCard style={styles.emptyCard}>
    <View style={styles.emptyIcon}>
      <Text style={styles.emptyIconText}>✦</Text>
    </View>
    <Text style={styles.emptyTitle}>{title}</Text>
    {!!subtitle && <Text style={styles.emptySub}>{subtitle}</Text>}
  </PremiumCard>
);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: T.paper,
    paddingBottom: 28,
    overflow: 'hidden',
  },
  bgOrbLarge: {
    position: 'absolute',
    right: -96,
    top: 92,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(183,120,46,0.10)',
  },
  bgOrbSmall: {
    position: 'absolute',
    left: -70,
    bottom: 130,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(232,216,189,0.40)',
  },
  content: { paddingHorizontal: 18 },
  hero: { paddingTop: 20, paddingBottom: 18 },
  centerHero: { alignItems: 'center' },
  centerText: { textAlign: 'center' },
  centerSelf: { alignSelf: 'center' },
  kickerPill: {
    alignSelf: 'flex-start',
    backgroundColor: T.primarySoft,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  kicker: {
    color: T.primaryDark,
    fontFamily: fontBold,
    fontSize: 10,
    letterSpacing: 2.1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: T.ink,
    fontFamily: Fonts.displaySerif,
    fontSize: 38,
    lineHeight: 46,
    letterSpacing: 0,
    marginTop: 12,
  },
  heroSub: {
    color: T.muted,
    fontFamily: fontReg,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  card: {
    backgroundColor: T.glass,
    borderRadius: 4,
    padding: 20,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: T.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 5,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sectionEyebrow: {
    fontFamily: fontBold,
    fontSize: 10,
    color: T.primary,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: Fonts.displaySerif,
    color: T.ink,
    fontSize: 24,
    letterSpacing: -0.2,
  },
  tabsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,253,248,0.92)',
    borderRadius: 28,
    padding: 6,
    borderWidth: 1,
    borderColor: T.champagne,
    shadowColor: T.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 3,
    overflow: 'hidden',
  },
  tabPress: { flex: 1 },
  tabPressSpacing: { marginLeft: 6 },
  tabItem: {
    minHeight: 50,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabItemActive: {
    backgroundColor: T.surface,
    borderColor: T.primarySoft,
    shadowColor: T.shadow,
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  tabText: {
    color: T.muted,
    fontFamily: fontBold,
    fontSize: 10.2,
    letterSpacing: 1.05,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  tabTextActive: { color: T.primaryDark },
  tabUnderline: {
    width: 0,
    height: 3,
    borderRadius: 3,
    marginTop: 7,
    backgroundColor: 'transparent',
  },
  tabUnderlineActive: {
    width: 24,
    backgroundColor: T.primary,
  },
  foodCard: {
    backgroundColor: T.surface,
    borderRadius: 34,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 20,
    shadowColor: T.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 16 },
    elevation: 6,
  },
  disabledCard: { opacity: 0.66 },
  foodImage: {
    height: 236,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  foodImageRadius: { borderTopLeftRadius: 34, borderTopRightRadius: 34 },
  foodOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27,23,19,0.22)',
  },
  foodTopGlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 110,
    backgroundColor: 'rgba(247,241,232,0.28)',
  },
  foodBadge: {
    marginTop: 16,
    marginLeft: 16,
    backgroundColor: T.glass,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.68)',
  },
  foodBadgeText: {
    color: T.primaryDark,
    fontFamily: fontBold,
    fontSize: 10,
    letterSpacing: 1.8,
  },
  foodBody: { padding: 20 },
  foodTitle: {
    color: T.ink,
    fontFamily: fontBold,
    fontSize: 30,
    lineHeight: 36,
    textTransform: 'uppercase',
  },
  foodSub: {
    color: T.muted,
    fontFamily: fontReg,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  btn: {
    height: 54,
    borderRadius: 999,
    backgroundColor: T.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginTop: 18,
    shadowColor: T.primary,
    shadowOpacity: 0.26,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 9 },
    elevation: 6,
  },
  btnOutline: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.primary,
    shadowOpacity: 0.06,
  },
  btnGhost: {
    backgroundColor: T.primarySoft,
    borderWidth: 1,
    borderColor: T.border,
    shadowOpacity: 0.04,
  },
  btnText: {
    color: T.surface,
    fontFamily: fontBold,
    fontSize: 13,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  btnOutlineText: { color: T.primaryDark },
  btnDisabled: {
    backgroundColor: T.line,
    borderWidth: 1,
    borderColor: T.border,
    shadowOpacity: 0,
  },
  btnDisabledText: { color: T.softMuted },
  infoRow: {
    backgroundColor: T.pearl,
    borderWidth: 1,
    borderColor: T.line,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: fontBold,
    color: T.softMuted,
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  infoValue: { fontFamily: fontReg, color: T.ink, fontSize: 15, marginTop: 4 },
  locked: {
    color: T.primaryDark,
    fontFamily: fontBold,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  miniStat: {
    flex: 1,
    backgroundColor: T.primarySoft,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  miniValue: { color: T.ink, fontFamily: fontBold, fontSize: 26 },
  miniLabel: {
    color: T.muted,
    fontFamily: fontReg,
    fontSize: 12,
    marginTop: 4,
  },
  emptyCard: { alignItems: 'center', paddingVertical: 34 },
  emptyIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: T.primarySoft,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyIconText: { color: T.primary, fontSize: 20 },
  emptyTitle: {
    color: T.ink,
    fontFamily: fontBold,
    fontSize: 24,
    marginTop: 8,
    textAlign: 'center',
  },
  emptySub: {
    color: T.muted,
    fontFamily: fontReg,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
});
