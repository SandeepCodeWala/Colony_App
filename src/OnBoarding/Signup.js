import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';
import React, { Component, useEffect, useState } from 'react';
import InputText from '../components/InputText';
// import DateTimeLevel from '../components/DateTimeLevel';
import Button from '../components/Button';
import ErrorView from '../components/ErrorView';
import { colors, family, fonts, metrics, styles } from '../themes';
import {
  checkNormalData,
  checkName,
  checkEmail,
  checkPassword,
  checkConfirmPassword,
  checkMobile,
} from '../components/Validation';
import { postApi, getApi } from '../services/network/api';

import { AppImages, Fonts, Colors } from '../res';

export default function SignUp(props) {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [DOB, setDOB] = useState('');
  const [aniversary, setAniversary] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userNameError, setUserNameError] = useState({
    status: false,
    string: '',
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState({
    status: false,
    string: '',
  });

  const [emailError, setEmailError] = useState({ status: false, string: '' });

  const [dateTimeError, setDateTimeError] = useState({
    status: false,
    string: '',
  });
  const [passwordError, setPasswordError] = useState({
    status: false,
    string: '',
  });
  const [confirmPasswordError, setConfirmPasswordError] = useState({
    status: false,
    string: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [hidePassword1, setHidePassword1] = useState(true);

  const nameValidate = value => {
    if (value === '') {
      setUserNameError(checkName(value, 'Please enter Name'));
    } else if (value.length > 0 && checkName(value)) {
      setUserNameError(checkName(value, 'Please enter valid Name'));
    }
  };

  const emailValidate = value => {
    setEmail(value);
    if (value === '') {
      setEmailError(checkEmail(value, 'Please enter Email ID.'));
    } else if (value.length > 0 && checkEmail(value)) {
      setEmailError(checkEmail(value, 'Please enter valid Email ID'));
    }
  };

  const passwordValidate = value => {
    if (value === '') {
      setPasswordError(checkPassword(value, 'Please enter password'));
    } else if (value.length > 0 && checkPassword(value))
      setPasswordError(
        checkPassword(
          value,
          `Password should be between 8 to 16 characters and should include 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character ( !"#$%&'()*+,-.:;<=>?@[]^_{|})`,
        ),
      );
  };

  const setErrorState = () => {
    if (userName === '') {
      setUserNameError(checkName(userName, 'Please enter Name'));
    } else if (userName.length > 0 && checkName(userName)) {
      setUserNameError(checkName(userName, 'Please enter valid Name'));
    }
    if (phoneNumber === '') {
      setPhoneNumberError(
        checkMobile(phoneNumber, 'Please enter phone number'),
      );
    } else if (phoneNumber.length > 0 && checkMobile(phoneNumber)) {
      setPhoneNumberError(
        checkMobile(phoneNumber, 'Please enter valid phone number'),
      );
    }
    if (email === '') {
      setEmailError(checkEmail(email, 'Please enter Email ID.'));
    } else if (email.length > 0 && checkEmail(email)) {
      setEmailError(checkEmail(email, 'Please enter valid Email ID'));
    }

    if (password === '') {
      setPasswordError(checkPassword(password, 'Please enter password'));
    } else if (password.length > 0 && checkPassword(password)) {
      setPasswordError(
        checkPassword(
          password,
          `Password should be between 8 to 16 characters and should include 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character ( !"#$%&'()*+,-.:;<=>?@[]^_{|}~)`,
        ),
      );
    }
  };

  const createAccount = async () => {
    const data = {
      name: userName,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
    };
    setIsLoading(true);
    const response = await postApi('register', data);
    setIsLoading(false);
    if (response.success) {
      props.navigation.navigate('Login');
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
  const phoneValidate = value => {
    setPhoneNumber(value);
    if (value === '') {
      setPhoneNumberError(checkMobile(value, 'Please enter phone number'));
    } else if (value.length > 0 && checkMobile(value)) {
      setPhoneNumberError(
        checkMobile(value, 'Please enter valid phone number'),
      );
    }
  };

  const createAccount1 = () => {
    Keyboard.dismiss();
    if (
      !checkNormalData(userName, '').status &&
      !checkMobile(phoneNumber, '').status &&
      !checkEmail(email, '').status &&
      // !checkNormalData(aniversary, '').status &&
      // !checkNormalData(DOB, '').status &&
      !checkPassword(password, '').status
      // !checkConfirmPassword(password, confirmPassword, '').status
    ) {
      setErrorState();
      createAccount();
    } else {
      setErrorState();
    }
  };

  const hideOnPress = () => {
    setHidePassword(!hidePassword);
  };
  const hideOnPress1 = () => {
    setHidePassword1(!hidePassword1);
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
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start',
            paddingBottom: 40,
          }}
          style={{
            marginBottom: 0,
            width: '100%',
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <Text style={style.getStart}>{`SIGN UP`}</Text>
          <Text style={style.getStart1}>{`Your Colony Account`}</Text>

          <InputText
            placeholder="Enter your full name"
            label={'Name'}
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
            value={userName}
            onChangeText={value => {
              setUserName(value), nameValidate(value);
            }}
          />
          <ErrorView text={userNameError.text} show={userNameError.status} />
          {/* <InputText
            placeholder="Enter your phone number"
            label={'Phone Number'}
            placeholderTextColor={colors.txtColor}
            containerStyle={{ marginTop: 10 }}
            inputStyle={[
              {
                fontSize: fonts.fs_16,
                width: '100%',
                // marginLeft: 5,
                color: colors.black,
                fontFamily: 'InstrumentSans_Condensed-medium',
              },
            ]}
            value={userName}
            onChangeText={value => {
              setUserName(value), nameValidate(value);
            }}
          />
          <ErrorView text={userNameError.text} show={userNameError.status} /> */}
          <InputText
            placeholder="Enter your phone number"
            label={'Phone Number'}
            placeholderTextColor={colors.txtColor}
            containerStyle={{ marginTop: 10 }}
            inputStyle={[
              {
                fontSize: fonts.fs_16,
                width: '100%',
                // marginLeft: 5,
                color: colors.black,
                fontFamily: 'InstrumentSans_Condensed-medium',
              },
            ]}
            keyboardType="phone-pad"
            maxLength={10}
            secureTextEntry={false}
            returnKeyType="done"
            value={phoneNumber}
            onChangeText={value => {
              setPhoneNumber(value), phoneValidate(value);
            }}
          />
          <ErrorView
            text={phoneNumberError.text}
            show={phoneNumberError.status}
          />

          <InputText
            label={'Email Address'}
            placeholder="Enter your email address"
            placeholderTextColor={colors.txtColor}
            containerStyle={{ marginTop: 15 }}
            inputStyle={[
              {
                fontSize: fonts.fs_16,
                width: '90%',
                color: colors.black,
                fontFamily: 'InstrumentSans_Condensed-medium',
              },
            ]}
            value={email}
            onChangeText={value => {
              setEmail(value), emailValidate(value);
            }}
          />
          <ErrorView text={emailError.text} show={emailError.status} />

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
          <Button
            title="Sign Up"
            style={{ alignSelf: 'center', marginTop: 25 }}
            textTitle={{
              fontFamily: 'InstrumentSans_Condensed-medium',
              fontSize: fonts.fs_16,
              color: colors.white,
            }}
            onPress={() => createAccount1()}
          />
          <View style={{ alignSelf: 'center' }}>
            <Text style={style.already}>
              Already have an account?{' '}
              <Text
                style={{ color: '#FF0007' }}
                onPress={() => props.navigation.navigate('Login')}
              >
                Sign In.
              </Text>
            </Text>
          </View>
          {/* </View> */}
        </ScrollView>

        {/* <ActivityIndicator onRequestClose={false} isLoading={isLoading} /> */}
      </KeyboardAvoidingView>
    </ImageBackground>
    // <ImageBackground style={style.container} source={AppImages.ccc}>
    //   <KeyboardAvoidingView
    //     behavior={Platform.OS === 'ios' ? 'padding' : null}
    //     style={[{ flex: 1 }]}
    //   >
    //     <TouchableOpacity
    //       onPress={() =>
    //         props.navigation.navigate('BottomTabs', { screen: 'Explore' })
    //       }
    //       style={{ marginTop: 50, marginLeft: 20 }}
    //     >
    //       <Image source={AppImages.Back} style={{ height: 25, width: 25 }} />
    //     </TouchableOpacity>
    //     <ScrollView
    //       showsVerticalScrollIndicator={false}
    //       keyboardShouldPersistTaps="handled"
    //     >
    //       <View style={{ marginTop: '10%', alignSelf: 'center' }}>
    //         <Image
    //           style={{ height: 150, width: 200, resizeMode: 'contain' }}
    //           source={AppImages.logo}
    //         />
    //       </View>
    //       <Text style={style.getStart}>{`CREATE ACCOUNT`}</Text>
    //       <InputText
    //         // InputIcon={Icons.userName}
    //         placeholder="Name"
    //         placeholderTextColor={Colors.BLACK}
    //         containerStyle={{ marginTop: 30 }}
    //         inputStyle={[
    //           family.Montserrat_Regular,
    //           {
    //             fontSize: fonts.fs_16,
    //             width: '90%',
    //             marginLeft: 5,
    //             color: colors.black,
    //           },
    //         ]}
    //         value={userName}
    //         onChangeText={value => {
    //           setUserName(value), nameValidate(value);
    //         }}
    //       />
    //       <ErrorView text={userNameError.text} show={userNameError.status} />

    //       <InputText
    //         // InputIcon={Icons.email}
    //         placeholder="Email"
    //         placeholderTextColor={Colors.BLACK}
    //         containerStyle={{ marginTop: 15 }}
    //         inputStyle={[
    //           family.Montserrat_Regular,
    //           {
    //             fontSize: fonts.fs_16,
    //             width: '90%',
    //             marginLeft: 5,
    //             color: colors.black,
    //           },
    //         ]}
    //         value={email}
    //         onChangeText={value => {
    //           setEmail(value), emailValidate(value);
    //         }}
    //       />
    //       <ErrorView text={emailError.text} show={emailError.status} />

    //       <DateTimeLevel
    //         type="date"
    //         selectedDate={res => {
    //           setAniversary(res),
    //             setDateTimeError(
    //               checkNormalData(res, 'Please select anniversary date'),
    //             );
    //         }}
    //         date={aniversary}
    //         style={{ marginTop: 15, width: '90%' }}
    //         placeholder="Date of anniversary"
    //       />
    //       <ErrorView text={dateTimeError.text} show={dateTimeError.status} />

    //       <DateTimeLevel
    //         type="date"
    //         selectedDate={res => {
    //           console.log('ressssss----', res),
    //             setDOB(res),
    //             setDateTimeError(checkNormalData(res, 'Please select DOB'));
    //         }}
    //         date={DOB}
    //         style={{ marginTop: 15, width: '90%' }}
    //         placeholder="Date of birth"
    //       />
    //       <ErrorView text={dateTimeError.text} show={dateTimeError.status} />
    //       <View
    //         style={{
    //           flexDirection: 'row',
    //           width: '100%',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //           marginTop: 15,
    //         }}
    //       >
    //         <InputText
    //           placeholder="Password"
    //           placeholderTextColor={colors.black}
    //           containerStyle={{ marginTop: 0 }}
    //           secureTextEntry={hidePassword}
    //           inputStyle={[
    //             family.Montserrat_Regular,
    //             { fontSize: fonts.fs_16, marginLeft: 5, color: colors.black },
    //           ]}
    //           value={password}
    //           onChangeText={value => {
    //             setPassword(value), passwordValidate(value);
    //           }}
    //         />
    //         <TouchableOpacity
    //           style={{
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             right: 35,
    //             position: 'absolute',
    //           }}
    //           activeOpacity={0.3}
    //           onPress={() => hideOnPress()}
    //         >
    //           <Image
    //             style={{
    //               height: 25,
    //               width: 25,
    //               resizeMode: 'contain',
    //               tintColor: colors.black,
    //             }}
    //             source={hidePassword ? AppImages.closeeye : AppImages.openeye}
    //           />
    //         </TouchableOpacity>
    //       </View>

    //       <ErrorView text={passwordError.text} show={passwordError.status} />

    //       <View
    //         style={{
    //           flexDirection: 'row',
    //           width: '100%',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //           marginTop: 15,
    //         }}
    //       >
    //         <InputText
    //           placeholder="Confirm password"
    //           placeholderTextColor={colors.black}
    //           containerStyle={{ marginTop: 0 }}
    //           secureTextEntry={hidePassword1}
    //           inputStyle={[
    //             family.Montserrat_Regular,
    //             {
    //               fontSize: fonts.fs_16,
    //               width: '90%',
    //               marginLeft: 5,
    //               color: colors.black,
    //             },
    //           ]}
    //           value={confirmPassword}
    //           onChangeText={value => {
    //             setConfirmPassword(value),
    //               setConfirmPasswordError(
    //                 checkConfirmPassword(
    //                   value,
    //                   password,
    //                   'Password and Confirm Passsword does not match',
    //                 ),
    //               ),
    //               setConfirm(value.length > 0 ? false : true);
    //           }}
    //         />
    //         <TouchableOpacity
    //           style={{
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             right: 35,
    //             position: 'absolute',
    //           }}
    //           activeOpacity={0.3}
    //           onPress={() => hideOnPress1()}
    //         >
    //           <Image
    //             style={{
    //               height: 25,
    //               width: 25,
    //               resizeMode: 'contain',
    //               tintColor: colors.black,
    //             }}
    //             source={hidePassword1 ? AppImages.closeeye : AppImages.openeye}
    //           />
    //         </TouchableOpacity>
    //       </View>
    //       <ErrorView
    //         text={
    //           confirm
    //             ? 'Please enter confirm password'
    //             : confirmPasswordError.text
    //         }
    //         show={confirm ? true : confirmPasswordError.status}
    //       />

    //       <Button
    //         title="Sign Up"
    //         style={{ alignSelf: 'center', marginTop: 30 }}
    //         textTitle={{
    //           fontFamily: 'Montserrat-medium',
    //           fontSize: fonts.fs_16,
    //           color: colors.white,
    //           // fontWeight: Platform.OS=="ios"?'700':null,
    //         }}
    //         onPress={() => createAccount1()}
    //       />
    //       <Text style={style.already}>
    //         Already have an account?{' '}
    //         <Text
    //           style={{ color: '#FF0007' }}
    //           onPress={() => props.navigation.navigate('Login')}
    //         >
    //           Sign In.
    //         </Text>
    //       </Text>
    //     </ScrollView>
    //     {/* <ActivityIndicator onRequestClose={false} isLoading={isLoading} /> */}
    //   </KeyboardAvoidingView>
    // </ImageBackground>
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
    marginTop: 10,
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
