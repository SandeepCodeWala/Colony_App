import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SettingHeader from '../components/SettingHeader';
import { Colors } from '../res';
import CommonTextInput from '../components/TextInputField';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const navigation=useNavigation()
  return (
    <View style={styles.container}>
      <SettingHeader
        title={'CHANGE PASSWORD'}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 25 }}
      >
        <Text style={styles.mainTitle}>A place to update your details</Text>
        <Text style={styles.subTitle}>CHANGE PASSWORD</Text>

        <View style={styles.formContainer}>
          <View style={styles.formItem}>
            <CommonTextInput
              label="CURRENT PASSWORD"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              showError={!currentPassword}
            />
          </View>

          <View style={styles.formItem}>
            <CommonTextInput
              label="NEW PASSWORD"
              value={newPassword}
              onChangeText={setNewPassword}
              showError={!newPassword}
            />
          </View>

          <View style={styles.formItem}>
            <CommonTextInput
              label="CONFIRM PASSWORD"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              showError={!confirmNewPassword}
            />
          </View>

          <View style={styles.formItem}>
            <Button
              title={'CHANGE PASSWORD '}
              textStyle={{ color: 'black' }}
              style={styles.buttonStyles}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },

  formContainer: {
    paddingTop: 24,
    flexDirection: 'column',
    
  },

  mainTitle: {
    fontSize: 35,
    fontFamily: 'serif',
    color: '#444444',
    marginBottom: 15,
    marginTop: 29,
    textAlign: 'center',
    fontFamily: 'serif',
  },

  subTitle: {
    fontSize: 13,
    color: '#666',
    letterSpacing: 1,
    marginBottom: 15,
    textAlign: 'center',
  },
  formContainer: {
    flexDirection: 'column',
    gap: 5,
  },
  formItem: {
    marginBottom: 20, // ✅ THIS replaces gap
  },
  buttonStyles: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    
  },
});
