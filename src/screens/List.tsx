import {StackScreenProps, useGestureHandlerRef} from '@react-navigation/stack';
import React, {createRef, useRef, useState} from 'react';
import {
  ListRenderItemInfo,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  FlatList,
  Gesture,
  GestureDetector,
  PanGestureHandler,
  ScrollView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {runOnJS, useSharedValue} from 'react-native-reanimated';
import {RootStackParamList} from '../App';

type Props = StackScreenProps<RootStackParamList, 'List'>;

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const data2 = [1000, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];

export default function ListScreen(_: Props) {
  const ref = useGestureHandlerRef();
  const scrollRef = createRef<ScrollView>();

  const {width} = useWindowDimensions();

  const startingX = useSharedValue<number>(0);
  const offsetX = useSharedValue<number>(0);
  const accOffsets = useSharedValue<number>(0);

  const [posn, setPosn] = useState<number>(0);

  const wf = useRef<[typeof ref] | []>([]);

  const lezSet = () => (wf.current = [ref]);
  const lezUnset = () => (wf.current = []);

  const lezUnset2 = () => {
    scrollRef.current?.setNativeProps({scrollEnabled: false});
  };

  const lezSet2 = () => {
    scrollRef.current?.setNativeProps({scrollEnabled: true});
  };

  const panning = Gesture.Pan()
    .onTouchesDown((e, sm) => {
      startingX.value = e.changedTouches[0].absoluteX;
    })
    .onTouchesMove((e, sm) => {
      const oX = e.changedTouches[0].absoluteX - startingX.value;
      if (accOffsets.value + oX > 0 && posn === 0) {
        console.log('1');
        accOffsets.value = 0;
        offsetX.value = 0;
        sm.fail();
        runOnJS(lezUnset2)();
      } else {
        console.log('2');
        offsetX.value = oX;
        runOnJS(lezSet2)();
      }
    });

  return (
    <GestureDetector gesture={panning}>
      <ScrollView
        horizontal
        bounces={false}
        ref={scrollRef}
        snapToInterval={width}
        onMomentumScrollEnd={e => {
          setPosn(e.nativeEvent.contentOffset.x);
        }}
        onScrollEndDrag={e => {
          setPosn(e.nativeEvent.contentOffset.x);
        }}
        decelerationRate="fast"
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}>
        <FlatList data={data} renderItem={renderItem} style={{width}} />
        <FlatList data={data2} renderItem={renderItem} style={{width}} />
      </ScrollView>
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
