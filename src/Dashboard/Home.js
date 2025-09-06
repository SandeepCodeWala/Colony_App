

// import React from 'react';
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native';
// import { AppImages } from '../res';

// const { width, height } = Dimensions.get('window');

// const DATA = [
//   {
//     id: '1',
//     title: 'Card Title 1',
//     subtitle: 'This is a short description',
//     image: AppImages.cc,
//   },
//   {
//     id: '2',
//     title: 'Card Title 2',
//     subtitle: 'Another description here',
//     image: AppImages.ccc,
//   },
//   {
//     id: '3',
//     title: 'Card Title 3',
//     subtitle: 'Some more details here',
//     image: AppImages.cc,
//   },
// ];

// const Home = () => {
//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Image source={item.image} style={styles.image} />
//       <View style={styles.overlay}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.subtitle}>{item.subtitle}</Text>

//         <View style={styles.buttonRow}>
//           <TouchableOpacity style={styles.button}>
//             <Text style={styles.buttonText}>Action 1</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button}>
//             <Text style={styles.buttonText}>Action 2</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1, backgroundColor: '#000' }}>
//       <StatusBar translucent backgroundColor='transparent' barStyle='light-content' />
//       <FlatList
//         data={DATA}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         showsVerticalScrollIndicator={false}
//         decelerationRate='normal'
//         bounces={false}
//         contentInsetAdjustmentBehavior='never'
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     width,
//     height, // full screen card
//   },
//   image: {
//     width,
//     height,
//     resizeMode: 'cover',
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: '700',
//     marginBottom: 8,
//     color: '#fff',
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#eee',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });

// export default Home;



import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  StatusBar 
} from 'react-native';
import { AppImages, Colors, Fonts } from '../res';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const DATA = [
  {
    id: '1',
    title: 'Restaurant',
    subtitle: 'Experience fine dining with exquisite cuisines.',
    image: AppImages.restaurant,
    buttonText: 'Reserve a Table',
    screen: 'RightArrow',   // 👈 must match the name in your navigator
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate(item.screen)} // 👈 navigate to screen
        >
          <Text style={styles.buttonText}>{item.buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
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
    width,
    height,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    width: 300,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.WHITE,
  },
});

export default Home;



