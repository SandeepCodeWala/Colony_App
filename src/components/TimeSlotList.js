import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const TimeSlotList = ({ timeSlots, selectedSlot, onSelect }) => {
  return (
    <FlatList
      data={timeSlots}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      keyExtractor={item => item}
      renderItem={({ item }) => {
        const selected = selectedSlot === item;
        return (
          <TouchableOpacity onPress={() => onSelect(item)} activeOpacity={0.86} style={[styles.slotBox, selected && styles.slotBoxSelected]}>
            <Text style={[styles.slotText, selected && styles.slotTextSelected]}>{item}</Text>
            <Text style={[styles.slotSubText, selected && styles.slotSubTextSelected]}>Drinks and light bites</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const T = PremiumTheme;
const styles = StyleSheet.create({
  slotBox: {
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 22,
    width: '48%',
    paddingVertical: 14,
    marginVertical: 8,
    alignItems: 'center',
    backgroundColor: T.surface,
    shadowColor: T.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  slotBoxSelected: {
    backgroundColor: T.primary,
    borderColor: T.primary,
    shadowColor: T.primary,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  slotText: { fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium, fontSize: 16, color: T.ink },
  slotTextSelected: { color: T.surface },
  slotSubText: { fontFamily: Fonts.instrumentSansRegular, fontSize: 11, color: T.muted, marginTop: 3 },
  slotSubTextSelected: { color: 'rgba(255,255,255,0.82)' },
});

export default TimeSlotList;
