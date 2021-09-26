import * as React from 'react';

import { Button, Text, View } from 'react-native'

export function Login({navigation}: {navigation: any}) {
  return (
    <View>
      <Text>login</Text>
      <Button title="Next" onPress={() => navigation.navigate('Root')} />
    </View>
  );
}
