import {StackScreenProps} from '@react-navigation/stack';
import React, {useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {RootStackParamList} from '../App';

type Props = StackScreenProps<RootStackParamList, 'List'>;

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function AnimatedListScreen(_: Props) {
  const {width} = useWindowDimensions();

  const startingX = useSharedValue<number>(0);
  const offsetX = useSharedValue<number>(0);
  const accOffsets = useSharedValue<number>(0);

  const scrollStyle = useAnimatedStyle(() => {
    return {transform: [{translateX: accOffsets.value + offsetX.value}]};
  });

  const SstartingX = useSharedValue<number>(0);
  const SoffsetX = useSharedValue<number>(0);
  const SaccOffsets = useSharedValue<number>(0);

  const screenScrollStyle = useAnimatedStyle(() => {
    return {transform: [{translateX: SaccOffsets.value + SoffsetX.value}]};
  });

  const horizontalPan = Gesture.Pan()
    .onBegin(event => {
      startingX.value = event.absoluteX; // 0, 15
    })
    .onEnd(() => {
      accOffsets.value = accOffsets.value + offsetX.value;
      offsetX.value = 0;
    })
    .onTouchesMove((event, stateManager) => {
      if (event.numberOfTouches !== 1) {
        return;
      }

      offsetX.value = event.allTouches[0].absoluteX - startingX.value;

      if (accOffsets.value + offsetX.value > 0) {
        accOffsets.value = 0;
        offsetX.value = 0;
        stateManager.fail();
      }
    });

  const screenPan = Gesture.Pan()
    .onBegin(event => {
      SstartingX.value = event.absoluteX;
    })
    .onUpdate(event => {
      SoffsetX.value = event.absoluteX - SstartingX.value;
    })
    .onEnd(() => {
      SaccOffsets.value = SaccOffsets.value + SoffsetX.value;
      SoffsetX.value = 0;
    });

  const panning = Gesture.Exclusive(horizontalPan, screenPan);

  return (
    <GestureDetector gesture={panning}>
      <Animated.View style={[{backgroundColor: 'blue'}, screenScrollStyle]}>
        <Animated.View
          style={[
            {
              marginTop: 20,
              width: width * 2,
              flexDirection: 'row',
              backgroundColor: 'white',
            },
            scrollStyle,
          ]}>
          <FlatList data={data} renderItem={renderItem} style={{width}} />
          <FlatList data={data} renderItem={renderItem} style={{width}} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const renderItem = (info: ListRenderItemInfo<number>): JSX.Element => {
  return (
    <View
      style={{
        width: '100%',
        height: 96,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
      }}>
      <Text>{info.item}</Text>
    </View>
  );
};
