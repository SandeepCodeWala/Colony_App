import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors, Fonts, AppImages} from '../res';
import Button from '../components/Button'; // 👈 Reusable button

const BookScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image source={AppImages.Back} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Book</Text>

        <TouchableOpacity>
          <Image source={AppImages.Bell} style={styles.bellIcon} />
        </TouchableOpacity>
      </View>

      {/* ---------- Content ---------- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}>
        <View style={{marginTop: 10}}>
          {/* ---------- Lounge Section ---------- */}
          <View style={styles.card}>
            <ImageBackground
              source={AppImages.Lounge}
              imageStyle={{borderRadius: 16}}
              style={styles.imageCard}>
              <View style={styles.overlay} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>LOUNGE</Text>
                <Text style={styles.description}>
                  Relax, unwind, and enjoy every moment as we serve comfort,
                  luxury, and happiness—one refreshing sip and soothing vibe at
                  a time.
                </Text>

                {/* Only the button is touchable */}
                <Button
                  title="Reserve a Lounge"
                  style={styles.reserveButton}
                  textStyle={styles.reserveText}
                  onPress={() => navigation.navigate('ReserveLounge')}
                />
              </View>
            </ImageBackground>
          </View>

          {/* ---------- Restaurant Section ---------- */}
          <View style={[styles.card, {marginTop: 24}]}>
            <ImageBackground
              source={AppImages.Restaurant}
              imageStyle={{borderRadius: 16}}
              style={styles.imageCard}>
              <View style={styles.overlay} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>RESTAURANT</Text>
                <Text style={styles.description}>
                  We bring joy to your table every day, crafting memorable
                  dining experiences with love, flavor, and one delicious plate
                  at a time.
                </Text>

                {/* Only the button is touchable */}
                <Button
                  title="Reserve a Table"
                  style={styles.reserveButton}
                  textStyle={styles.reserveText}
                  onPress={() => navigation.navigate('ReserveTable')}
                />
              </View>
            </ImageBackground>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default BookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: Colors.BLACK,
  },
  headerTitle: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 20,
    color: Colors.BLACK,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageCard: {
    width: '100%',
    height: 270,
    justifyContent: 'flex-end', // Content at bottom
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  textContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.instrumentSansBold,
    fontSize: 24,
    color: Colors.WHITE,
    letterSpacing: 1,
  },
  description: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 14,
    color: Colors.WHITE,
    marginTop: 8,
    lineHeight: 20,
    textAlign: 'center',
  },
  reserveButton: {
    backgroundColor: Colors.Muted_Gold,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 15,
  },
  reserveText: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 14,
    color: Colors.WHITE,
  },
});
