import React, {useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {Colors, Fonts, AppImages} from '../res';
import {Dropdown} from 'react-native-element-dropdown';
import Button from '../components/Button';
import PopupDropdown from '../components/PopupDropdown';

const ReservationScreen = () => {
  const navigation = useNavigation();

  const [guests, setGuests] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showGuestPopup, setShowGuestPopup] = useState(false);

 const guestOptions = ['1', '2', '3', '4', '5', '6','7','8','9','10+'];
  const generateTimeSlots = (start = '17:00', end = '23:30', interval = 30) => {
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

  // ---------- Generate "Other dates with availability" ----------
  const getNextDates = (count = 4) => {
    const today = new Date();
    return Array.from({length: count}, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i + 1);
      return d;
    });
  };
  const otherDates = getNextDates();

  return (
    <View style={styles.container}>
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={AppImages.Back} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurant</Text>
        <TouchableOpacity>
          <Image source={AppImages.Bell} style={styles.bellIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={AppImages.Restaurant} style={styles.image} />

        <View style={styles.detailsContainer}>
          <Text style={styles.location}>UK</Text>
          <Text style={styles.restaurantName}>Colony Restaurant</Text>
          <Text style={styles.description}>
            Hypnotic views of the cityscape inspire exquisite mixology in an inviting atmosphere
          </Text>

       {/* ---------- Guests & Date in one row ---------- */}

{/* ---------- Guests & Date (side by side like FlatList) ---------- */}

<View
  style={{
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
 // works in RN 0.71+, adds consistent spacing between boxes
  }}>
  
  {/* Party Size */}
  <View style={{ flex: 1, marginRight: 8  }}>
    <Text style={styles.label}>Party Size</Text>
    <TouchableOpacity
      style={[styles.slotBox, { justifyContent: 'center' }]}
      onPress={() => setShowGuestPopup(true)}>
      <Text style={[styles.slotText, { marginTop: 5 }]}>
        {guests ? `${guests} Guests` : 'Select'}
      </Text>
    </TouchableOpacity>
  </View>

  {/* Date Picker */}
  <View style={{ flex: 1, marginRight: 8 }}>
    <Text style={styles.label}>Date</Text>
    <TouchableOpacity
      style={[styles.slotBox, { justifyContent: 'center' }]}
      onPress={() => setShowDatePicker(true)}>
      <Text style={[styles.slotText, { marginTop: 5 }]}>
        {date.toDateString().slice(4, 10)}
      </Text>
    </TouchableOpacity>
  </View>
</View>




{/* Guest Popup */}
<PopupDropdown
  label="Party Size"
  visible={showGuestPopup}
  data={guestOptions}
  selectedValue={guests ? `${guests} Guests` : null}
  onSelect={value => {
    setGuests(value);
    setShowGuestPopup(false);
  }}
  onClose={() => setShowGuestPopup(false)}
  placeholder="Select"
/>

{/* Date Picker */}
{showDatePicker && (
  <DateTimePicker
    value={date}
    mode="date"
    display="default"
    onChange={onChangeDate}
  />
)}



     

          {/* ---------- Time Slots ---------- */}
          <View style={{marginTop: 20}}>
            <FlatList
              data={timeSlots}
              numColumns={2}
              columnWrapperStyle={{justifyContent: 'space-between'}}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => setSelectedSlot(item)}
                  style={[
                    styles.slotBox,
                    selectedSlot === item && {backgroundColor: Colors.Muted_Gold},
                  ]}>
                  <Text
                    style={[
                      styles.slotText,
                      selectedSlot === item && {color: Colors.WHITE},
                    ]}>
                    {item}
                  </Text>
                  <Text
                    style={[
                      styles.slotSubText,
                      selectedSlot === item && {color: Colors.WHITE},
                    ]}>
                    Drinks and light bites
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

   





          {/* ---------- Confirm Button ---------- */}
          <Button
            title="continue"
            style={styles.confirmButton}
            textStyle={styles.confirmText}
            onPress={() => {
              navigation.navigate('Confirmation', {
                date,
                guests,
                slot: selectedSlot,
              });
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.WHITE},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 45,
  },
  backButton: {height: 40, width: 40, justifyContent: 'center', alignItems: 'center'},
  backIcon: {height: 24, width: 24, tintColor: Colors.BLACK},
  bellIcon: {height: 24, width: 24, tintColor: Colors.BLACK},
  headerTitle: {fontFamily: Fonts.instrumentSansMedium, fontSize: 20, color: Colors.BLACK},
  image: {
    width: '92%',
    height: 200,
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 15,
  },
  detailsContainer: {paddingHorizontal: 20, paddingVertical: 20},
  location: {fontFamily: Fonts.instrumentSansRegular, fontSize: 13, color: Colors.Muted_Gold},
  restaurantName: {
    fontFamily: Fonts.instrumentSansBold,
    fontSize: 20,
    color: Colors.BLACK,
    marginTop: 6,
  },
  description: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 14,
    color: Colors.DARK_GREY,
    marginTop: 4,
    lineHeight: 20,
  },
  label: {fontFamily: Fonts.instrumentSansMedium, fontSize: 16, color: Colors.BLACK, marginTop: 20, marginBottom: 8},
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.BORDERGREY,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
  },
  dropdownText: {fontFamily: Fonts.instrumentSansRegular, fontSize: 14, color: Colors.BLACK},
  row: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 16},
  dateBox: {
    width: '48%',
    borderWidth: 1,
    borderColor: Colors.BORDERGREY,
    borderRadius: 10,
    padding: 12,
  },
  dateText: {fontFamily: Fonts.instrumentSansMedium, fontSize: 16, color: Colors.BLACK},
  subLabel: {fontFamily: Fonts.instrumentSansRegular, fontSize: 12, color: Colors.DARK_GREY},
  slotBox: {
    borderWidth: 1,
    borderColor: Colors.BORDERGREY,
    borderRadius: 10,
    width: '48%',
    paddingVertical: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  slotText: {fontFamily: Fonts.instrumentSansMedium, fontSize: 16, color: Colors.BLACK},
  slotSubText: {fontFamily: Fonts.instrumentSansRegular, fontSize: 12, color: Colors.DARK_GREY},

  availabilitySection: {marginTop: 25},
  availabilityTitle: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 16,
    color: Colors.BLACK,
    marginBottom: 10,
  },
  dateRow: {marginBottom: 14},
  otherDateText: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 14,
    color: Colors.BLACK,
    marginBottom: 8,
  },
  smallSlotBox: {
    borderWidth: 1,
    borderColor: Colors.BORDERGREY,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  smallSlotText: {fontFamily: Fonts.instrumentSansMedium, fontSize: 14, color: Colors.BLACK},
  smallSlotSubText: {fontFamily: Fonts.instrumentSansRegular, fontSize: 10, color: Colors.DARK_GREY},
  confirmButton: {
    backgroundColor: Colors.Muted_Gold,
    marginTop: 25,
    borderRadius: 30,
    paddingVertical: 12,
    alignSelf: 'center',
    width: '90%',
  },
  availabilitySection: {
    marginTop: 20,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.Black,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.Light_Grey,
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.White,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.Light_Grey,
  },
  dropdownDate: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.Black,
    marginBottom: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  timeBox: {
    borderWidth: 1,
    borderColor: Colors.Muted_Gold,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  timeText: {
    fontSize: 13,
    color: Colors.Muted_Gold,
  },
  confirmText: {fontFamily: Fonts.instrumentSansMedium, color: Colors.WHITE, fontSize: 15},
//   label: {
//   fontSize: 14,
//   fontWeight: '500',
//   color: Colors.BLACK,
//   marginBottom: 8,
// },

// slotText: {
//   fontSize: 15,
//   color: Colors.BLACK,
//   textAlign: 'center',
// },

});

export default ReservationScreen;
