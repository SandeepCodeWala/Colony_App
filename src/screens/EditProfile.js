import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'axios';

import SettingHeader from '../components/SettingHeader';
import CommonTextInput from '../components/TextInputField';
import CommonDropdown from '../components/CommonDropdown';
import { AppImages, Colors } from '../res';

const { width } = Dimensions.get('window');

// ─── Professional Static Data ─────────────────────────────────
const titleData = [
  { label: 'Mr', value: 'Mr' },
  { label: 'Ms', value: 'Ms' },
  { label: 'Mrs', value: 'Mrs' },
];

const genderData = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

const countryCodeData = [
  { label: '+91 🇮🇳', value: '+91' },
  { label: '+1 🇺🇸', value: '+1' },
  { label: '+44 🇬🇧', value: '+44' },
  { label: '+971 🇦🇪', value: '+971' },
];

const nationalityData = [
  { label: 'Indian', value: 'Indian' },
  { label: 'American', value: 'American' },
  { label: 'British', value: 'British' },
  { label: 'Emirati', value: 'Emirati' },
];

const countryData = [
  { label: 'India', value: 'India' },
  { label: 'USA', value: 'USA' },
  { label: 'UK', value: 'UK' },
  { label: 'UAE', value: 'UAE' },
];

// ─── Helpers (Same as before) ─────────────────────────────────
const splitName = (fullName = '') => {
  const parts = fullName.trim().split(' ');
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
};

const splitPhone = (phone = '') => {
  const match = phone?.match(/^(\+\d{1,3})\s*(.*)$/);
  return match
    ? { code: match[1], number: match[2] }
    : { code: null, number: phone || '' };
};

