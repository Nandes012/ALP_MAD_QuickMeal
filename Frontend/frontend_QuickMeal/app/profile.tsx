import React from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/components/ui/styles";
import BottomNav from "../components/home/BottomNav";

export const options = {
  headerShown: false,
};

export default function Profile() {
  const router = useRouter();

  function Row({ title }: { title: string }) {
    return (
      <TouchableOpacity style={local.row} activeOpacity={0.8}>
        <Text style={local.rowText}>{title}</Text>
        <Text style={local.rowIcon}>›</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.username}>St mutmainnah</Text>
          <TouchableOpacity onPress={() => {}}>
            <Image source={require('@/assets/images/profil.jpg')} style={styles.smallAvatar} />
          </TouchableOpacity>
        </View>

        <View style={styles.vipCard}>
          <Text style={styles.vipTitle}>QuickMeal  VIP</Text>
          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={styles.upgradeText}>Upgrade</Text>
          </TouchableOpacity>
          <Text style={styles.vipDesc}>Fitur & elemen premium, dan bebas iklan</Text>
        </View>

        <View style={styles.box}>
          <Row title="Profile Details" />
          <Row title="Order History" />
          <Row title="Saved Wishlist" />
          <Row title="Payment Methods" />
          <Row title="Help & Support" />
        </View>

        <TouchableOpacity style={styles.logout} activeOpacity={0.9} onPress={() => { /* TODO: logout */ }}>
          <Text style={styles.logoutText}>Logout Akun</Text>
        </TouchableOpacity>

      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream },
  container: { padding: 16, paddingBottom: 200 },
  topBar: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  back: { fontSize: 22, color: '#000' },
  username: { fontSize: 16, fontWeight: '700', color: colors.primary },
  smallAvatar: { width: 40, height: 40, borderRadius: 20 },

  vipCard: { backgroundColor: colors.button, borderRadius: 12, padding: 14, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 },
  vipTitle: { fontWeight: '700', fontSize: 18, color: '#fff' },
  upgradeBtn: { position: 'absolute', right: 12, top: 12, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  upgradeText: { color: colors.button, fontWeight: '600' },
  vipDesc: { marginTop: 10, color: '#fff' },

  box: { marginTop: 8, backgroundColor: colors.button, borderRadius: 12, paddingVertical: 8, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6 },

  logout: { marginTop: 20, marginHorizontal: 8, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  logoutText: { color: '#d9534f', fontWeight: '700' },
});

const local = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  rowText: { fontSize: 16, color: '#fff' },
  rowIcon: { fontSize: 20, color: 'rgba(255,255,255,0.9)' },
});
