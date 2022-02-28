import {GestureHandlerRootView} from 'react-native-gesture-handler';
import React, {useState} from 'react';
import AnimatedListScreen from './screens/AnimatedList';
import {useWindowDimensions, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {runOnJS, useSharedValue} from 'react-native-reanimated';
import {HomeScreen} from './screens/Home';
import ListScreen from './screens/List';
import List3Screen from './screens/List3';
import {NavigationContainer} from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  List: undefined;
  AnimatedList: undefined;
  List3: {enabled: boolean};
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const {width, height} = useWindowDimensions();

  return (
    <GestureHandlerRootView style={{width, height}}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="List"
            component={ListScreen}
            options={{
              gestureEnabled: true,
              gestureResponseDistance: width,
            }}
          />
          <Stack.Screen
            name="AnimatedList"
            component={AnimatedListScreen}
            options={{
              gestureEnabled: true,
              gestureResponseDistance: width,
            }}
          />
          <Stack.Screen
            name="List3"
            component={List3Screen}
            options={{
              gestureEnabled: true,
              gestureResponseDistance: width,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