// ─── Validation ───────────────────────────────────────────────
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string()
    .matches(/^[0-9]{7,15}$/, 'Enter a valid mobile number')
    .required('Mobile number is required'),
});

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token);
  const BASE_URL = 'https://moistness-shudder-partition.ngrok-free.dev';

  const formik = useFormik({
    initialValues: {
      title: null,
      firstName: '',
      lastName: '',
      nationality: null,
      gender: null,
      email: '',
      addressLineOne: '',
      addressLinetwo: '',
      addressLinethree: '',
      city: '',
      country: null,
      mobileCode: null,
      phone: '',
      workCode: null,
      workNumber: '',
      homeCode: null,
      homeNumber: '',
    },
    validationSchema,
    onSubmit: async values => {
      // ... (Payload same as previous response)
      try {
        const payload = {
          name: `${values.firstName} ${values.lastName}`.trim(),
          phone: values.mobileCode
            ? `${values.mobileCode} ${values.phone}`.trim()
            : values.phone,
          title: values.title,
          gender: values.gender,
          nationality: values.nationality,
          workNumber: values.workNumber
            ? `${values.workCode || ''} ${values.workNumber}`.trim()
            : null,
          homeNumber: values.homeNumber
            ? `${values.homeCode || ''} ${values.homeNumber}`.trim()
            : null,
          addressLineOne: values.addressLineOne,
          addressLinetwo: values.addressLinetwo,
          addressLinethree: values.addressLinethree,
          city: values.city,
          country: values.country,
        };

        const response = await axios.put(
          `${BASE_URL}/api/user/edit-profile`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.data?.success) {
          Alert.alert('Success', 'Profile updated successfully');
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert(
          'Error',
          error?.response?.data?.message || 'Something went wrong',
        );
      }
    },
  });

  // fetchProfile function remains same as previous response...
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/get_profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const u = response.data?.data || response.data?.user || {};

      const { firstName, lastName } = splitName(u.name);
      const mobile = splitPhone(u.phone);
      const work = splitPhone(u.workNumber);
      const home = splitPhone(u.homeNumber);

      formik.setValues({
        title: u.title || null,
        firstName,
        lastName,
        nationality: u.nationality || null,
        gender: u.gender || null,
        email: u.email || '',

        addressLineOne: u.addressLineOne || '',
        addressLinetwo: u.addressLinetwo || '',
        addressLinethree: u.addressLinethree || '',
        city: u.city || '',
        country: u.country || null,

        mobileCode: mobile.code,
        phone: mobile.number,
        workCode: work.code,
        workNumber: work.number,
        homeCode: home.code,
        homeNumber: home.number,

        anniversary_date: u.anniversary_date || null,
        birthday_date: u.birthday_date || null,
      });
    } catch (error) {
      console.log('Fetch profile error:', error?.message);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fieldError = field =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <SettingHeader title="EDIT PROFILE" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.mainTitle}>Update Your Personal Details</Text>
        <Text style={styles.subTitle}>
          Please fill in the information below
        </Text>

        {/* PERSONAL INFORMATION SECTION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>PERSONAL INFORMATION</Text>

          <CommonDropdown
            label="TITLE"
            data={titleData}
            value={formik.values.title}
            onChange={val => formik.setFieldValue('title', val)}
          />

          <CommonTextInput
            label="FIRST NAME *"
            value={formik.values.firstName}
            onChangeText={val => formik.setFieldValue('firstName', val)}
            onBlur={() => formik.setFieldTouched('firstName')}
          />
          {fieldError('firstName') && (
            <Text style={styles.errorText}>{fieldError('firstName')}</Text>
          )}

          <CommonTextInput
            label="LAST NAME *"
            value={formik.values.lastName}
            onChangeText={val => formik.setFieldValue('lastName', val)}
            onBlur={() => formik.setFieldTouched('lastName')}
          />
          {fieldError('lastName') && (
            <Text style={styles.errorText}>{fieldError('lastName')}</Text>
          )}

          <CommonDropdown
            label="NATIONALITY"
            data={nationalityData}
            value={formik.values.nationality}
            onChange={val => formik.setFieldValue('nationality', val)}
          />
          <CommonDropdown
            label="GENDER"
            data={genderData}
            value={formik.values.gender}
            onChange={val => formik.setFieldValue('gender', val)}
          />

          <View style={styles.readOnlyContainer}>
            <CommonTextInput
              label="EMAIL ADDRESS"
              value={formik.values.email}
              editable={false}
            />
            <Text style={styles.readOnlyHint}>Email cannot be changed</Text>
          </View>
        </View>

        {/* ADDRESS SECTION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>ADDRESS INFORMATION</Text>
          <CommonTextInput
            label="ADDRESS LINE 1"
            value={formik.values.addressLineOne}
            onChangeText={val => formik.setFieldValue('addressLineOne', val)}
          />
          <CommonTextInput
            label="ADDRESS LINE 2"
            value={formik.values.addressLinetwo}
            onChangeText={val => formik.setFieldValue('addressLinetwo', val)}
          />
          <CommonTextInput
            label="ADDRESS LINE 3"
            value={formik.values.addressLinethree}
            onChangeText={val => formik.setFieldValue('addressLinethree', val)}
          />
          <CommonTextInput
            label="CITY"
            value={formik.values.city}
            onChangeText={val => formik.setFieldValue('city', val)}
          />
          <CommonDropdown
            label="COUNTRY"
            data={countryData}
            value={formik.values.country}
            onChange={val => formik.setFieldValue('country', val)}
          />
        </View>

        {/* CONTACT SECTION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>CONTACT INFORMATION</Text>

          <PhoneRow
            codeValue={formik.values.mobileCode}
            onCodeChange={val => formik.setFieldValue('mobileCode', val)}
            numberValue={formik.values.phone}
            onNumberChange={val => formik.setFieldValue('phone', val)}
            onNumberBlur={() => formik.setFieldTouched('phone')}
            numberLabel="MOBILE NUMBER *"
            error={fieldError('phone')}
            codeData={countryCodeData}
          />

          <PhoneRow
            codeValue={formik.values.workCode}
            onCodeChange={val => formik.setFieldValue('workCode', val)}
            numberValue={formik.values.workNumber}
            onNumberChange={val => formik.setFieldValue('workNumber', val)}
            numberLabel="WORK NUMBER"
            codeData={countryCodeData}
            style={{ marginTop: 16 }}
          />

          <PhoneRow
            codeValue={formik.values.homeCode}
            onCodeChange={val => formik.setFieldValue('homeCode', val)}
            numberValue={formik.values.homeNumber}
            onNumberChange={val => formik.setFieldValue('homeNumber', val)}
            numberLabel="HOME NUMBER"
            codeData={countryCodeData}
            style={{ marginTop: 16 }}
          />
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.confirmBtn,
              formik.isSubmitting && styles.disabledBtn,
            ]}
            onPress={formik.handleSubmit}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.confirmText}>SAVE CHANGES</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.cancelBtn}
          >
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// PhoneRow Component (Improved)
const PhoneRow = ({
  codeValue,
  onCodeChange,
  numberValue,
  onNumberChange,
  onNumberBlur,
  numberLabel,
  error,
  codeData,
  style,
}) => (
  <View style={style}>
    <View style={styles.phoneRow}>
      <View style={{ flex: 0.4 }}>
        <CommonDropdown
          label="CODE"
          data={codeData}
          value={codeValue}
          onChange={onCodeChange}
        />
      </View>
      <View style={{ flex: 0.6, marginLeft: 12 }}>
        <CommonTextInput
          label={numberLabel}
          value={numberValue}
          onChangeText={onNumberChange}
          onBlur={onNumberBlur}
          keyboardType="phone-pad"
        />
      </View>
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

export default EditProfileScreen;

// ─── PROFESSIONAL STYLES ─────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7F4' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 60 },

  mainTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },

  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionHeader: {
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: '700',
    color: '#8C6B4B', // Gold-Brown luxury tone
    marginBottom: 20,
  },

  phoneRow: { flexDirection: 'row', alignItems: 'flex-end' },

  readOnlyContainer: { marginTop: 8 },
  readOnlyHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },

  actionContainer: { marginTop: 20, paddingHorizontal: 4 },
  confirmBtn: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  disabledBtn: { opacity: 0.7 },

  cancelBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '500',
  },

  errorText: {
    color: '#E53935',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
