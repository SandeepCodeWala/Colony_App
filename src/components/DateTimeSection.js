// components/DateTimeSection.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Fonts } from '../res';
const ic_calender = require('../res/images/icons/calendar.png');
const ic_down = require('../res/images/icons/downArrow.png');

const DateTimeSection = ({
  date,
  time,
  showDatePicker,
  showTimePicker,
  onPressDate,
  onPressTime,
  onChangeDate,
  onChangeTime,
}) => {
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.boxContainer}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity style={styles.dateBox} onPress={onPressDate}>
            <Text style={styles.dateText}>{date.toDateString().slice(4, 10)}</Text>
            <Image source={ic_calender} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.boxContainer}>
          <Text style={styles.label}>Time</Text>
          <TouchableOpacity style={styles.dateBox} onPress={onPressTime}>
            <Text style={styles.dateText}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Image source={ic_down} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
      )}

      {showTimePicker && (
        <DateTimePicker value={time} mode="time" display="default" onChange={onChangeTime} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  boxContainer: { width: '48%' },
  label: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 16,
    color: Colors.BLACK,
    marginBottom: 8,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: Colors.BORDERGREY,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 16,
    color: Colors.BLACK,
  },
  icon: { width: 15, height: 15, tintColor: '#6D6D6D' },
});

export default DateTimeSection;
