// import React from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   StatusBar,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import { AppImages } from '../res';

// const { width, height } = Dimensions.get('window');

// const DATA = [
//   { id: '1', title: 'Card Title 1', subtitle: 'This is a short description', image: AppImages.cc },
//   { id: '2', title: 'Card Title 2', subtitle: 'Another description here', image: AppImages.ccc },
//   { id: '3', title: 'Card Title 3', subtitle: 'Some more details here', image: AppImages.cc },
//   { id: '4', title: 'Card Title 4', subtitle: 'Additional content for scrolling', image: AppImages.cc },
//   { id: '5', title: 'Card Title 5', subtitle: 'More content to ensure scrolling works', image: AppImages.ccc },
//   { id: '6', title: 'Card Title 6', subtitle: 'Even more content to test scrolling', image: AppImages.cc },
//   { id: '7', title: 'Card Title 7', subtitle: 'Final card to ensure scrolling works', image: AppImages.ccc },
//   { id: '8', title: 'Card Title 8', subtitle: 'Extra card for testing', image: AppImages.cc },
//   { id: '9', title: 'Card Title 9', subtitle: 'Another test card', image: AppImages.ccc },
//   { id: '10', title: 'Card Title 10', subtitle: 'Last test card', image: AppImages.cc },
// ];

// const Home = () => {
//   const renderItem = (item) => (
//     <View key={item.id} style={styles.card}>
//       <Image source={item.image} style={styles.image} />
//       <View style={styles.overlay}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.subtitle}>{item.subtitle}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle='light-content' backgroundColor='transparent' translucent={true} />
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.contentContainer}
//         showsVerticalScrollIndicator={true}
//         bounces={true}
//         scrollEnabled={true}
//       >
//         {DATA.map(renderItem)}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   contentContainer: {
//     paddingTop: 0,
//   },
//   card: {
//     width,
//     height: height * 0.5,
//     marginBottom: 0,
//   },
//   image: {
//     width,
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
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
// });

// export default Home;

import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { AppImages } from '../res';

const { width, height } = Dimensions.get('window');

const DATA = [
  {
    id: '1',
    title: 'Card Title 1',
    subtitle: 'This is a short description',
    image: AppImages.cc,
  },
  {
    id: '2',
    title: 'Card Title 2',
    subtitle: 'Another description here',
    image: AppImages.ccc,
  },
  {
    id: '3',
    title: 'Card Title 3',
    subtitle: 'Some more details here',
    image: AppImages.cc,
  },
];

const Home = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Action 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Action 2</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar translucent backgroundColor='transparent' barStyle='light-content' />
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        decelerationRate='normal'
        bounces={false}
        contentInsetAdjustmentBehavior='never'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width,
    height, // full screen card
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
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Home;

