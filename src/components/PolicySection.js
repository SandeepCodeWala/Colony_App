import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Colors, Fonts } from '../res';

const PolicySection = ({
  agreePolicy,
  setAgreePolicy,
  isAdult,
  setIsAdult,
  onCancelPolicyPress,
}) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.row} onPress={() => setAgreePolicy(!agreePolicy)}>
      <CheckBox
        value={agreePolicy}
        onValueChange={setAgreePolicy}
        tintColors={{ true: Colors.PRIMARY }}
      />
      <Text style={styles.label}>I agree to the restaurant policy</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.row} onPress={() => setIsAdult(!isAdult)}>
      <CheckBox
        value={isAdult}
        onValueChange={setIsAdult}
        tintColors={{ true: Colors.PRIMARY }}
      />
      <Text style={styles.label}>I am above 18 years</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={onCancelPolicyPress}>
      <Text style={styles.link}>View Cancellation Policy</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { marginHorizontal: 16, marginTop: 20 },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  label: { marginLeft: 8, color: Colors.BLACK },
  link: { color: Colors.PRIMARY, marginTop: 6 },
});

export default PolicySection;
