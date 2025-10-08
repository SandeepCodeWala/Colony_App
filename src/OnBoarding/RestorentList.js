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
import { AppImages } from '../res';
import InputText from '../components/InputText';
import ErrorView from '../components/ErrorView';
import Button from '../components/Button';
import { postApi } from '../services/network/api';

export default function RestaurantList(props) {
  const [name, setUserName] = useState('');
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

  const setErrorState = () => {
    if (name === '') {
      setUserNameError(checkNormalData(name, 'Please enter Email ID.'));
    }
    if (password == '') {
      setPasswordError(checkNormalData(password, 'Please enter password'));
    }
  };

  const signIn = async () => {
    const data = {
      email: name,
      password: password,
    };

    setIsLoading(true);
    const response = await postApi('login', data);
    setIsLoading(false);

    if (response.success) {
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
      !checkNormalData(name, '').status &&
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ marginBottom: 60 }}
        >
          <View style={{ marginTop: '20%', alignSelf: 'center' }}>
            <Image
              style={{ height: 150, width: 200, resizeMode: 'contain' }}
              source={AppImages.logo}
            />
          </View>
          <Text style={style.getStart}>{`Restaurant List`}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const style = StyleSheet.create({
  container: { ...styles.container },
  getStart: {
    fontFamily: 'Montserrat-medium',
    textAlign: 'center',
    fontSize: Platform.OS == 'ios' ? fonts.fs_36 : fonts.fs_30,

    color: colors.white,
  },
  information: {
    ...family.Montserrat_Regular,
    fontSize: fonts.fs_15,
    marginLeft: 20,
    color: colors.white,
    fontWeight: Platform.OS == 'ios' ? '600' : null,
  },
  forgot: {
    fontFamily: 'Verlag-Book',

    fontSize: fonts.fs_18,
    marginLeft: 20,
    marginTop: 15,
    color: colors.white,
    textAlign: 'center',
  },
  already: {
    fontSize: fonts.fs_16,
    fontFamily: 'Montserrat-regular',
    color: colors.black,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
});
