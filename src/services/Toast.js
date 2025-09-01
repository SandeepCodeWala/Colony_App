import Toast from 'react-native-toast-message';

export const showToast = (type, text,text2) => {
    Toast.show({
        type: type,
        text1: text,
        text2: text2,

    });



}