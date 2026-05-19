import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarStyle: { display: 'none' } // Sembunyikan navbar asli Expo
    }} initialRouteName="home">
      <Tabs.Screen name="home" />
      <Tabs.Screen name="food_rec" />
      <Tabs.Screen name="list" />
    </Tabs>
  );
}