import React, { useMemo } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const ic_calender = require('../res/images/icons/calendar.png');
const ic_down = require('../res/images/icons/downArrow.png');
const T = PremiumTheme;

const pad = value => String(value).padStart(2, '0');

const createDateOptions = () =>
  Array.from({ length: 45 }, (_, index) => {
    const value = new Date();
    value.setHours(12, 0, 0, 0);
    value.setDate(value.getDate() + index);
    return value;
  });

const createTimeOptions = () => {
  const values = [];
  for (let hour = 10; hour <= 23; hour += 1) {
    values.push(`${pad(hour)}:00`);
    if (hour !== 23) values.push(`${pad(hour)}:30`);
  }
  return values;
};

const formatDateLabel = value =>
  value instanceof Date && !Number.isNaN(value.getTime())
    ? value.toDateString().slice(4, 10)
    : 'Select';

const formatTimeLabel = value =>
  value instanceof Date && !Number.isNaN(value.getTime())
    ? value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Select';

const PickerModal = ({
  visible,
  title,
  onClose,
  children,
}) => (
  <Modal
    visible={Boolean(visible)}
    transparent
    animationType="fade"
    statusBarTranslucent
    onRequestClose={onClose}
  >
    <SafeAreaView style={styles.modalRoot}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.backdrop}
        onPress={onClose}
      />
      <View style={styles.modalCard}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Close picker"
            activeOpacity={0.75}
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>
        {children}
      </View>
    </SafeAreaView>
  </Modal>
);

const DateTimeSection = ({
  date,
  time,
  openDatePicker,
  openTimePicker,
  onChangeDate,
  onChangeTime,
  setOpenDatePicker,
  setOpenTimePicker,
}) => {
  const dateOptions = useMemo(createDateOptions, []);
  const timeOptions = useMemo(createTimeOptions, []);

  const selectTime = item => {
    const [hours, minutes] = item.split(':').map(Number);
    const selected = new Date();
    selected.setHours(hours, minutes, 0, 0);
    setOpenTimePicker(false);
    onChangeTime(selected);
  };

  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <View style={styles.boxContainer}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.dateBox}
            activeOpacity={0.84}
            onPress={() => setOpenDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDateLabel(date)}</Text>
            <Image source={ic_calender} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.boxContainer}>
          <Text style={styles.label}>Time</Text>
          <TouchableOpacity
            style={styles.dateBox}
            activeOpacity={0.84}
            onPress={() => setOpenTimePicker(true)}
          >
            <Text style={styles.dateText}>{formatTimeLabel(time)}</Text>
            <Image source={ic_down} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <PickerModal
        visible={openDatePicker}
        title="Select date"
        onClose={() => setOpenDatePicker(false)}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.optionList}
        >
          {dateOptions.map(item => {
            const selected =
              date instanceof Date &&
              item.toDateString() === date.toDateString();
            return (
              <TouchableOpacity
                key={item.toISOString()}
                activeOpacity={0.8}
                onPress={() => {
                  setOpenDatePicker(false);
                  onChangeDate(item);
                }}
                style={[styles.optionRow, selected && styles.optionRowSelected]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {item.toLocaleDateString([], {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </PickerModal>

      <PickerModal
        visible={openTimePicker}
        title="Select time"
        onClose={() => setOpenTimePicker(false)}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.timeGrid}
        >
          {timeOptions.map(item => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.8}
              onPress={() => selectTime(item)}
              style={styles.timeOption}
            >
              <Text style={styles.timeOptionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </PickerModal>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginTop: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  boxContainer: { width: '48%' },
  label: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 11,
    color: T.primary,
    marginBottom: 8,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  dateBox: {
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 20,
    padding: 14,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: T.surface,
  },
  dateText: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 15,
    color: T.ink,
  },
  icon: { width: 16, height: 16, tintColor: T.primary },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 16, 12, 0.48)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '76%',
    borderRadius: 28,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
  },
  modalHeader: {
    minHeight: 68,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.line,
  },
  modalTitle: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 16,
    color: T.ink,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: T.surfaceSoft,
  },
  closeText: { color: T.ink, fontSize: 28, lineHeight: 30 },
  optionList: { padding: 14 },
  optionRow: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.line,
    backgroundColor: T.surfaceSoft,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 9,
  },
  optionRowSelected: {
    backgroundColor: T.primary,
    borderColor: T.primary,
  },
  optionText: {
    fontFamily: Fonts.instrumentSansRegular,
    color: T.ink,
    fontSize: 14,
  },
  optionTextSelected: { color: T.surface },
  timeGrid: {
    padding: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeOption: {
    width: '31.5%',
    minHeight: 48,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.line,
    backgroundColor: T.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeOptionText: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 13,
    color: T.ink,
  },
});

export default DateTimeSection;
