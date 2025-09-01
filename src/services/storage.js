import AsyncStorage from '@react-native-community/async-storage'

const set = (key, data) => AsyncStorage.setItem(key, data && JSON.stringify(data))
const get = key => AsyncStorage.getItem(key).then(data => JSON.parse(data))
const clear = key => AsyncStorage.removeItem(key)

export default {
  set,
  get,
  clear,
  SESSION: 'SESSION',
}