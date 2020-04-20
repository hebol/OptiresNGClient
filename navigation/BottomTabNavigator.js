import React, {useContext} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import LoginScreen from '../screens/LoginScreen';
import NavigationScreen from '../screens/NavigationScreen';
import StatusScreen from '../screens/StatusScreen';
import ControlScreen from '../screens/ControlScreen';
import AssignmentScreen from '../screens/AssignmentScreen';
import {StyleSheet} from 'react-native';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Control';
import UserStatusContext from "../components/UserStatusContext";

export default function BottomTabNavigator({ navigation, route }) {
  const [userStatus, setUserStatus] = useContext(UserStatusContext);
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerStyle: {backgroundColor: '#0096FF'}, headerTitle: getHeaderTitle(route)});

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Control"
        component={ControlScreen}
        options={{
          title: 'Control',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-lock" />,
        }}
      />
      <BottomTab.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Login',
          tabBarVisible: false,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-lock" />,
        }}
      />
      <BottomTab.Screen
        name="Status"
        component={StatusScreen}
        options={{
          title: 'Status',
          tabBarVisible: false,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-information-circle" />,
        }}
      />
      <BottomTab.Screen
        name="Navigation"
        component={NavigationScreen}
        options={{
          title: 'Navigation',
          tabBarVisible: false,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-map" />,
        }}
      />
      <BottomTab.Screen
        name="Assignment"
        component={AssignmentScreen}
        options={{
          title: 'Uppdrag',
          tabBarVisible: false,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-map" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Login':
      return 'Logga in på OptiresNG';
    case 'Status':
      return 'Status';
    case 'Assignment':
      return 'Uppdrag';
    case 'Navigation':
      return 'Navigation';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0096FF',
  },
});
