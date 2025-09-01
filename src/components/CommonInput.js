import React from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Colors, Fonts } from '../res';
import Utility from './Utility';

export default function CommonInput(props) {
  const [focus, setFocus] = React.useState(false);
  const placeholderTextColor = props.placeholderTextColor || 'grey';

  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.inputview, focus && styles.focused, props.inputView]}
      >
        <TextInput
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          style={[
            styles.input,
            props.customStyle,
            props.iconSource ? styles.inputWithIcon : null,
            props.multiline ? styles.multilineInput : null,
          ]}
          onChangeText={props.onChangeText}
          keyboardType={props.keyboardType}
          maxLength={props.maxLength}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          value={props.value}
          editable={props.editable}
          placeholderTextColor={placeholderTextColor}
          multiline={!!props.multiline}
          // numberOfLines={props.numberOfLines}
          numberOfLines={props.numberOfLines || 1}
          scrollEnabled={props.scrollEnabled}
          includeFontPadding={false}
          textAlignVertical="center"
        />
        {props.rightIcon && (
          <TouchableOpacity>
            <Image
              source={props.rightIcon}
              style={[
                styles.icon,
                props.multiline ? styles.multilineIcon : null,
                props.icon,
              ]}
            />
          </TouchableOpacity>
        )}
      </View>
      {props.errorMsg && typeof props.errorMsg === 'string' && (
        <Text style={styles.errorMsg}>{props.errorMsg}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 55,
    marginVertical: Utility.getPerCentage(2.5),
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  focused: {
    borderColor: Colors.PRIMARY,
  },
  errorMsg: {
    color: Colors.RED,
    fontSize: 10,
    fontFamily: Fonts.regular,
    marginLeft: 25,
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    height: 55,
    color: Colors.BLACK,
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  inputWithIcon: {
    paddingRight: 0,
  },
  multilineInput: {
    textAlignVertical: 'top',
    height: '100%',
    padding: 10,
  },
  multilineIcon: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
});
