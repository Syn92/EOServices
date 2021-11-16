import Slider from 'react-native-slide-to-unlock';
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import { Icon } from 'react-native-elements'
interface Prop {
    callback?: any
}

export function SliderComponent(props: Prop) {
    return (
        <Slider
  childrenContainer={{ color: 'white'}}
  onEndReached={props.callback}
  containerStyle={{
    margin: 8,
    backgroundColor: '#182851',
    borderRadius: 25,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%'
  }}
  sliderElement={
    <Icon
      style={{
        margin: 4,
        borderRadius: 25,
        backgroundColor: 'white',
        color:  "white",
      }}
      name="circle"
      color="white"
      size={40}
      type='MaterialCommunityIcons'
    />
  }
>
  <Text style={{color: 'white', marginLeft: '15%'}}>{'Slide to complete transaction'}</Text>
</Slider>
    )
}