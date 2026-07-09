import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const ic_calender = require('../res/images/icons/calendar.png');
const ic_down = require('../res/images/icons/downArrow.png');

const DateTimeSection = ({ date, time, openDatePicker, openTimePicker, onChangeDate, onChangeTime, setOpenDatePicker, setOpenTimePicker }) => {
  return (
    <View style={{ marginTop: 20 }}>
      <View style={styles.row}>
        <View style={styles.boxContainer}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity style={styles.dateBox} activeOpacity={0.84} onPress={() => setOpenDatePicker(true)}>
            <Text style={styles.dateText}>{date.toDateString().slice(4, 10)}</Text>
            <Image source={ic_calender} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.boxContainer}>
          <Text style={styles.label}>Time</Text>
          <TouchableOpacity style={styles.dateBox} activeOpacity={0.84} onPress={() => setOpenTimePicker(true)}>
            <Text style={styles.dateText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            <Image source={ic_down} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <DatePicker modal open={openDatePicker} date={date} mode="date" theme="light" onConfirm={selectedDate => { setOpenDatePicker(false); onChangeDate(selectedDate); }} onCancel={() => setOpenDatePicker(false)} />
      <DatePicker modal open={openTimePicker} date={time} mode="time" theme="light" onConfirm={selectedTime => { setOpenTimePicker(false); onChangeTime(selectedTime); }} onCancel={() => setOpenTimePicker(false)} />
    </View>
  );
};

const T = PremiumTheme;
const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  boxContainer: { width: '48%' },
  label: { fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium, fontSize: 11, color: T.primary, marginBottom: 8, letterSpacing: 1.6, textTransform: 'uppercase' },
  dateBox: { borderWidth: 1, borderColor: T.border, borderRadius: 20, padding: 14, minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: T.surface },
  dateText: { fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium, fontSize: 15, color: T.ink },
  icon: { width: 16, height: 16, tintColor: T.primary },
});

export default DateTimeSection;
