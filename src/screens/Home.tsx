import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItemInfo,
  Pressable,
  Text,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {RootStackParamList} from '../App';

export const AnimatedFlatList =
  Animated.createAnimatedComponent<FlatListProps<number>>(FlatList);

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function HomeScreen() {
  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();

  const renderItem = (info: ListRenderItemInfo<number>): JSX.Element => {
    if (info.index === 0) {
      return (
        <Pressable onPress={() => navigate('List')}>
          <Text>Go To List</Text>
        </Pressable>
      );
    }

    if (info.index === 1) {
      return (
        <Pressable onPress={() => navigate('AnimatedList')}>
          <Text>Go To Animated List</Text>
        </Pressable>
      );
    }

    if (info.index === 2) {
      return (
        <Pressable onPress={() => navigate('List3')}>
          <Text>Go To Animated List 3</Text>
        </Pressable>
      );
    }

    return (
      <View
        style={{
          width: '100%',
          height: 64,
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}>
        <Text>{info.item}</Text>
      </View>
    );
  };

  return (
    <Animated.View style={{width: '100%', height: '100%'}}>
      <Animated.View
        pointerEvents="none"
        style={{
          height: 300,
          width: '100%',
          backgroundColor: 'pink',
          position: 'absolute',
          zIndex: 100,
        }}></Animated.View>

      <AnimatedFlatList
        contentContainerStyle={{paddingTop: 300}}
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={true}
        contentInset={{top: 300}}
        scrollIndicatorInsets={{top: 5000, bottom: 300}}
        automaticallyAdjustContentInsets={false}
      />
    </Animated.View>
  );
}
