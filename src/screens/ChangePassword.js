import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import CommonInput from '../components/ui/CommonInput';
import Button from '../components/Button';
import SettingHeader from '../components/SettingHeader';
import { putApiWithBase1 } from '../services/network/api';
import { showToast } from '../services/Toast';
import PremiumTheme from '../res/PremiumTheme';

const calcStrength = pw => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];

const RULES = [
  { id: 'len', label: 'At least 8 characters', test: pw => pw.length >= 8 },
  { id: 'up', label: 'One uppercase letter', test: pw => /[A-Z]/.test(pw) },
  { id: 'num', label: 'One number', test: pw => /[0-9]/.test(pw) },
  {
    id: 'sp',
    label: 'One special character',
    test: pw => /[^A-Za-z0-9]/.test(pw),
  },
];

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token);

  const [fields, setFields] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [errors, setErrors] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [touched, setTouched] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  const strength = calcStrength(fields.new);

  // ─── Derived hint for new password field ──────────────────
  const strengthHint = fields.new
    ? STRENGTH_LABELS[strength] || 'Weak'
    : 'Min 8 chars';

  const strengthHintColor =
    strength >= 3
      ? '#5A9068'
      : strength === 2
      ? '#BA8C30'
      : strength === 1
      ? '#C06A50'
      : '#C0B8A8';

  // ─── Helpers ──────────────────────────────────────────────
  const toggleEye = key => setShowPw(p => ({ ...p, [key]: !p[key] }));

  const markTouched = key => setTouched(p => ({ ...p, [key]: true }));

  const onChange = (key, val) => {
    setFields(p => ({ ...p, [key]: val }));

    // Clear this field's error as the user types
    if (errors[key]) {
      setErrors(p => ({ ...p, [key]: '' }));
    }

    // Live mismatch check on confirm field
    if (key === 'confirm' || key === 'new') {
      const newVal = key === 'new' ? val : fields.new;
      const conVal = key === 'confirm' ? val : fields.confirm;
      if (touched.confirm && conVal) {
        setErrors(p => ({
          ...p,
          confirm: conVal !== newVal ? "Passwords don't match" : '',
        }));
      }
    }
  };

  // ─── Full validation (on submit) ──────────────────────────
  const validate = () => {
    const e = { current: '', new: '', confirm: '' };

    if (!fields.current.trim()) {
      e.current = 'Current password is required';
    }

    if (!fields.new) {
      e.new = 'New password is required';
    } else if (strength < 2) {
      e.new = 'Password is too weak';
    } else if (fields.new === fields.current) {
      e.new = 'New password must differ from current';
    }

    if (!fields.confirm) {
      e.confirm = 'Please confirm your password';
    } else if (fields.new !== fields.confirm) {
      e.confirm = "Passwords don't match";
    }

    setErrors(e);
    return !e.current && !e.new && !e.confirm;
  };

  // ─── Submit ───────────────────────────────────────────────
  const handleSubmit = async () => {
    setTouched({ current: true, new: true, confirm: true });
    if (!validate()) return;

    setLoading(true);
    try {
      console.log(
        {
          current_password: fields.current,
          new_password: fields.new,
          confirm_password: fields.confirm,
        },
        'news',
      );

      const response = await putApiWithBase1(
        'user/change_password',
        {
          current_password: fields.current,
          new_password: fields.new,
          confirm_password: fields.confirm,
        },
        token,
      );
      if (response?.success) {
        showToast('success', 'Password updated.');
        navigation.goBack();
      } else {
        const msg = response?.data?.message || 'Something went wrong.';
        // Surface server error inline on current field if it's about wrong password
        if (
          msg.toLowerCase().includes('current') ||
          msg.toLowerCase().includes('incorrect') ||
          msg.toLowerCase().includes('wrong')
        ) {
          setErrors(p => ({ ...p, current: 'Incorrect current password' }));
        } else {
          showToast('error', msg);
        }
      }
    } catch {
      showToast('error', 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Per-field success messages ───────────────────────────
  const currentSuccess =
    touched.current && fields.current && !errors.current ? 'Looks good' : '';

  const newSuccess =
    touched.new && strength >= 3 && !errors.new ? 'Strong password' : '';

  const confirmSuccess =
    touched.confirm &&
    fields.confirm &&
    fields.confirm === fields.new &&
    !errors.confirm
      ? 'Passwords match'
      : '';

  // ─────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <SettingHeader
        title="CHANGE PASSWORD"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero */}
        <View style={styles.hero}>
          {/* <Text style={styles.eyebrow}>Account Settings</Text> */}
          <Text style={styles.heroTitle}>
            Update your{'\n'}
            <Text style={styles.heroItalic}>password</Text>
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.divLine} />
          <View style={styles.divDot} />
          <View style={styles.divLine} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Current Password */}
          <CommonInput
            label="Current Password"
            value={fields.current}
            onChangeText={v => onChange('current', v)}
            onBlur={() => markTouched('current')}
            secureTextEntry={!showPw.current}
            placeholder="Enter current password"
            rightIcon={
              showPw.current
                ? require('../res/images/icons/openeye.png')
                : require('../res/images/icons/openeye.png')
            }
            onRightIconPress={() => toggleEye('current')}
            errorMsg={errors.current}
            successMsg={currentSuccess}
          />

          {/* New Password */}
          <CommonInput
            label="New Password"
            hint={strengthHint}
            hintColor={strengthHintColor}
            value={fields.new}
            onChangeText={v => onChange('new', v)}
            onBlur={() => markTouched('new')}
            secureTextEntry={!showPw.new}
            placeholder="Create new password"
            rightIcon={
              showPw.new
                ? require('../res/images/icons/openeye.png')
                : require('../res/images/icons/openeye.png')
            }
            onRightIconPress={() => toggleEye('new')}
            errorMsg={errors.new}
            successMsg={newSuccess}
            strengthBars={fields.new ? strength : undefined}
          />

          {/* Password rules — visible while typing */}
          {fields.new.length > 0 && (
            <View style={styles.rulesBox}>
              {RULES.map(r => {
                const pass = r.test(fields.new);
                return (
                  <View key={r.id} style={styles.ruleRow}>
                    <Text style={[styles.ruleDot, pass && styles.ruleDotPass]}>
                      {pass ? '✓' : '○'}
                    </Text>
                    <Text
                      style={[styles.ruleText, pass && styles.ruleTextPass]}
                    >
                      {r.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Confirm Password */}
          <CommonInput
            label="Confirm Password"
            value={fields.confirm}
            onChangeText={v => onChange('confirm', v)}
            onBlur={() => markTouched('confirm')}
            secureTextEntry={!showPw.confirm}
            placeholder="Re-enter new password"
            rightIcon={
              showPw.confirm
                ? require('../res/images/icons/openeye.png')
                : require('../res/images/icons/openeye.png')
            }
            onRightIconPress={() => toggleEye('confirm')}
            errorMsg={errors.confirm}
            successMsg={confirmSuccess}
          />
        </View>

        {/* CTA */}
        <View style={styles.ctaArea}>
          <Button
            title={loading ? 'Updating…' : 'Update Password'}
            style={[styles.btn, loading && styles.btnLoading]}
            textStyle={styles.btnText}
            onPress={handleSubmit}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PremiumTheme.paper,
  },
  scrollContent: {
    paddingBottom: 52,
  },

  // Hero
  hero: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 18,
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 3,
    color: PremiumTheme.tomato,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  heroTitle: {
    fontFamily: 'serif',
    fontSize: 30,
    color: PremiumTheme.ink,
    lineHeight: 38,
    fontWeight: '400',
    textAlign: 'center',
  },
  heroItalic: {
    fontStyle: 'italic',
    color: PremiumTheme.goldDark,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 26,
  },
  divLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: PremiumTheme.border,
  },
  divDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: PremiumTheme.gold,
    marginHorizontal: 12,
  },

  // Form
  form: {
    paddingHorizontal: 20,
    gap: 14,
  },

  // Password rules
  rulesBox: {
    backgroundColor: PremiumTheme.surface,
    borderRadius: 18,
    padding: 12,
    gap: 6,
    marginTop: -4,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleDot: {
    fontSize: 12,
    color: '#C0B8A8',
    width: 14,
    textAlign: 'center',
  },
  ruleDotPass: {
    color: '#5A9068',
  },
  ruleText: {
    fontSize: 12,
    color: '#A89880',
  },
  ruleTextPass: {
    color: '#5A9068',
  },

  // CTA
  ctaArea: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  btn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: PremiumTheme.primary || '#B7782E',
    borderWidth: 0,
  },
  btnLoading: {
    backgroundColor: '#8A8070',
  },
  btnText: {
    color: PremiumTheme.surface,
    fontSize: 11,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
});
