// components/TimeSlotList.js
import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../res';

const TimeSlotList = ({ timeSlots, selectedSlot, onSelect }) => {
  return (
    <FlatList
      data={timeSlots}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      keyExtractor={item => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onSelect(item)}
          style={[
            styles.slotBox,
            selectedSlot === item && { backgroundColor: Colors.Muted_Gold },
          ]}
        >
          <Text
            style={[
              styles.slotText,
              selectedSlot === item && { color: Colors.WHITE },
            ]}
          >
            {item}
          </Text>
          <Text
            style={[
              styles.slotSubText,
              selectedSlot === item && { color: Colors.WHITE },
            ]}
          >
            Drinks and light bites
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  slotBox: {
    borderWidth: 1,
    borderColor: Colors.BORDERGREY,
    borderRadius: 10,
    width: '48%',
    paddingVertical: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  slotText: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 16,
    color: Colors.BLACK,
  },
  slotSubText: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 12,
    color: Colors.DARK_GREY,
  },
});

export default TimeSlotList;
