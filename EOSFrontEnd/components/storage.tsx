import AsyncStorage from '@react-native-community/async-storage';
 

export function set(key: string, value: any) {
  try {
    AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    AsyncStorage.setItem(key, value);
  }
}

export function add(key: string, value: any) {
  try {
    set(key, Object.assign(get(key) || {}, value));
  } catch (err) {
    console.error('common/storage::add', { err, key, value });
  }
}
 async function get(key: string) {
    AsyncStorage.getItem(key).then((value)=>{
        if (!value) return value;
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      });
}

export function remove(key: string) {
    AsyncStorage.removeItem(key);
}
