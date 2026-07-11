import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SettingHeader from '../components/SettingHeader';
import ProfileAvatar from '../components/ProfileAvatar';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import {
  getApi,
  putApiWithBase1,
  putMultipartApiWithBase1,
} from '../services/network/api';
import { showToast } from '../services/Toast';
import CommonDatePickerModal from '../components/ui/CommonDatePickerModal';
import { updateUserProfile } from '../redux/slices/authSlice';

const T = PremiumTheme;
const fontMed = Fonts.instrumentSansMedium;
const fontReg = Fonts.instrumentSansRegular;

const emptyForm = {
  name: '',
  phone: '',
  membership_number: '',
  profilePicture: null,
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
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not added';

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatApiDate = value => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const Field = ({
  label,
  value,
  editable,
  onChangeText,
  placeholder,
  keyboardType,
}) => (
  <View style={styles.fieldBox}>
    <Text style={styles.label}>{label}</Text>
    {editable ? (
      <TextInput
        value={String(value || '')}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor={T.softMuted}
        keyboardType={keyboardType || 'default'}
        style={styles.input}
      />
    ) : (
      <Text style={styles.value}>{value || 'Not added'}</Text>
    )}
  </View>
);

const DateField = ({ label, value, editable, onPress }) => (
  <View style={styles.fieldBox}>
    <Text style={styles.label}>{label}</Text>
    {editable ? (
      <TouchableOpacity
        activeOpacity={0.78}
        onPress={onPress}
        style={styles.dateButton}
      >
        <Text style={styles.dateText}>{formatViewDate(value)}</Text>
        <Ionicons name="calendar-clear-outline" size={19} color={T.primary} />
      </TouchableOpacity>
    ) : (
      <Text style={styles.value}>{formatViewDate(value)}</Text>
    )}
  </View>
);

const appendIfPresent = (formData, key, value) => {
  if (value !== undefined && value !== null && String(value).trim() !== '') {
    formData.append(key, String(value));
  }
};

export default function EditProfile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth?.token);
  const reduxUser = useSelector(state => state.auth?.user);
  const { width } = useWindowDimensions();

  const [user, setUser] = useState(reduxUser || {});
  const [form, setForm] = useState(emptyForm);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [showAnniversaryPicker, setShowAnniversaryPicker] = useState(false);

  const contentWidth = Math.min(width - 36, 680);

  const fillForm = data => {
    setForm({
      name: data?.name || '',
      phone: data?.phone || '',
      membership_number: data?.membership_number || '',
      profilePicture: data?.profilePicture || data?.profile_picture || null,
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

  const persistProfile = async profile => {
    dispatch(updateUserProfile(profile));
    await AsyncStorage.multiSet([
      ['user', JSON.stringify(profile || {})],
      ['name', String(profile?.name || '')],
      ['phone', String(profile?.phone || '')],
      ['membershipNumber', String(profile?.membership_number || '')],
    ]);
  };

  const getProfileData = async () => {
    if (!token) return;
    setPageLoading(true);

    try {
      const response = await getApi('get_profile', token);
      if (!response?.success) {
        showToast('error', response?.message || 'Profile data not found');
        return;
      }

      const profile = response?.data || {};
      setUser(profile);
      fillForm(profile);
      setSelectedImage(null);
      await persistProfile(profile);
    } catch (error) {
      showToast('error', 'Failed to load profile');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getProfileData();
  }, [token]);

  const updateField = (key, value) => {
    setForm(previous => ({ ...previous, [key]: value }));
  };

  const chooseProfilePicture = async () => {
    if (!isEdit) return;

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.82,
        maxWidth: 1400,
        maxHeight: 1400,
        includeBase64: false,
      });

      if (result?.didCancel) return;
      if (result?.errorCode) {
        showToast('error', result?.errorMessage || 'Unable to open gallery');
        return;
      }

      const asset = result?.assets?.[0];
      if (!asset?.uri) return;

      const nextImage = {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        fileName: asset.fileName || `profile-${Date.now()}.jpg`,
      };

      setSelectedImage(nextImage);
      updateField('profilePicture', nextImage);
    } catch (error) {
      showToast('error', 'Unable to select profile picture');
    }
  };

  const handleCancel = () => {
    fillForm(user);
    setSelectedImage(null);
    setIsEdit(false);
  };

  const handleUpdate = async () => {
    if (!form.name.trim()) {
      showToast('error', 'Please enter your name');
      return;
    }

    const payload = {
      name: form.name.trim(),
      phone: form.phone || user?.phone,
      anniversary_date: formatApiDate(form.anniversary_date),
      birthday_date: formatApiDate(form.birthday_date),
      title: form.title,
      gender: form.gender,
      nationality: form.nationality,
      workNumber: form.workNumber,
      homeNumber: form.homeNumber,
      addressLineOne: form.addressLineOne,
      addressLinetwo: form.addressLinetwo,
      addressLinethree: form.addressLinethree,
      city: form.city,
      country: form.country,
    };

    setUpdateLoading(true);
    try {
      let response;

      if (selectedImage?.uri) {
        const body = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          appendIfPresent(body, key, value);
        });
        body.append('profilePicture', {
          uri: selectedImage.uri,
          type: selectedImage.type || 'image/jpeg',
          name: selectedImage.fileName || `profile-${Date.now()}.jpg`,
        });

        response = await putMultipartApiWithBase1(
          'user/edit_profile',
          body,
          token,
        );
      } else {
        response = await putApiWithBase1(
          'user/edit_profile',
          payload,
          token,
        );
      }

      if (!response?.success) {
        showToast('error', response?.message || 'Profile update failed');
        return;
      }

      const returnedProfile = response?.data || {};
      const optimisticProfile = {
        ...user,
        ...payload,
        ...returnedProfile,
        profilePicture:
          returnedProfile?.profilePicture ||
          returnedProfile?.profile_picture ||
          user?.profilePicture ||
          user?.profile_picture ||
          null,
      };

      await persistProfile(optimisticProfile);
      setUser(optimisticProfile);
      showToast('success', response?.message || 'Profile updated successfully');
      setIsEdit(false);
      setSelectedImage(null);
      await getProfileData();
    } catch (error) {
      showToast('error', 'Something went wrong');
    } finally {
      setUpdateLoading(false);
    }
  };

  const birthdayPickerValue = useMemo(
    () => (form.birthday_date ? new Date(form.birthday_date) : new Date()),
    [form.birthday_date],
  );

  const anniversaryPickerValue = useMemo(
    () => (form.anniversary_date ? new Date(form.anniversary_date) : new Date()),
    [form.anniversary_date],
  );

  return (
    <View style={styles.container}>
      <SettingHeader title="Edit Profile" onBack={() => navigation.goBack()} />

      {pageLoading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color={T.primary} />
          <Text style={styles.loaderText}>Loading profile...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          <View style={[styles.contentShell, { width: contentWidth }]}>
            <View style={styles.hero}>
              <Text style={styles.kicker}>ACCOUNT DETAILS</Text>
              <Text style={styles.heroTitle}>
                {isEdit ? 'Update profile' : 'Your profile'}
              </Text>
              <Text style={styles.heroSub}>
                Keep your personal details and profile picture up to date.
              </Text>
            </View>

            <View style={styles.profileCard}>
              <TouchableOpacity
                activeOpacity={isEdit ? 0.78 : 1}
                onPress={chooseProfilePicture}
                disabled={!isEdit}
                style={styles.avatarButton}
              >
                <ProfileAvatar
                  name={form.name}
                  profilePicture={selectedImage || form.profilePicture}
                  size={104}
                  showEditBadge={isEdit}
                />
              </TouchableOpacity>

              <View style={styles.profileCopy}>
                <Text style={styles.profileName}>{form.name || 'Member'}</Text>
                <Text style={styles.profileMembership}>
                  Membership {form.membership_number || 'N/A'}
                </Text>
                {isEdit ? (
                  <TouchableOpacity
                    activeOpacity={0.72}
                    onPress={chooseProfilePicture}
                    style={styles.photoButton}
                  >
                    <Ionicons name="image-outline" size={17} color={T.primaryDark} />
                    <Text style={styles.photoButtonText}>Select profile picture</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {!isEdit ? (
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={() => setIsEdit(true)}
                  style={styles.editBtn}
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal information</Text>
              <Text style={styles.cardSub}>Name, dates and basic profile details</Text>

              <Field
                label="Name"
                value={form.name}
                editable={isEdit}
                onChangeText={value => updateField('name', value)}
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
                onChangeText={value => updateField('title', value)}
              />
              <Field
                label="Gender"
                value={form.gender}
                editable={isEdit}
                onChangeText={value => updateField('gender', value)}
              />
              <Field
                label="Nationality"
                value={form.nationality}
                editable={isEdit}
                onChangeText={value => updateField('nationality', value)}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Contact information</Text>
              <Text style={styles.cardSub}>Work and home contact details</Text>
              <Field
                label="Work Number"
                value={form.workNumber}
                editable={isEdit}
                keyboardType="phone-pad"
                onChangeText={value => updateField('workNumber', value)}
              />
              <Field
                label="Home Number"
                value={form.homeNumber}
                editable={isEdit}
                keyboardType="phone-pad"
                onChangeText={value => updateField('homeNumber', value)}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Address information</Text>
              <Text style={styles.cardSub}>Your saved address details</Text>
              <Field
                label="Address Line One"
                value={form.addressLineOne}
                editable={isEdit}
                onChangeText={value => updateField('addressLineOne', value)}
              />
              <Field
                label="Address Line Two"
                value={form.addressLinetwo}
                editable={isEdit}
                onChangeText={value => updateField('addressLinetwo', value)}
              />
              <Field
                label="Address Line Three"
                value={form.addressLinethree}
                editable={isEdit}
                onChangeText={value => updateField('addressLinethree', value)}
              />
              <Field
                label="City"
                value={form.city}
                editable={isEdit}
                onChangeText={value => updateField('city', value)}
              />
              <Field
                label="Country"
                value={form.country}
                editable={isEdit}
                onChangeText={value => updateField('country', value)}
              />
            </View>

            {isEdit ? (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={handleCancel}
                  style={styles.cancelBtn}
                  disabled={updateLoading}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={handleUpdate}
                  style={styles.updateBtn}
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <ActivityIndicator size="small" color={T.surface} />
                  ) : (
                    <Text style={styles.updateText}>Update profile</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </ScrollView>
      )}

      <CommonDatePickerModal
        visible={showBirthdayPicker}
        title="Birthday Date"
        value={birthdayPickerValue}
        maximumDate={new Date()}
        onClose={() => setShowBirthdayPicker(false)}
        onConfirm={date => {
          updateField('birthday_date', date);
          setShowBirthdayPicker(false);
        }}
      />

      <CommonDatePickerModal
        visible={showAnniversaryPicker}
        title="Anniversary Date"
        value={anniversaryPickerValue}
        maximumDate={new Date()}
        onClose={() => setShowAnniversaryPicker(false)}
        onConfirm={date => {
          updateField('anniversary_date', date);
          setShowAnniversaryPicker(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.paper },
  loaderBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: {
    marginTop: 12,
    fontFamily: fontReg,
    fontSize: 14,
    color: T.muted,
  },
  scroll: { alignItems: 'center', paddingHorizontal: 18, paddingBottom: 42 },
  contentShell: { maxWidth: 680 },
  hero: { paddingTop: 20, paddingBottom: 20 },
  kicker: {
    fontFamily: Fonts.luxurySansMedium,
    fontSize: 10,
    letterSpacing: 2.6,
    color: T.primary,
  },
  heroTitle: {
    fontFamily: Fonts.displaySerif,
    fontSize: 38,
    lineHeight: 46,
    color: T.ink,
    marginTop: 8,
  },
  heroSub: {
    fontFamily: Fonts.luxurySansLight,
    fontSize: 14,
    lineHeight: 22,
    color: T.muted,
    marginTop: 7,
  },
  profileCard: {
    minHeight: 144,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 16,
  },
  avatarButton: { marginRight: 16 },
  profileCopy: { flex: 1 },
  profileName: {
    color: T.ink,
    fontFamily: Fonts.displaySerif,
    fontSize: 25,
    lineHeight: 31,
  },
  profileMembership: {
    color: T.muted,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 12,
    marginTop: 3,
  },
  photoButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 5,
  },
  photoButtonText: {
    color: T.primaryDark,
    fontFamily: Fonts.luxurySans,
    fontSize: 12,
    marginLeft: 7,
  },
  editBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: T.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  editText: {
    color: T.primaryDark,
    fontFamily: Fonts.luxurySansMedium,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    padding: 17,
    marginBottom: 16,
    shadowColor: T.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
  },
  cardTitle: {
    fontFamily: Fonts.displaySerif,
    fontSize: 24,
    color: T.ink,
  },
  cardSub: {
    fontFamily: Fonts.luxurySansLight,
    fontSize: 12,
    lineHeight: 18,
    color: T.muted,
    marginTop: 4,
    marginBottom: 8,
  },
  fieldBox: { marginTop: 14 },
  label: {
    fontFamily: Fonts.luxurySansMedium,
    fontSize: 10,
    color: T.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  value: {
    minHeight: 50,
    fontFamily: fontReg,
    fontSize: 14,
    color: T.ink,
    backgroundColor: T.surfaceSoft,
    borderWidth: 1,
    borderColor: T.line,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  input: {
    minHeight: 50,
    fontFamily: fontReg,
    fontSize: 14,
    color: T.ink,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateButton: {
    minHeight: 50,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: { fontFamily: fontReg, fontSize: 14, color: T.ink },
  actionRow: { flexDirection: 'row', marginBottom: 12 },
  cancelBtn: {
    flex: 0.42,
    minHeight: 56,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cancelText: { fontFamily: fontMed, fontSize: 13, color: T.ink },
  updateBtn: {
    flex: 0.58,
    minHeight: 56,
    backgroundColor: T.primary,
    borderWidth: 1,
    borderColor: T.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  updateText: {
    fontFamily: Fonts.luxurySansMedium,
    fontSize: 12,
    color: T.surface,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
});
