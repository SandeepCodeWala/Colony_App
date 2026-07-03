import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import PremiumTheme from '../../res/PremiumTheme';
import { Fonts } from '../../res';

const CommonDatePickerModal = ({
  visible,
  title = 'Select Date',
  value,
  maximumDate,
  minimumDate,
  onClose,
  onConfirm,
}) => {
  const [date, setDate] = useState(value || new Date());

  useEffect(() => {
    setDate(value || new Date());
  }, [value, visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* <Text style={styles.kicker}>SELECT DATE</Text> */}

          <Text style={styles.title}>{title}</Text>

          <DatePicker
            date={date}
            mode="date"
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            onDateChange={setDate}
            androidVariant="nativeAndroid"
            fadeToColor="none"
            textColor={PremiumTheme.ink}
          />

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmBtn}
              activeOpacity={0.8}
              onPress={() => {
                onConfirm(date);
                onClose();
              }}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CommonDatePickerModal;

const T = PremiumTheme;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  card: {
    width: '100%',
    borderRadius: 28,
    backgroundColor: '#FFF',
    padding: 20,
    borderWidth: 1,
    borderColor: '#F2E4D7',
  },

  kicker: {
    fontFamily: Fonts.instrumentSansMedium,
    color: T.tomato,
    fontSize: 11,
    letterSpacing: 2,
    textAlign: 'center',
  },

  title: {
    marginTop: 8,
    marginBottom: 15,
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 25,
    color: T.ink,
    textAlign: 'center',
  },

  buttons: {
    flexDirection: 'row',
    marginTop: 20,
  },

  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E7D3C1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  confirmBtn: {
    flex: 1,
    height: 50,
    borderRadius: 18,
    backgroundColor: T.tomato,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  cancelText: {
    fontFamily: Fonts.instrumentSansMedium,
    color: T.ink,
    fontSize: 15,
  },

  confirmText: {
    fontFamily: Fonts.instrumentSansMedium,
    color: '#FFF',
    fontSize: 15,
  },
});
