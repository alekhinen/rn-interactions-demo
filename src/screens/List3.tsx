import {StackScreenProps} from '@react-navigation/stack';
import React, {createRef, useRef, useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {RootStackParamList} from '../App';
import {useGestureHandlerRef} from '@react-navigation/stack';

type Props = StackScreenProps<RootStackParamList, 'List3'>;

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const data2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];

export default function List3Screen(_: Props) {
  const ref = useGestureHandlerRef();
  const [wrappedRef, setWrapped] = useState([ref]);
  const {width} = useWindowDimensions();

  const [isEnabled, setEnabled] = useState(true);

  const startingX = useSharedValue<number>(0);
  const offsetX = useSharedValue<number>(0);
  const accOffsets = useSharedValue<number>(0);

  const scrollStyle = useAnimatedStyle(() => {
    return {transform: [{translateX: accOffsets.value + offsetX.value}]};
  });

  const handleStart = (event: any) => {
    startingX.value = event.nativeEvent.absoluteX;
  };

  const handleGesture = (
    event: GestureEvent<PanGestureHandlerEventPayload>,
  ) => {
    const oX = event.nativeEvent.absoluteX - startingX.value;

    if (accOffsets.value + oX > 0) {
      accOffsets.value = 0;
      offsetX.value = 0;
      runOnJS(setWrapped)([ref]);
    } else {
      console.log(oX, -width);
      offsetX.value = oX;
      runOnJS(setWrapped)([]);
    }
  };

  const handleEnd = (_: any) => {
    const acc = accOffsets.value + offsetX.value;
    if (Math.abs(acc) < width - width / 4) {
      accOffsets.value = withSpring(0, {
        overshootClamping: true,
        mass: 0.5,
        damping: 1,
      });
      offsetX.value = withSpring(0, {
        overshootClamping: true,
        mass: 0.5,
        damping: 1,
      });
      runOnJS(setWrapped)([ref]);
      return;
    }

    accOffsets.value = withSpring(-width, {
      overshootClamping: true,
      mass: 0.5,
      damping: 1,
    });
    offsetX.value = withSpring(0, {
      overshootClamping: true,
      mass: 0.5,
      damping: 1,
    });

    // accOffsets.value = acc;
    // offsetX.value = 0;
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGesture}
      onBegan={handleStart}
      onEnded={handleEnd}
      simultaneousHandlers={wrappedRef}>
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
        <FlatList data={data2} renderItem={renderItem2} style={{width}} />
      </Animated.View>
    </PanGestureHandler>
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
        backgroundColor: info.index % 2 === 0 ? 'transparent' : 'pink',
      }}>
      <Text>{info.item}</Text>
    </View>
  );
};

const renderItem2 = (info: ListRenderItemInfo<string>): JSX.Element => {
  return (
    <View
      style={{
        width: '100%',
        height: 96,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        backgroundColor: info.index % 2 === 0 ? 'pink' : 'transparent',
      }}>
      <Text>{info.item}</Text>
    </View>
  );
};
