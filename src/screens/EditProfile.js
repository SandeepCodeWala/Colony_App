import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import SettingHeader from '../components/SettingHeader';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import { getApi, postApi, putApiWithBase1 } from '../services/network/api';
import { showToast } from '../services/Toast';
import CommonDatePickerModal from '../components/ui/CommonDatePickerModal';
import { updateUserName } from '../redux/slices/authSlice';

const emptyForm = {
  name: '',
  phone: '',
  membership_number: '',
  total_spent: '0.00',
  loyalty_points: '0',
  anniversary_date: null,
  birthday_date: null,
  title: '',
  gender: '',
  nationality: '',
  workNumber: '',
  homeNumber: '',
  addressLineOne: '',
  addressLinetwo: '',
  addressLinethree: '',
  city: '',
  country: '',
};

const formatViewDate = value => {
  if (!value) return 'Not added';

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Not added';

  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatApiDate = value => {
  if (!value) return null;

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
};

const Field = ({
  label,
  value,
  editable,
  onChangeText,
  placeholder,
  keyboardType,
}) => {
  return (
    <View style={styles.fieldBox}>
      <Text style={styles.label}>{label}</Text>

      {editable ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || label}
          placeholderTextColor="#B8A89B"
          keyboardType={keyboardType || 'default'}
          style={styles.input}
        />
      ) : (
        <Text style={styles.value}>{value || 'Not added'}</Text>
      )}
    </View>
  );
};

const DateField = ({ label, value, editable, onPress }) => {
  return (
    <View style={styles.fieldBox}>
      <Text style={styles.label}>{label}</Text>

      {editable ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={styles.dateButton}
        >
          <Text style={styles.dateText}>{formatViewDate(value)}</Text>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.value}>{formatViewDate(value)}</Text>
      )}
    </View>
  );
};

