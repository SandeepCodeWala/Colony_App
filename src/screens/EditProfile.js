import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import ReserveHeader from '../components/ReserveHeader';
import { AppImages, Colors } from '../res';
import { useNavigation } from '@react-navigation/native';
import CommonTextInput from '../components/TextInputField';
import SettingHeader from '../components/SettingHeader';
import CommonDropdown from '../components/CommonDropdown';
import CommonCheckboxGroup from '../components/CommonCheckboxGroup';

import CommonRadioGroup from '../components/CommonRadioButton';

const titleData = [
  { label: 'Mr', value: 'Mr' },
  { label: 'Ms', value: 'Ms' },
  { label: 'Mrs', value: 'Mrs' },
];

const cardDummyData = [
  {
    id: '1',
    title: 'Stays',
    image: AppImages.restaurant,
  },
  {
    id: '2',
    title: 'Dining',
    image: AppImages.lounge,
  },
  {
    id: '3',
    title: 'Well-being',
    image: AppImages.events,
  },
  {
    id: '4',
    title: 'Passions',
    image: AppImages.restaurant,
  },
];

const CommonConsentCheckbox = ({ checked, onPress, children }) => {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={onPress}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.tick}>✓</Text>}
      </View>

      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const EditProfileScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState(null);
  const [type, setType] = useState('mobile');
  const [selected, setSelected] = useState([]);
  const [offers, setOffers] = useState(true);
  const [partners, setPartners] = useState(true);

  const navigation = useNavigation();

  const onSelect = item => {
    console.log('Selected:', item.title);
  };
  return (
    <View style={styles.container}>
      {/* ---------- Header ---------- */}
      <SettingHeader
        title={'PERSONAL DETAILS'}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 25 }}
      >
        <Text style={styles.mainTitle}>A place to update your details</Text>
        <Text style={styles.subTitle}>
          All fields are mandatory unless stated otherwise.
        </Text>

        {/* Section */}
        <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>

        <View style={styles.formContainer}>
          <CommonDropdown
            label="TITLE (OPTIONAL)"
            data={titleData}
            value={title}
            onChange={setTitle}
          />
          <CommonTextInput
            label="FIRST NAME"
            value={firstName}
            onChangeText={setFirstName}
            showError={!firstName}
            showRightIcon={true}
            iconName={
              <Image source={AppImages.exclamation} style={styles.backIcon} />
            }
          />

          <CommonTextInput
            label="MIDDLE NAME (OPTIONAL)"
            value={lastName}
            onChangeText={setLastName}
            showError={!lastName}
          />

          <CommonTextInput
            label="Last NAME"
            value={lastName}
            onChangeText={setLastName}
            showError={!lastName}
            showRightIcon={true}
            iconName={
              <Image source={AppImages.exclamation} style={styles.backIcon} />
            }
          />

          <View style={{ marginTop: 10 }}>
            <CommonDropdown
              label="NATIONALITY (OPTIONAL)"
              data={titleData}
              value={title}
              onChange={setTitle}
            />
          </View>
          <CommonTextInput
            label="EMAIL"
            value={lastName}
            onChangeText={setLastName}
            showError={!lastName}
            showRightIcon={true}
            iconName={
              <Image source={AppImages.exclamation} style={styles.backIcon} />
            }
          />

          <View style={{ marginTop: 10 }}>
            <CommonDropdown
              label="GENDER (OPTIONAL)"
              data={titleData}
              value={title}
              onChange={setTitle}
            />
          </View>
        </View>

        {/* Address Section */}
        <Text style={[styles.sectionTitle, { marginTop: 40 }]}>
          ADDRESS INFORMATION
        </Text>

        <View style={styles.formContainer}>
          <CommonTextInput
            label="ADDRESS LINE 1/P.O. BOX (OPTIONAL)"
            value={firstName}
            onChangeText={setFirstName}
            showError={!firstName}
          />
          <CommonTextInput
            label="ADDRESS LINE 2 (OPTIONAL)"
            value={firstName}
            onChangeText={setFirstName}
            showError={!firstName}
          />
          <CommonTextInput
            label="ADDRESS LINE 3 (OPTIONAL)"
            value={firstName}
            onChangeText={setFirstName}
            showError={!firstName}
          />
          <CommonTextInput
            label="CITY (OPTIONAL)"
            value={firstName}
            onChangeText={setFirstName}
            showError={!firstName}
          />
          <View style={{ marginTop: 10 }}>
            <CommonDropdown
              label="COUNTRY OF RESIDENCE"
              data={titleData}
              value={title}
              onChange={setTitle}
            />
          </View>
        </View>

        {/* Address Section */}
        <Text style={[styles.sectionTitle, { marginTop: 40 }]}>
          CONTACT INFORMATION
        </Text>
        <Text style={styles.contactSubTitle}>
          Please choose which telephone number you would prefer us to contact
          you on
        </Text>

        <CommonRadioGroup
          value={type}
          onChange={setType}
          options={[
            { label: 'MOBILE', value: 'mobile' },
            { label: 'WORK', value: 'work' },
            { label: 'Home', value: 'home' },
          ]}
        />
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1, marginRight: 8, marginTop: 5 }}>
              <CommonDropdown
                label="CODE"
                data={titleData}
                value={title}
                onChange={setTitle}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <CommonTextInput
                label="MOBILE NUMBER"
                value={firstName}
                onChangeText={setFirstName}
                showError={!firstName}
              />
            </View>
          </View>

          {/* work number */}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <View style={{ flex: 1, marginRight: 8, marginTop: 5 }}>
              <CommonDropdown
                label="CODE"
                data={titleData}
                value={title}
                onChange={setTitle}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <CommonTextInput
                label="WORK NUMBER"
                value={firstName}
                onChangeText={setFirstName}
                showError={!firstName}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <View style={{ flex: 1, marginRight: 8, marginTop: 5 }}>
              <CommonDropdown
                label="CODE"
                data={titleData}
                value={title}
                onChange={setTitle}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <CommonTextInput
                label="HOME NUMBER"
                value={firstName}
                onChangeText={setFirstName}
                showError={!firstName}
              />
            </View>
          </View>
        </View>
        <Text style={[styles.sectionTitle, { marginTop: 40 }]}>
          COMMUNICATION PREFERENCE
        </Text>
        <Text style={styles.eventsTitle}>
          Which of the following updates would you like to receive?
        </Text>
        <View style={styles.borderBottom}>
          <CommonCheckboxGroup
            values={selected}
            onChange={setSelected}
            options={[
              { label: 'OFFERS', value: 'offers' },
              { label: 'EVENTS', value: 'events' },
              { label: 'NEWSLETTERS', value: 'newsletters' },
            ]}
          />
        </View>
        <Text style={[styles.eventsTitle, { marginTop: 20 }]}>
          Tell us more of your personal preference.
        </Text>

        <View style={[styles.houseContainer, styles.borderBottom]}>
          {cardDummyData.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => onSelect(item)}
            >
              <Image source={item.image} style={styles.cardImage} />

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSelect}>SELECT</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.marketingTitle, { marginTop: 40 }]}>
          MARKETING COMMUNICATION PREFERENCE
        </Text>

        {/* last content */}

        <View style={styles.lastContainer}>
          {/* Intro Text */}
          <Text style={styles.paragraph}>
            We tailor our marketing communications to your preferences. Further
            details can be found in{' '}
            <Text style={styles.link}>Jumeirah's Privacy Policy</Text>.
          </Text>

          {/* Checkbox 1 */}
          <CommonConsentCheckbox
            checked={offers}
            onPress={() => setOffers(!offers)}
          >
            I would like to receive personalized offers, events and promotions
            from Jumeirah. I understand that I may unsubscribe or change my
            preferences at any time as described in Jumeirah's{' '}
            <Text style={styles.link}>Privacy Notice</Text>.
          </CommonConsentCheckbox>

          {/* Checkbox 2 */}
          <CommonConsentCheckbox
            checked={partners}
            onPress={() => setPartners(!partners)}
          >
            I would like Jumeirah to send me exclusive tailored offers from
            Jumeirah's carefully selected partners. (Our partner list, which
            changes from time to time, can be viewed{' '}
            <Text style={styles.link}>online</Text>.)
          </CommonConsentCheckbox>

          {/* Terms */}
          <Text style={styles.paragraph}>
            By joining, I agree to Jumeirah One{' '}
            <Text style={styles.link}>Terms and Conditions</Text> and confirm
            that I am at least 18 years of age.
          </Text>

          {/* Buttons */}
          <TouchableOpacity style={styles.confirmBtn}>
            <Text style={styles.confirmText}>CONFIRM CHANGES</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.cancel}>CANCEL</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },

  formContainer: {
    flexDirection: 'column',
    gap: 5,
  },
  header: {
    alignItems: 'center',
    // marginTop: 10,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 16,
    letterSpacing: 2,
    color: '#111',
  },

  mainTitle: {
    fontSize: 21,
    fontFamily: 'serif',
    color: '#444444',
    marginBottom: 15,
    marginTop: 29,
    textAlign: 'center',
  },

  subTitle: {
    fontSize: 13,
    fontFamily: 'serif',
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  contactSubTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  eventsTitle: {
    fontSize: 15,
    color: '#8e8b8b',
    marginBottom: 20,
    textAlign: 'left',
    fontWeight: '400',
  },

  sectionTitle: {
    fontSize: 13,
    letterSpacing: 2,
    color: '#5c5b5b',
    marginTop: 10,
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  label: {
    fontSize: 12,
    color: '#555',
    letterSpacing: 1,
    marginBottom: 4,
  },

  inputWrapper: {
    marginBottom: 22,
  },

  input: {
    fontSize: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    color: '#111',
  },

  selectField: {
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingVertical: 12,
    marginBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  selectText: {
    fontSize: 16,
    color: '#111',
  },

  arrow: {
    fontSize: 18,
    color: '#111',
  },
  backIcon: { height: 20, width: 20, tintColor: Colors.OFF_GREY },

  houseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 4,
    paddingHorizontal: 0,
  },

  card: {
    width: CARD_WIDTH - 10,
    marginBottom: 28,
  },

  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 4,
    backgroundColor: '#eee',
  },

  cardTitle: {
    marginTop: 10,
    fontSize: 18,
    color: '#2b2b2b',
    fontFamily: 'serif', // optional
  },

  cardSelect: {
    marginTop: 2,
    fontSize: 12,
    letterSpacing: 1,
    color: '#777',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingBottom: 5,
  },

  marketingTitle: {
    fontSize: 12,
    letterSpacing: 2,
    color: '#5c5b5b',
    marginTop: 10,
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: '600',
  },

  //  last content

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    textAlign: 'justify',
    marginBottom: 22,
  },

  box: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 2,
    marginTop: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  boxChecked: {
    backgroundColor: '#e5d8c5',
  },

  tick: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  text: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
    color: '#2b2b2b',
    textAlign: 'justify',
  },

  //  pages last content

  lastContainer: {
    padding: 0,
    // backgroundColor: '#f7f5f1',
    flex: 1,
  },

  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: '#2b2b2b',
    marginBottom: 20,
    textAlign: 'justify',
  },

  link: {
    textDecorationLine: 'underline',
  },

  confirmBtn: {
    borderWidth: 1.5,
    borderColor: '#000',
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },

  confirmText: {
    fontSize: 14,
    letterSpacing: 1,
    fontWeight: '500',
  },

  cancel: {
    textAlign: 'center',
    fontSize: 14,
    letterSpacing: 1,
  },
});
