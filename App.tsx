import React from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/Home/HomeScreen';
import { MovieDetailScreen } from './src/screens/MovieDetail/MovieDetailScreen';
import { Sidebar } from './src/components/Sidebar/Sidebar';
import { TVNavigationProvider, useTVNavigation, navigationRef } from './src/context/NavigationContext';

const Stack = createNativeStackNavigator();

const TVLayout = () => {
  const { activeSidebarNodeRef } = useTVNavigation();
  
  return (
    <View style={styles.layout}>
      <Sidebar activeNodeRef={activeSidebarNodeRef!} />
      <View style={styles.mainContent}>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Movies" component={HomeScreen} />
          <Stack.Screen name="Series" component={HomeScreen} />
          <Stack.Screen name="Anime" component={HomeScreen} />
          <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
        </Stack.Navigator>
      </View>
    </View>
  );
};

const NavigationWrapper = () => {
  const { setCurrentRoute } = useTVNavigation();
  
  return (
    <NavigationContainer 
      ref={navigationRef}
      onStateChange={(state) => {
        if (state) {
          const currentRouteName = state.routes[state.index].name;
          setCurrentRoute(currentRouteName);
        }
      }}
    >
      <TVLayout />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#141414" />
        <TVNavigationProvider>
          <NavigationWrapper />
        </TVNavigationProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
  },
});

export default App;