const EditProfile = () => {
  const navigation = useNavigation();

  const token = useSelector(state => state.auth?.token);

  const [user, setUser] = useState({});
  const [form, setForm] = useState(emptyForm);

  const [isEdit, setIsEdit] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [showAnniversaryPicker, setShowAnniversaryPicker] = useState(false);

  const fillForm = data => {
    setForm({
      name: data?.name || '',
      phone: data?.phone || '',
      membership_number: data?.membership_number || '',
      total_spent: data?.total_spent || '0.00',
      loyalty_points: String(data?.loyalty_points ?? 0),

      anniversary_date: data?.anniversary_date || null,
      birthday_date: data?.birthday_date || null,

      title: data?.title || '',
      gender: data?.gender || '',
      nationality: data?.nationality || '',
      workNumber: data?.workNumber || '',
      homeNumber: data?.homeNumber || '',
      addressLineOne: data?.addressLineOne || '',
      addressLinetwo: data?.addressLinetwo || '',
      addressLinethree: data?.addressLinethree || '',
      city: data?.city || '',
      country: data?.country || '',
    });
  };

  const getProfileData = async () => {
    setPageLoading(true);

    try {
      const res = await getApi('get_profile', token);

      if (res?.success) {
        const profile = res?.data || {};
        setUser(profile);
        fillForm(profile);
      } else {
        setUser({});
        fillForm({});
        showToast('error', res?.message || 'Profile data not found');
      }
    } catch (error) {
      showToast('error', 'Failed to load profile');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getProfileData();
    }
  }, [token]);

  const updateField = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCancel = () => {
    fillForm(user);
    setIsEdit(false);
  };
  const dispatch = useDispatch();

  const handleUpdate = async () => {
    const obj = {
      name: form.name || user?.name,
      phone: form.phone || user?.phone,

      anniversary_date:
        formatApiDate(form.anniversary_date) || user?.anniversary_date,

      birthday_date: formatApiDate(form.birthday_date) || user?.birthday_date,

      title: form.title || user?.title,
      gender: form.gender || user?.gender,
      nationality: form.nationality || user?.nationality,
      workNumber: form.workNumber || user?.workNumber,
      homeNumber: form.homeNumber || user?.homeNumber,
      addressLineOne: form.addressLineOne || user?.addressLineOne,
      addressLinetwo: form.addressLinetwo || user?.addressLinetwo,
      addressLinethree: form.addressLinethree || user?.addressLinethree,
      city: form.city || user?.city,
      country: form.country || user?.country,
    };

    setUpdateLoading(true);

    try {
      const res = await putApiWithBase1('user/edit_profile', obj, token);

      if (res?.success) {
        showToast('success', res?.message || 'Profile updated successfully');
        dispatch(updateUserName(form.name));
        setIsEdit(false);
        getProfileData();
      } else {
        showToast('error', res?.message || 'Profile update failed');
      }
    } catch (error) {
      showToast('error', 'Something went wrong');
    } finally {
      setUpdateLoading(false);
    }
  };

  const birthdayPickerValue = useMemo(() => {
    return form.birthday_date ? new Date(form.birthday_date) : new Date();
  }, [form.birthday_date]);

  const anniversaryPickerValue = useMemo(() => {
    return form.anniversary_date ? new Date(form.anniversary_date) : new Date();
  }, [form.anniversary_date]);

  return (
    <View style={styles.container}>
      <SettingHeader title="Edit Profile" onBack={() => navigation.goBack()} />

      {pageLoading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color={T.tomato || '#B7782E'} />
          <Text style={styles.loaderText}>Loading profile...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.hero}>
            <Text style={styles.kicker}>ACCOUNT DETAILS</Text>

            <Text style={styles.heroTitle}>
              {isEdit ? 'Update Profile' : 'Profile Information'}
            </Text>

            <Text style={styles.heroSub}>
              View your full account information. Tap edit to update allowed
              fields only.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Personal Information</Text>
                <Text style={styles.cardSub}>
                  Name, dates and basic profile details
                </Text>
              </View>

              {!isEdit && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsEdit(true)}
                  style={styles.editBtn}
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>

            <Field
              label="Name"
              value={form.name}
              editable={isEdit}
              onChangeText={v => updateField('name', v)}
            />

            <Field label="Phone" value={form.phone} editable={false} />

            <Field
              label="Membership Number"
              value={form.membership_number}
              editable={false}
            />

            <DateField
              label="Birthday Date"
              value={form.birthday_date}
              editable={isEdit}
              onPress={() => setShowBirthdayPicker(true)}
            />

            <DateField
              label="Anniversary Date"
              value={form.anniversary_date}
              editable={isEdit}
              onPress={() => setShowAnniversaryPicker(true)}
            />

            <Field
              label="Title"
              value={form.title}
              editable={isEdit}
              onChangeText={v => updateField('title', v)}
            />

            <Field
              label="Gender"
              value={form.gender}
              editable={isEdit}
              onChangeText={v => updateField('gender', v)}
            />

            <Field
              label="Nationality"
              value={form.nationality}
              editable={isEdit}
              onChangeText={v => updateField('nationality', v)}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Contact Information</Text>
            <Text style={styles.cardSub}>Work and home contact details</Text>

            <Field
              label="Work Number"
              value={form.workNumber}
              editable={isEdit}
              keyboardType="phone-pad"
              onChangeText={v => updateField('workNumber', v)}
            />

            <Field
              label="Home Number"
              value={form.homeNumber}
              editable={isEdit}
              keyboardType="phone-pad"
              onChangeText={v => updateField('homeNumber', v)}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Address Information</Text>
            <Text style={styles.cardSub}>Your saved address details</Text>

            <Field
              label="Address Line One"
              value={form.addressLineOne}
              editable={isEdit}
              onChangeText={v => updateField('addressLineOne', v)}
            />

            <Field
              label="Address Line Two"
              value={form.addressLinetwo}
              editable={isEdit}
              onChangeText={v => updateField('addressLinetwo', v)}
            />

            <Field
              label="Address Line Three"
              value={form.addressLinethree}
              editable={isEdit}
              onChangeText={v => updateField('addressLinethree', v)}
            />

            <Field
              label="City"
              value={form.city}
              editable={isEdit}
              onChangeText={v => updateField('city', v)}
            />

            <Field
              label="Country"
              value={form.country}
              editable={isEdit}
              onChangeText={v => updateField('country', v)}
            />
          </View>

          {/* <View style={styles.card}>
            <Text style={styles.cardTitle}>Account Summary</Text>
            <Text style={styles.cardSub}>Read-only account values</Text>

            <Field
              label="Total Spent"
              value={`£${form.total_spent || '0.00'}`}
              editable={false}
            />

            <Field
              label="Loyalty Points"
              value={form.loyalty_points}
              editable={false}
            />
          </View> */}

          {isEdit && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCancel}
                style={styles.cancelBtn}
                disabled={updateLoading}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleUpdate}
                style={styles.updateBtn}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.updateText}>Update</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
      )}

      {showBirthdayPicker && (
        // <DateTimePicker
        //   value={birthdayPickerValue}
        //   mode="date"
        //   display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        //   maximumDate={new Date()}
        //   onChange={(event, selectedDate) => {
        //     setShowBirthdayPicker(false);

        //     if (event?.type === 'dismissed') return;

        //     if (selectedDate) {
        //       updateField('birthday_date', selectedDate);
        //     }
        //   }}
        // />
        <CommonDatePickerModal
          visible={showBirthdayPicker}
          title="Birthday Date"
          value={birthdayPickerValue}
          onClose={() => setShowBirthdayPicker(false)}
          onConfirm={date => {
            updateField('birthday_date', date);
            setShowBirthdayPicker(false);
          }}
        />
      )}

      {showAnniversaryPicker && (
        // <DateTimePicker
        //   value={anniversaryPickerValue}
        //   mode="date"
        //   display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        //   maximumDate={new Date()}
        //   onChange={(event, selectedDate) => {
        //     setShowAnniversaryPicker(false);

        //     if (event?.type === 'dismissed') return;

        //     if (selectedDate) {
        //       updateField('anniversary_date', selectedDate);
        //     }
        //   }}
        // />
        <CommonDatePickerModal
          visible={showAnniversaryPicker}
          title="Anniversary Date"
          value={
            form.anniversary_date ? new Date(form.anniversary_date) : new Date()
          }
          maximumDate={new Date()}
          onClose={() => setShowAnniversaryPicker(false)}
          onConfirm={date => updateField('anniversary_date', date)}
        />
      )}
    </View>
  );
};

