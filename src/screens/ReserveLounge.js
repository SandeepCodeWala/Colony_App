
 
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts, AppImages } from '../res';
import { Dropdown } from 'react-native-element-dropdown';
import Button from '../components/Button';
 
const ReserveLoungeScreen1 = () => {
  const navigation = useNavigation();
 
  const [guests, setGuests] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
 
  const guestOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));
 
  // Generate time slots dynamically
  const generateTimeSlots = (start = '17:00', end = '22:00', interval = 30) => {
    const slots = [];
    let current = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
 
    while (current <= endTime) {
      const hours = String(current.getHours()).padStart(2, '0');
      const minutes = String(current.getMinutes()).padStart(2, '0');
      slots.push(`${hours}:${minutes}`);
      current.setMinutes(current.getMinutes() + interval);
    }
    return slots;
  };
 
  const timeSlots = generateTimeSlots();
 
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };
 
  return (
    <View style={styles.container}>
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={AppImages.Back} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reserve Lounge</Text>
      </View>
 
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ---------- Lounge Image ---------- */}
        <Image source={AppImages.lounge} style={styles.image} />
 
        {/* ---------- Details ---------- */}
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Guests</Text>
          <Dropdown
            data={guestOptions}
            labelField="label"
            valueField="value"
            placeholder="Select (1 - 10)"
            value={guests}
            onChange={item => setGuests(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.dropdownText}
            selectedTextStyle={styles.dropdownText}
          />
 
          {/* ---------- Date Picker ---------- */}
          <TouchableOpacity style={styles.dateBox} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{date.toDateString().slice(4, 10)}</Text>
            <Text style={styles.subLabel}>Date</Text>
          </TouchableOpacity>
 
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
 
          {/* ---------- Time Slots ---------- */}
          <Text style={[styles.label, { marginTop: 20 }]}>Select Time</Text>
          <FlatList
            data={timeSlots}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedSlot(item)}
                style={[
                  styles.slotBox,
                  selectedSlot === item && { backgroundColor: Colors.Muted_Gold },
                ]}
              >
                <Text style={[styles.slotText, selectedSlot === item && { color: Colors.WHITE }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
 
          {/* ---------- Confirm Button ---------- */}
          <Button
            title="Confirm Reservation"
            style={styles.confirmButton}
            textStyle={styles.confirmText}
            onPress={() => {
              navigation.navigate('Confirmation', {
                date,
                guests,
                slot: selectedSlot,
                type: 'lounge',
              });
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};
 
export default ReserveLoungeScreen1;
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 45,
  },
  backButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: Colors.BLACK,
  },
  headerTitle: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 20,
    color: Colors.BLACK,
    marginLeft: 10,
  },
  image: {
    width: '92%',
    height: 200,
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 15,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 16,
    color: Colors.BLACK,
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.BORDERGREY,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
  },
  dropdownText: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 14,
    color: Colors.BLACK,
  },
  dateBox: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.BORDERGREY,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  dateText: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 16,
    color: Colors.BLACK,
  },
  subLabel: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 12,
    color: Colors.DARK_GREY,
  },
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
  confirmButton: {
    backgroundColor: Colors.Muted_Gold,
    marginTop: 25,
    borderRadius: 30,
    paddingVertical: 12,
  },
  confirmText: {
    fontFamily: Fonts.instrumentSansMedium,
    color: Colors.WHITE,
    fontSize: 15,
  },
});
 
 