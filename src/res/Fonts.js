import { Platform } from 'react-native';

/**
 * Typography system inspired by luxury hospitality apps.
 * Poppins is bundled with the project and remains the reliable cross-platform sans.
 * The display face uses the native serif family so it renders on both iOS and Android
 * without adding another font dependency.
 */
export default {
  displaySerif: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'serif',
  }),
  displaySerifBold: Platform.select({
    ios: 'Georgia-Bold',
    android: 'serif',
    default: 'serif',
  }),
  luxurySansLight: 'Poppins-Light',
  luxurySans: 'Poppins-Regular',
  luxurySansMedium: 'Poppins-Medium',
  luxurySansBold: 'Poppins-SemiBold',

  // Backward-compatible aliases used throughout the existing app.
  instrumentSansMedium: 'Poppins-Medium',
  instrumentSansRegular: 'Poppins-Regular',
  instrumentSansBold: 'Poppins-SemiBold',

  poppinsBold: 'Poppins-Bold',
  poppinsSemiBold: 'Poppins-SemiBold',
  poppinsLight: 'Poppins-Light',
  poppinsRegular: 'Poppins-Regular',
  poppinsMedium: 'Poppins-Medium',
  poppinsMediumItalic: 'Poppins-MediumItalic',
  poppinsBoldItalic: 'Poppins-BoldItalic',
  poppinsExtraLightItalic: 'Poppins-ExtraLightItalic',
  poppinsSemiBoldItalic: 'Poppins-SemiBoldItalic',
  poppinsThinItalic: 'Poppins-ThinItalic',
};
