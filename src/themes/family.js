import { Platform } from 'react-native'
import colors from './colors'

const type = {
  MontserratBlack: 'Montserrat-Black',
  MontserratBlackItalic: 'Montserrat-BlackItalic',
  MontserratBold: 'Montserrat-Bold',
  MontserratBoldItalic: 'Montserrat-BoldItalic',
  MontserratExtraBold: 'Montserrat-ExtraBold',
  MontserratExtraBoldItalic: 'Montserrat-ExtraBoldItalic',
  MontserratExtraLight: 'Montserrat-ExtraLight',
  MontserratItalic: 'Montserrat-Italic',
  MontserratLight: 'Montserrat-Light',
  MontserratLightItalic: 'Montserrat-LightItalic',
  MontserratMedium: 'Montserrat-Medium',
  MontserratMediumItalic: 'Montserrat-MediumItalic',
  MontserratRegular: 'Montserrat-Regular',
  MontserratSemiBold: 'Montserrat-SemiBold',
  MontserratSemiBoldItalic: 'Montserrat-SemiBoldItalic',
  MontserratThin: 'Montserrat-Thin',
  MontserratThinItalic: 'Montserrat-ThinItalic',

 
}

const defaultMontserrat = {
  fontFamily: type.Montserrat,
  color: colors.black,
  fontWeight: 'normal',
  letterSpacing: 0,
  fontSize: 14,
}



const style = {
  Montserrat_Black: {
    ...defaultMontserrat,
    fontFamily: type.MontserratBlack,
  },
  Montserrat_BlackItalic: {
    ...defaultMontserrat,
    fontFamily: type.MontserratBlackItalic,
  },
  Montserrat_Bold: {
    ...defaultMontserrat,
    fontFamily: type.MontserratBold,
  },
  Montserrat_BoldItalic: {
    ...defaultMontserrat,
    fontFamily: type.MontserratBoldItalic,
  },
  Montserrat_ExtraBold: {
    ...defaultMontserrat,
    fontFamily: type. MontserratExtraBold,
  },
  Montserrat_ExtraBoldItalic: {
    ...defaultMontserrat,
    fontFamily: type.MontserratExtraBoldItalic,
  },
  Montserrat_Italic: {
    ...defaultMontserrat,
    fontFamily: type.MontserratItalic,
  },
  Montserrat_Light: {
    ...defaultMontserrat,
    fontFamily: type.MontserratLight,
  },
  Montserrat_LightItalic: {
    ...defaultMontserrat,
    fontFamily: type.MontserratLightItalic,
  }, 
  Montserrat_Medium: {
    ...defaultMontserrat,
    fontFamily: type.MontserratMedium,
  },
  Montserrat_MediumItalic: {
    ...defaultMontserrat,
    fontFamily: type.MontserratMediumItalic,
  },
  Montserrat_Regular: {
    ...defaultMontserrat,
    fontFamily: type.MontserratRegular,
  },
  Montserrat_SemiBold: {
    ...defaultMontserrat,
    fontFamily: type.MontserratSemiBold,
  },
  Montserrat_SemiBoldItalic: {
    ...defaultMontserrat,
    fontFamily: type.MontserratSemiBoldItalic,
  },
  Montserrat_Thin: {
    ...defaultMontserrat,
    fontFamily: type.MontserratThin,
  },
  Montserrat_ThinItalic: {
    ...defaultMontserrat,
    fontFamily: type.MontserratThinItalic,
  },
  
}

export default style