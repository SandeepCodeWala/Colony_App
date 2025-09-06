import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';

// import { Icons } from '@beverages/common'
import { colors, family, fonts, metrics, styles } from '../themes';

const Button = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[style.searchStyle, props.style]}
      onPress={props.onPress}
    >
      <Text style={[style.textTitle, props.textTitle]}>{props.title}</Text>
      {/* <Image style={style.arrow} source={Icons.arrow}/> */}
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  textTitle: {
    fontSize: fonts.fs_14,
    fontFamily: 'Verlag-Black',
    color: colors.white,
  },
  searchStyle: {
    height: 48,
    width: '90%',
    backgroundColor: colors.buttonBgColor,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...styles.row,
  },
  arrow: { height: 13, width: 20, resizeMode: 'contain', marginLeft: 15 },
  // title: { ...styles.row, marginTop: 20, marginLeft: 10 }
});

export default Button;
