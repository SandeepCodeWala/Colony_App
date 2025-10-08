import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import React, { Component, useEffect, useState } from 'react';
// import { Icons, Button, InputText, ErrorView,ActivityIndicator } from '@beverages/common';
import { colors, family, fonts, metrics, styles } from '../themes';
import {
  validateName,
  validateEmail,
  validatePhone,
  checkNormalData,
  checkName,
  checkEmail,
  checkMobile,
  checkPassword,
  checkConfirmPassword,
} from '../components/Validation';
import ActivityIndicator from '../components/ActivityIndicator';
import { AppImages } from '../res';
import InputText from '../components/InputText';
import ErrorView from '../components/ErrorView';
import Button from '../components/Button';
import { postApi } from '../services/network/api';

export default function SignIn(props) {
  const [loginField, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const [userNameError, setUserNameError] = useState({
    status: false,
    string: '',
  });
  const [passwordError, setPasswordError] = useState({
    status: false,
    string: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  // useEffect(() => {
  //   console.log('jjjjjjjj----', props?.route?.params.membership);
  //   setUserName(props?.route?.params?.membership);
  // }, [props.route]);
  useEffect(() => {
  const membership = props?.route?.params?.membership;
  if (membership) {
    console.log('Membership received:', membership);
    setUserName(membership);
  }
}, [props.route]);
  const setErrorState = () => {
    if (loginField === '') {
      setUserNameError(checkNormalData(loginField, 'Please enter Email ID.'));
    }
    if (password == '') {
      setPasswordError(checkNormalData(password, 'Please enter password'));
    }
  };

  const signIn = async () => {
    const data = {
      loginField: loginField,
      password: password,
    };

    setIsLoading(true);
    const response = await postApi('login', data);
    setIsLoading(false);
    console.log('data----', data);

    if (response.success) {
      props.navigation.navigate('RestaurantList');
      Alert.alert('Colony', response.message, [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
    } else {
      Alert.alert('Colony', response.message, [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
    }
  };

  const submit = () => {
    Keyboard.dismiss();
    if (
      !checkNormalData(loginField, '').status &&
      !checkNormalData(password, '').status
    ) {
      setErrorState();
      signIn();
    } else {
      setErrorState();
    }
  };

  const hideOnPress = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <ImageBackground style={style.container} source={AppImages.ccc}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={[styles.container, { flex: 1 }]}
      >
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('BottomTabs', { screen: 'Explore' })
          }
          style={{ marginTop: 50, marginLeft: 20 }}
        >
          <Image source={AppImages.Back} style={{ height: 25, width: 25 }} />
        </TouchableOpacity>
        <View style={{ marginTop: '20%', alignSelf: 'center' }}>
          <Image
            style={{ height: 150, width: 200, resizeMode: 'contain' }}
            source={AppImages.logo}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{
            marginBottom: 0,
            height: 'auto',
            width: '100%',
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          {/* <View
            style={{
              height: '80%',
              width: '100%',
              backgroundColor: 'white',
              justifyContent: 'flex-end',
            }}
          > */}
          <Text style={style.getStart}>{`SIGN IN`}</Text>
          <Text style={style.getStart1}>{`Your Colony Account`}</Text>

          <InputText
            placeholder="Enter email / membership no."
            label={'Email / Membership number'}
            placeholderTextColor={'#6D6D6D'}
            containerStyle={{ marginTop: 30 }}
            inputStyle={[
              {
                fontSize: fonts.fs_16,
                width: '100%',
                // marginLeft: 5,
                color: colors.black,
                fontFamily: 'InstrumentSans_Condensed-medium',
              },
            ]}
            value={loginField}
            onChangeText={value => {
              setUserName(value),
                setUserNameError(
                  checkNormalData(value, 'Please enter Email ID.'),
                );
            }}
          />
          <ErrorView text={userNameError.text} show={userNameError.status} />
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <InputText
              placeholder="Enter Password"
              label="Password"
              placeholderTextColor={'#6D6D6D'}
              containerStyle={{ marginTop: 0 }}
              secureTextEntry={hidePassword}
              inputStyle={[
                {
                  fontSize: fonts.fs_16,
                  width: '100%',
                  fontFamily: 'InstrumentSans_Condensed-medium',
                  color: colors.black,
                },
              ]}
              value={password}
              onChangeText={value => {
                setPassword(value),
                  setPasswordError(
                    checkNormalData(value, 'Please enter password'),
                  );
              }}
            />
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                right: 35,
                position: 'absolute',
              }}
              activeOpacity={0.3}
              onPress={() => hideOnPress()}
            >
              <Image
                style={{
                  height: 25,
                  width: 25,
                  marginTop: 15,
                  resizeMode: 'contain',
                  tintColor: colors.black,
                }}
                source={hidePassword ? AppImages.closeeye : AppImages.openeye}
              />
            </TouchableOpacity>
          </View>
          <ErrorView text={passwordError.text} show={passwordError.status} />
          <Text
            style={style.forgot}
            onPress={() => props.navigation.push('ForgotPassword')}
          >{`Forgot Password?`}</Text>

          <Button
            title="Sign In"
            style={{ alignSelf: 'center', marginTop: 25 }}
            textTitle={{
              fontFamily: 'InstrumentSans_Condensed-medium',
              fontSize: fonts.fs_16,
              color: colors.white,
            }}
            onPress={() => submit()}
          />
          {/* </View> */}
        </ScrollView>
        <ActivityIndicator onRequestClose={false} isLoading={isLoading} />
      </KeyboardAvoidingView>
      <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center' }}>
        <Text style={style.already}>
          Don't have an account?{' '}
          <Text
            style={{ color: '#2E43C5' }}
            onPress={() => props.navigation.push('Signup')}
          >
            Sign Up.
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
}

const style = StyleSheet.create({
  container: { ...styles.container },
  getStart: {
    fontFamily: 'InstrumentSans_Condensed-medium',
    textAlign: 'center',
    fontSize: Platform.OS == 'ios' ? fonts.fs_32 : fonts.fs_32,
    color: '#1A1A1A',
    marginTop: 30,
  },
  getStart1: {
    fontFamily: 'InstrumentSans_Condensed-medium',
    textAlign: 'center',
    fontSize: Platform.OS == 'ios' ? fonts.fs_22 : fonts.fs_22,
    color: colors.txtColor,
  },
  information: {
    ...family.Montserrat_Regular,
    fontSize: fonts.fs_15,
    marginLeft: 20,
    color: colors.white,
    fontWeight: Platform.OS == 'ios' ? '600' : null,
  },
  forgot: {
    fontFamily: 'InstrumentSans_Condensed-medium',
    fontSize: fonts.fs_18,
    marginLeft: 20,
    marginTop: 15,
    color: colors.txtColor,
    textAlign: 'center',
  },
  already: {
    fontSize: fonts.fs_16,
    fontFamily: 'InstrumentSans_Condensed-regular',
    color: colors.txtColor,
    textAlign: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 4.65,

    // elevation: 8,
  },
});
