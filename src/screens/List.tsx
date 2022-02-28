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

export default function ListScreen(_: Props) {
  const ref = useGestureHandlerRef();

  const tapRef = createRef<TapGestureHandler>();
  const {width} = useWindowDimensions();

  const startingX = useSharedValue<number>(0);
  const offsetX = useSharedValue<number>(0);
  const accOffsets = useSharedValue<number>(0);

  const [wf, setWf] = useState<any>([]);

  const lezSet = () => setWf([ref]);
  const lezUnset = () => setWf([]);

  const panning = Gesture.Pan()
    .onTouchesDown((e, sm) => {
      console.log('touch down');
      startingX.value = e.changedTouches[0].absoluteX;
    })
    .onTouchesMove((e, sm) => {
      console.log('move');
      const oX = e.changedTouches[0].absoluteX - startingX.value;
      if (accOffsets.value + oX > 0) {
        accOffsets.value = 0;
        offsetX.value = 0;
        sm.fail();
        runOnJS(lezSet)();
      } else {
        offsetX.value = oX;
        runOnJS(lezUnset)();
      }
    });

  return (
    <PanGestureHandler simultaneousHandlers={[ref]}>
      <GestureDetector gesture={panning}>
        <ScrollView
          horizontal
          bounces={false}
          waitFor={wf}
          snapToInterval={width}
          onMomentumScrollEnd={e => {
            if (e.nativeEvent.contentOffset.x === 0) {
              lezSet();
            }
          }}
          onScrollEndDrag={e => {
            if (e.nativeEvent.contentOffset.x === 0) {
              lezSet();
            }
          }}
          decelerationRate="fast"
          snapToAlignment="start"
          showsHorizontalScrollIndicator={false}>
          <FlatList data={data} renderItem={renderItem} style={{width}} />
          <FlatList data={data} renderItem={renderItem} style={{width}} />
        </ScrollView>
      </GestureDetector>
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
      }}>
      <Text>{info.item}</Text>
    </View>
  );
};
