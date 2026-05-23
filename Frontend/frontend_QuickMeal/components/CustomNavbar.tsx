import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function CustomNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (!pathname) return false;
    return pathname === route || pathname.startsWith(route + '/') || pathname.startsWith(route + '?') || pathname.startsWith(route);
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
        <Ionicons name={isActive('/home') ? 'home' : 'home-outline'} size={24} color={isActive('/home') ? '#FFF' : '#D2B48C'} />
        <Text style={[styles.navText, isActive('/home') ? styles.activeText : {color: '#D2B48C'}]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItemCenter} onPress={() => router.push('/from_resep')}>
        <View style={[styles.centerIconBg, isActive('/from_resep') && styles.centerActiveBg]}>
          <Ionicons name="search" size={28} color="white" />
        </View>
        <Text style={[styles.navTextCenter, isActive('/from_resep') && styles.activeText]}>Resep</Text>
      </TouchableOpacity>

      {/* HANYA MENGUBAH /explore MENJADI /list DI BAWAH INI */}
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/list')}>
        <Ionicons name={isActive('/list') ? 'file-tray-full' : 'file-tray-full-outline'} size={24} color={isActive('/list') ? '#FFF' : '#D2B48C'} />
        <Text style={[styles.navText, isActive('/list') ? styles.activeText : {color: '#D2B48C'}]}>List</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#9E5F3B',
    height: 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 15 : 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navItemCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: -30, 
  },
  centerIconBg: {
    backgroundColor: '#8D5B3E',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF8EF',
    elevation: 5,
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
  },
  navTextCenter: {
    fontSize: 10,
    color: '#D2B48C',
    marginTop: 4,
    fontWeight: 'bold',
  }
  ,
  activeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  centerActiveBg: {
    backgroundColor: '#C08A5A',
  }
});