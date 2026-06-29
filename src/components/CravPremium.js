import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import SettingHeader from './SettingHeader';
import ReserveHeader from './ReserveHeader';

export const T = PremiumTheme;

export const CravPage = ({
  children,
  title,
  onBack,
  header = 'setting',
  scroll = true,
  contentStyle,
}) => {
  const Header = header === 'reserve' ? ReserveHeader : SettingHeader;
  const body = <View style={[styles.content, contentStyle]}>{children}</View>;
  return (
    <View style={[styles.page]}>
      {!!title && <Header title={title} onBack={onBack} />}
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 44 }}
        >
          {body}
        </ScrollView>
      ) : (
        body
      )}
    </View>
  );
};

export const Hero = ({ kicker = 'CRAV', title, subtitle }) => (
  <View style={styles.hero}>
    <Text style={styles.kicker}>{kicker}</Text>
    <Text style={styles.heroTitle}>{title}</Text>
    {!!subtitle && <Text style={styles.heroSub}>{subtitle}</Text>}
  </View>
);

export const PremiumCard = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const FoodImageCard = ({
  image,
  title,
  kicker,
  subtitle,
  children,
  disabled,
}) => (
  <View style={[styles.foodCard, disabled && styles.disabledCard]}>
    <ImageBackground
      source={image}
      style={styles.foodImage}
      imageStyle={styles.foodImageRadius}
    >
      <View style={styles.foodOverlay} />
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
);

export const CravButton = ({
  title,
  onPress,
  variant = 'dark',
  disabled,
  style,
}) => (
  <TouchableOpacity
    activeOpacity={0.82}
    onPress={onPress}
    disabled={disabled}
    style={[
      styles.btn,
      variant === 'outline' && styles.btnOutline,
      disabled && styles.btnDisabled,
      style,
    ]}
  >
    <Text
      style={[
        styles.btnText,
        variant === 'outline' && styles.btnOutlineText,
        disabled && styles.btnDisabledText,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
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
    <Text style={styles.emptyTitle}>{title}</Text>
    {!!subtitle && <Text style={styles.emptySub}>{subtitle}</Text>}
  </PremiumCard>
);

const fontMed = Fonts.instrumentSansMedium;
const fontReg = Fonts.instrumentSansRegular;

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: T.paper },
  content: { paddingHorizontal: 18 },
  hero: { paddingTop: 18, paddingBottom: 16 },
  kicker: {
    color: T.tomato,
    fontFamily: fontMed,
    fontSize: 11,
    letterSpacing: 2.8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: T.ink,
    fontFamily: fontMed,
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -0.8,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  heroSub: {
    color: T.muted,
    fontFamily: fontReg,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  card: {
    backgroundColor: T.surface,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: T.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  foodCard: {
    backgroundColor: T.surface,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 20,
    shadowColor: T.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  disabledCard: { opacity: 0.62 },
  foodImage: {
    height: 230,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  foodImageRadius: { borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  foodOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,248,237,0.16)',
  },
  foodBadge: {
    marginTop: 16,
    marginLeft: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: T.border,
  },
  foodBadgeText: {
    color: T.tomato,
    fontFamily: fontMed,
    fontSize: 10,
    letterSpacing: 1.8,
  },
  foodBody: { padding: 20 },
  foodTitle: {
    color: T.ink,
    fontFamily: fontMed,
    fontSize: 31,
    lineHeight: 35,
    textTransform: 'uppercase',
  },
  foodSub: {
    color: T.muted,
    fontFamily: fontReg,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  btn: {
    height: 52,
    borderRadius: 999,
    backgroundColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginTop: 18,
  },
  btnOutline: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.gold,
  },
  btnText: {
    color: T.surface,
    fontFamily: fontMed,
    fontSize: 13,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  btnOutlineText: { color: T.goldDark },
  btnDisabled: {
    backgroundColor: T.line,
    borderWidth: 1,
    borderColor: T.border,
  },
  btnDisabledText: { color: T.softMuted },
  infoRow: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.line,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: fontMed,
    color: T.softMuted,
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  infoValue: { fontFamily: fontReg, color: T.ink, fontSize: 15, marginTop: 4 },
  locked: {
    color: T.goldDark,
    fontFamily: fontMed,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  miniStat: {
    flex: 1,
    backgroundColor: T.cream,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  miniValue: { color: T.ink, fontFamily: fontMed, fontSize: 26 },
  miniLabel: {
    color: T.muted,
    fontFamily: fontReg,
    fontSize: 12,
    marginTop: 4,
  },
  emptyCard: { alignItems: 'center', paddingVertical: 34 },
  emptyMark: {
    color: T.tomato,
    fontFamily: fontMed,
    fontSize: 10,
    letterSpacing: 3,
  },
  emptyTitle: {
    color: T.ink,
    fontFamily: fontMed,
    fontSize: 25,
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
