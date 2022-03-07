import {StackScreenProps} from '@react-navigation/stack';
import React, {createRef, useState} from 'react';
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
  ScrollView,
} from 'react-native-gesture-handler';
import {runOnJS, useSharedValue} from 'react-native-reanimated';
import {RootStackParamList} from '../App';

type Props = StackScreenProps<RootStackParamList, 'List'>;

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const data2 = [1000, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];

export default function ListScreen(_: Props) {
  const {width} = useWindowDimensions();

  const scrollRef = createRef<ScrollView>();
  const startingX = useSharedValue<number>(0);
  const [posn, setPosn] = useState<number>(0);

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
      if (oX > 0 && posn === 0) {
        sm.fail();
        runOnJS(lezUnset2)();
      } else {
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
