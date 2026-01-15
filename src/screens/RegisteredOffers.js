import { ScrollView, StyleSheet, Text } from 'react-native';
import { View } from 'react-native';
import SettingHeader from '../components/SettingHeader';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';

const RegisteredOffers = () => {
    const navigation=useNavigation()
  return (
    <View style={styles.container}>
      <SettingHeader
        title={'REGISTER OFFERS'}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 25 }}
      >
        <Text style={styles.mainTitle}>A place to update your details</Text>
        <Text style={styles.subTitle}>YOU HAVE NOT ADDED ANY OFFERS</Text>

         <Text style={styles.description}>
            Be among the first to receive exclusive loyalty offers and elevate your Colony One experience ever higher.
         </Text>
         <View style={styles.formItem}>
            <Button
              title={'DISCOVER OFFERS '}
              textStyle={{ color: 'black' }}
              style={styles.buttonStyles}
            />
        
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisteredOffers;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.WHITE,
  },

  formContainer: {
    paddingTop: 24,
    flexDirection: 'column',
    
  },

  mainTitle: {
    fontSize: 35,
    fontFamily: 'serif',
    color: '#444444',
    marginBottom: 15,
    marginTop: 29,
    textAlign: 'center',
    fontFamily: 'serif',
  },

  subTitle: {
    fontSize: 12,
    color: '#666',
    letterSpacing: 1,
    marginBottom: 15,
    textAlign: 'center',
  },
  description:{
    fontSize: 17,
    color: '#666',
    letterSpacing: 1,
    marginBottom: 15,
    textAlign: 'center',
  },
    formItem: {
    marginBottom: 20, // ✅ THIS replaces gap
  },
  buttonStyles: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    
  },
})