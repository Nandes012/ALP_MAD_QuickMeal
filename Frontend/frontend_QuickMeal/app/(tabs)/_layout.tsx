import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#D2B48C',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
        headerShown: false, // Mematikan header agar tombol back di atas hilang
      }}>
      <Tabs.Screen name="index" options={{ 
        title: 'Home', 
        tabBarIcon: ({color}) => <Ionicons name="home-outline" size={24} color={color}/> 
      }} />
      
      <Tabs.Screen name="food_rec" options={{
          title: 'Get Food Rec',
          tabBarIcon: () => (
            <View style={styles.centerButton}>
              <Ionicons name="search" size={30} color="white" />
            </View>
          ),
        }} 
      />

      <Tabs.Screen name="explore" options={{ 
        title: 'List', 
        tabBarIcon: ({color}) => <Ionicons name="file-tray-full-outline" size={24} color={color}/> 
      }} />

      {/* Halaman tersembunyi namun tetap dalam sistem Tabs agar Navbar tidak hilang */}
      <Tabs.Screen name="from_resep" options={{ href: null }} />
      <Tabs.Screen name="from_order" options={{ href: null }} />
      <Tabs.Screen name="hasil_rec_resep" options={{ href: null }} />
      <Tabs.Screen name="hasil_rec_order" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#9E5F3B',
    height: Platform.OS === 'ios' ? 90 : 70,
    borderTopWidth: 0,
    position: 'absolute',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  centerButton: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#8D5B3E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30, 
    borderWidth: 5,
    borderColor: '#FFF8EF', 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }
});