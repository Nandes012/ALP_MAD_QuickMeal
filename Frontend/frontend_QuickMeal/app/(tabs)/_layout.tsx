import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Warna icon saat aktif (putih) dan tidak aktif (cokelat muda)
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#D2B48C',
        // Style untuk bar tab bawah
        tabBarStyle: {
          backgroundColor: '#9E5F3B', // Warna cokelat utama
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
      
      {/* 1. Halaman Home (index.tsx) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />

      {/* 2. Tombol Tengah (food_rec.tsx) - Dibuat menonjol */}
      <Tabs.Screen
        name="food_rec"
        options={{
          title: 'Get Food Rec',
          tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: '#8D5B3E', // Cokelat lebih gelap
              width: 60,
              height: 60,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              bottom: 20, // Membuat efek melayang ke atas
              borderWidth: 4,
              borderColor: '#FCF8F5', // Warna krem/putih tulang agar kontras
              elevation: 5, // Shadow untuk Android
              shadowColor: '#000', // Shadow untuk iOS
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
            }}>
              <Ionicons name="search" size={28} color="white" />
            </View>
          ),
        }}
      />

      {/* 3. Halaman List (explore.tsx) */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'List',
          tabBarIcon: ({ color }) => <Ionicons name="clipboard-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}