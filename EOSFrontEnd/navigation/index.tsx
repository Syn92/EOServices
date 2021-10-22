/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import * as React from 'react';
import { ActivityIndicator, ColorSchemeName, Pressable, View } from 'react-native';

import Firebase from '../config/firebase';
import Colors from '../constants/Colors';
import ServerConstants from '../constants/Server';
import useColorScheme from '../hooks/useColorScheme';
import { User } from '../interfaces/User';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import { PrivateProfile } from '../screens/PrivateProfile';
import TabTwoScreen from '../screens/TabTwoScreen';
import GetFormatedDate from '../services/DateFormater';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import { AuthenticatedUserContext } from './AuthenticatedUserProvider';
import AuthStack from './AuthStack';

const auth = Firebase.auth();

async function checkUser(user: any) {

  try {
    const res = await axios.get<any>(ServerConstants.local + 'auth', { params: { uid: user.uid } });
    // if user exists, return user
    if (res.data){
      delete res.data._id;
      return res.data;
    }

    // add user to mongodb
    const newUsr: User = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      joinedDate: GetFormatedDate(new Date())
    };
    await axios.post(ServerConstants.local + 'auth', newUsr);

    return newUsr;    
  } catch (err) {
    console.log('checkuser')
    console.log(err);
  }
}

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const { user, setUser } =  React.useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = auth.onAuthStateChanged(async (authenticatedUser: any) => {
      try {
        if (authenticatedUser)
          authenticatedUser = await checkUser(authenticatedUser)
        
        // setUser to either null or return value of checkUser
        if (setUser) await setUser(authenticatedUser);
        else throw new Error('setUser undefined');

        setIsLoading(false);
      } catch (error) {
        console.log('onAuthChanged')
        console.log(error);
      }
    });

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    )
  }

  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {user ? <RootNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={PrivateProfile}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
