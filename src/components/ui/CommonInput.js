import React from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';

export default function CommonInput(props) {
  const [focus, setFocus] = React.useState(false);
  const underline = React.useRef(new Animated.Value(0)).current;

  const onFocusHandler = () => {
    setFocus(true);
    Animated.timing(underline, {
      toValue: 1,
      duration: 220,
      useNativeDriver: false,
    }).start();
    props.onFocus?.();
  };

  const onBlurHandler = () => {
    setFocus(false);
    Animated.timing(underline, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
    props.onBlur?.();
  };

  // ─── Single source of truth ───────────────────────────────
  // props.state = 'err' | 'ok' | undefined
  // props.errorMsg = string  → auto sets state to 'err'
  // props.successMsg = string → auto sets state to 'ok'
  const derivedState = props.state
    ? props.state
    : props.errorMsg
    ? 'err'
    : props.successMsg
    ? 'ok'
    : undefined;

  const isError = derivedState === 'err';
  const isSuccess = derivedState === 'ok';

  const borderColor = isError
    ? '#D4846A'
    : isSuccess
    ? '#7AAB82'
    : focus
    ? '#9A7D50'
    : '#E8E2D8';

  const bgColor = isError
    ? '#FFF8F6'
    : isSuccess
    ? '#F6FBF7'
    : focus
    ? '#FFFEFB'
    : '#FAFAF8';

  const iconColor = isError
    ? '#D4846A'
    : isSuccess
    ? '#7AAB82'
    : focus
    ? '#9A7D50'
    : '#C8BFB0';

  const hintColor = props.hintColor || '#C0B8A8';

  return (
    <View style={styles.wrapper}>
      {/* Label + Hint row */}
      {(props.label || props.hint) && (
        <View style={styles.labelRow}>
          {props.label && (
            <Text style={styles.label}>{props.label.toUpperCase()}</Text>
          )}
          {props.hint && (
            <Text style={[styles.hint, { color: hintColor }]}>
              {props.hint}
            </Text>
          )}
        </View>
      )}

      {/* Input box */}
      <View
        style={[styles.inputBox, { borderColor, backgroundColor: bgColor }]}
      >
        {props.iconSource && (
          <Image
            source={props.iconSource}
            style={[styles.leftIcon, { tintColor: iconColor }]}
          />
        )}

        <TextInput
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          style={[styles.input, props.customStyle]}
          onChangeText={props.onChangeText}
          keyboardType={props.keyboardType}
          maxLength={props.maxLength}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          value={props.value}
          editable={props.editable !== false}
          placeholderTextColor="#C0B8A8"
          secureTextEntry={props.secureTextEntry}
          multiline={!!props.multiline}
          numberOfLines={props.numberOfLines || 1}
          scrollEnabled={props.scrollEnabled}
          includeFontPadding={false}
          textAlignVertical={props.multiline ? 'top' : 'center'}
        />

        {props.rightIcon && (
          <TouchableOpacity
            onPress={props.onRightIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={props.rightIcon}
              style={[styles.rightIcon, { tintColor: iconColor }]}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Animated underline */}
      <Animated.View
        style={[
          styles.underline,
          {
            backgroundColor: borderColor,
            transform: [{ scaleX: underline }],
          },
        ]}
      />

      {/* ✅ Error message — always shown when errorMsg exists */}
      {props.errorMsg ? (
        <Text style={styles.errorMsg}>⚠ {props.errorMsg}</Text>
      ) : null}

      {/* ✅ Success message — shown only when no error AND successMsg exists */}
      {!props.errorMsg && props.successMsg ? (
        <Text style={styles.successMsg}>✓ {props.successMsg}</Text>
      ) : null}

      {/* Strength bars */}
      {props.strengthBars !== undefined && (
        <View style={styles.strengthRow}>
          {[0, 1, 2, 3].map(i => (
            <View
              key={i}
              style={[
                styles.strengthBar,
                i < props.strengthBars && {
                  backgroundColor:
                    props.strengthBars <= 1
                      ? '#D4846A'
                      : props.strengthBars <= 2
                      ? '#D4A850'
                      : '#7AAB82',
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.8,
    color: '#8A8070',
    fontWeight: '500',
  },
  hint: {
    fontSize: 11,
    color: '#C0B8A8',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  leftIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    resizeMode: 'contain',
  },
  rightIcon: {
    width: 18,
    height: 18,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 15,
    color: '#2C2820',
  },
  underline: {
    height: 2,
    borderRadius: 1,
    marginTop: -1,
  },
  errorMsg: {
    fontSize: 11.5,
    color: '#C06A50',
    marginTop: 6,
    paddingLeft: 2,
  },
  successMsg: {
    fontSize: 11.5,
    color: '#5A9068',
    marginTop: 6,
    paddingLeft: 2,
  },
  strengthRow: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 8,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#EAE5DC',
  },
});
