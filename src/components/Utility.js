import { Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('window').width;

class Utility {
  static getPerCentage = percentage => {
    return (percentage * deviceWidth) / 100;
  };

  static convertTime = date => {
    const time = new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      day: 'numeric',
      month: 'short',
      weekday: 'long',
    });
    return time;
  };

  static getUpper = str => {
    if (typeof str === 'string') {
      return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } else {
      return '';
    }
  };

  static allLower = str => {
    if (typeof str === 'string') {
      return str
        .split(' ')
        .map(word => word.toLowerCase())
        .join(' ');
    } else {
      return '';
    }
  };

  static allUpper = str => {
    if (typeof str === 'string') {
      return str
        .split(' ')
        .map(word => word.toUpperCase())
        .join(' ');
    } else {
      return '';
    }
  };
}

export default Utility;
