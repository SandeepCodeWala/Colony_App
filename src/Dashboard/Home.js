import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { AppImages, Colors, Fonts } from '../res';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

const DATA = [
  {
    id: '1',
    title: 'Restaurant',
    subtitle: 'Experience fine dining with exquisite cuisines.',
    image: AppImages.restaurant,
    buttonText: 'Reserve a Table',
    screen: 'RightArrow',
  },
  {
    id: '2',
    title: 'Lounge',
    subtitle: 'Relax with signature cocktails and cozy ambiance.',
    image: AppImages.lounge,
    buttonText: 'Reserve a Lounge',
    screen: 'Lounge',
  },
  {
    id: '3',
    title: 'Events',
    subtitle: 'Join our special events and live performances.',
    image: AppImages.events,
    buttonText: 'Reserve an Event',
    screen: 'Event',
  },
];

const Home = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [UserName, setUserName] = React.useState('');
  const [membership, setMembershipNumber] = React.useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUser();
    // Any side effects if needed
  }, []);

  const fetchUser = async () => {
    // const UserName = await AsyncStorage.getItem('name');
    const UserName = useSelector(state => state.auth?.user?.name);
    console.log('redux User Name:', UserName);

    const membershipNum = useSelector(state => state.auth.membershipNumber);
    // const membershipNum = await AsyncStorage.getItem('membershipNumber');
    setUserName(UserName);
    setMembershipNumber(membershipNum);

    // Fetch user data logic here
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % DATA.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const handleReserveTable = screen => {
    console.log(
      'UserName && membership || UserName',
      (UserName && membership) || UserName,
    );
    if (screen == 'Event') {
      navigation.navigate('BookEvent');
      return;
    }
    if (screen == 'Lounge') {
      navigation.navigate('ReserveLounge', { screen: 'Lounge' });
      return;
    }
    if ((UserName && membership) || UserName != null) {
      navigation.navigate('ReserveLounge', { screen: 'table' });
    } else {
      navigation.navigate('Login');
      // showToast('error', 'User details not found. Please log in again.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.overlay}>
        <View
          style={{
            position: 'absolute',
            bottom: '5%',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>

          <View style={styles.paginationContainer}>
            {DATA.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index ? styles.activeDot : null,
                ]}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleReserveTable(item?.screen)}
          >
            <Text style={styles.buttonText}>{item.buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <FlatList
        ref={flatListRef}
        data={DATA}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width,
    height,
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 70, // 0 in mac
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  title: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 32,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.OFF_WHITE,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'center',
    color: Colors.BLUE_GRAY,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.Muted_Gold,
    width: '95%',
    height: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 25,
    marginBottom: Platform.OS === 'ios' ? 60 : 0,
  },
  buttonText: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.WHITE,
  },

  paginationContainer: {
    // position: 'absolute',
    // bottom: 40,
    // left: 0,
    // right: 0,
    // paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.WHITE,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 25,
    height: 7,
    backgroundColor: Colors.Muted_Gold,
  },
});

export default Home;
