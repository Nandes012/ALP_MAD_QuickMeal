import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#D2B48C',
        tabBarStyle: {
          backgroundColor: '#9E5F3B', 
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}>
      
      {/* 1. Halaman Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />

      {/* 2. Tombol Tengah (Get Food Rec) */}
      <Tabs.Screen
        name="food_rec"
        options={{
          title: 'Get Food Rec',
          tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: '#8D5B3E', 
              width: 60,
              height: 60,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              bottom: 20, 
              borderWidth: 4,
              borderColor: '#FCF8F5', 
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
            }}>
              <Ionicons name="search" size={28} color="white" />
            </View>
          ),
        }}
      />

      {/* 3. Halaman List */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'List',
          tabBarIcon: ({ color }) => <Ionicons name="clipboard-outline" size={24} color={color} />,
        }}
      />

      {/* --- TAMBAHAN BARU: AGAR HALAMAN RESEP QUIZ BISA DIAKSES --- */}
      <Tabs.Screen
        name="resep_quiz"
        options={{
          href: null, // Menghilangkan tab ini dari menu bawah agar tetap rapi
          headerShown: false,
        }}
      />

      <Tabs.Screen
  name="from_resep"
  options={{
    href: null, // Sembunyikan dari bar bawah
    headerShown: false,
  }}
/>

<Tabs.Screen
  name="hasil_rec_resep"
  options={{
    href: null, // Sembunyikan dari bar bawah
    headerShown: false,
  }}
/>
      
    </Tabs>
  );
}