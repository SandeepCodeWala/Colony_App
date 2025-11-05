import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import colors from '../themes/colors';
import { Colors, Fonts } from '../res';

const CustomModal = ({
  visible = false,
  onClose = () => {},
  title = '',
  titleAlign = 'center', // 'left' | 'center'
  imageSource = null,
  description = '',
  buttonText = '',
  onButtonPress = () => {},
  modalStyle = {},
  titleStyle = {},
  descriptionStyle = {},
  buttonStyle = {},
  buttonTextStyle = {},
  showCloseIcon = true,
  closeIconImage = null, // optional custom close icon image
  description1 = '',
  descriptionStyle1 = {},
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, modalStyle]}>
          {/* Header with Title + Close */}
          {(title || showCloseIcon) && (
            <View style={styles.header}>
              <View
                style={[
                  styles.titleContainer,
                  {
                    justifyContent:
                      titleAlign === 'center' ? 'center' : 'flex-start',
                  },
                ]}
              >
                {title ? (
                  <Text style={[styles.title, titleStyle]}>{title}</Text>
                ) : null}
              </View>

              {showCloseIcon && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  {closeIconImage ? (
                    <Image
                      source={closeIconImage}
                      style={styles.closeIconImage}
                    />
                  ) : (
                    <Text style={styles.closeText}>✕</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Optional Image */}
          {imageSource && (
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="contain"
            />
          )}
          {description1 ? (
            <Text style={[styles.description1, descriptionStyle1]}>
              {description1}
            </Text>
          ) : null}
          {/* Optional Description */}
          {description ? (
            <Text style={[styles.description, descriptionStyle]}>
              {description}
            </Text>
          ) : null}

          {/* Optional Button */}
          {buttonText ? (
            <TouchableOpacity
              style={[styles.button, buttonStyle]}
              onPress={onButtonPress}
            >
              <Text style={[styles.buttonText, buttonTextStyle]}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '85%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    elevation: 8,
  },
  description1: {
    fontSize: 22,
    color: Colors.GREEN,
    // fontWeight:'700',
    fontFamily: Fonts.instrumentSansBold,
    textAlign: 'center',
    marginVertical: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    alignSelf: 'flex-end',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  closeText: {
    fontSize: 22,
    color: '#000',
  },
  closeIconImage: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
  image: {
    width: '100%',
    height: 150,
    // marginVertical: 15,
    marginBottom:15,
    borderRadius: 10,
  },
  description: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: Colors.Muted_Gold,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