export default EditProfile;

const T = PremiumTheme;
const fontMed = Fonts.instrumentSansMedium;
const fontReg = Fonts.instrumentSansRegular;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.cream || '#FFF8F2',
  },

  loaderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderText: {
    marginTop: 12,
    fontFamily: fontReg,
    fontSize: 14,
    color: T.muted || '#7B6B60',
  },

  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  hero: {
    paddingTop: 18,
    paddingBottom: 20,
  },

  kicker: {
    fontFamily: fontMed,
    fontSize: 11,
    letterSpacing: 2.8,
    color: T.tomato || '#B7782E',
    textTransform: 'uppercase',
  },

  heroTitle: {
    fontFamily: fontMed,
    fontSize: 32,
    lineHeight: 38,
    color: T.ink || '#201A17',
    textTransform: 'uppercase',
    marginTop: 8,
  },

  heroSub: {
    fontFamily: fontReg,
    fontSize: 14,
    lineHeight: 22,
    color: T.muted || '#7B6B60',
    marginTop: 8,
  },

  card: {
    backgroundColor: T.surface || '#FFFFFF',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: T.border || '#F1DFCD',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#7E3F18',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  cardTitle: {
    fontFamily: fontMed,
    fontSize: 18,
    color: T.ink || '#201A17',
  },

  cardSub: {
    fontFamily: fontReg,
    fontSize: 12,
    lineHeight: 18,
    color: T.muted || '#7B6B60',
    marginTop: 4,
    marginBottom: 12,
  },

  editBtn: {
    backgroundColor: T.gold || '#B7782E',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 18,
  },

  editText: {
    fontFamily: fontMed,
    fontSize: 13,
    color: T.ink || '#201A17',
  },

  fieldBox: {
    marginTop: 13,
  },

  label: {
    fontFamily: fontMed,
    fontSize: 11,
    color: T.tomato || '#B7782E',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 7,
  },

  value: {
    fontFamily: fontReg,
    fontSize: 15,
    color: T.ink || '#201A17',
    backgroundColor: '#FFF8F1',
    borderWidth: 1,
    borderColor: '#F0DECD',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  input: {
    fontFamily: fontReg,
    fontSize: 15,
    color: T.ink || '#201A17',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: T.gold || '#B7782E',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },

  dateButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: T.gold || '#B7782E',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dateText: {
    fontFamily: fontReg,
    fontSize: 15,
    color: T.ink || '#201A17',
  },

  calendarIcon: {
    fontSize: 18,
  },

  actionRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9CDB8',
    borderRadius: 22,
    paddingVertical: 15,
    alignItems: 'center',
    marginRight: 10,
  },

  cancelText: {
    fontFamily: fontMed,
    fontSize: 15,
    color: T.ink || '#201A17',
  },

  updateBtn: {
    flex: 1,
    backgroundColor: PremiumTheme.primary || '#B7782E',
    borderRadius: 22,
    paddingVertical: 15,
    alignItems: 'center',
    marginLeft: 10,
  },

  updateText: {
    fontFamily: fontMed,
    fontSize: 15,
    color: '#FFFFFF',
  },
});
