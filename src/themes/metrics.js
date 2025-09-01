import { Dimensions } from 'react-native'

const base = 15
const double = base * 2
const large = base * 6
const small = base / 2
const tiny = 3

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

export default {
  base,
  double,
  large,
  small,
  tiny,
  deviceWidth,
  deviceHeight,
}