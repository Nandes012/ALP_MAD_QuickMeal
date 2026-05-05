import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform, Text } from "react-native";
import { useRouter, usePathname } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from "../ui/styles";

const ICON_MAP: Record<string, string> = {
  Home: 'home',
  'Get Food Rec': 'search',
  List: 'shopping-bag',
};

function resolveRoute(label: string) {
  const l = label.toLowerCase();
  if (l.includes("home")) return '/(tabs)';
  if (l.includes("explore") || l.includes("rec")) return '/(tabs)/explore';
  if (l.includes("profile")) return '/profile';
  return '/(tabs)';
}

export default function BottomNav({ items = ["Home", "Get Food Rec", "List"] }: { items?: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const n = items.length;
  const centerIndex = Math.floor(n / 2);
  const left = items.slice(0, centerIndex);
  const center = items[centerIndex];
  const right = items.slice(centerIndex + 1);

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.container}>
        <View style={styles.sideRow}>
          {left.map((label) => {
            const route = resolveRoute(label);
            const isActive = pathname?.startsWith(route.replace(/index$/, ''));
            return (
              <TouchableOpacity key={label} style={styles.item} activeOpacity={0.9} onPress={() => router.push(route as any)}>
                  <MaterialIcons name={ICON_MAP[label] as any || 'circle'} size={28} color={isActive ? '#fff' : 'rgba(255,255,255,0.9)'} />
                  <Text style={styles.label}>{label}</Text>
                </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sideRow}>
          {right.map((label) => {
            const route = resolveRoute(label);
            const isActive = pathname?.startsWith(route.replace(/index$/, ''));
            return (
              <TouchableOpacity key={label} style={styles.item} activeOpacity={0.9} onPress={() => router.push(route as any)}>
                <MaterialIcons name={ICON_MAP[label] as any || 'circle'} size={28} color={isActive ? '#fff' : 'rgba(255,255,255,0.9)'} />
                <Text style={styles.label}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* center floating button */}
      {center && (
        <View style={styles.centerWrap} pointerEvents="box-none">
          <TouchableOpacity style={styles.centerBtn} activeOpacity={0.9} onPress={() => router.push(resolveRoute(center) as any)}>
              <MaterialIcons name={ICON_MAP[center] as any || 'search'} size={30} color="#fff" />
            </TouchableOpacity>
          <View style={styles.centerLabelWrap} pointerEvents="none">
            <Text style={styles.centerLabel}>{center}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', pointerEvents: 'box-none' },
  container: { width: '100%', height: 64, backgroundColor: colors.button, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 28, alignItems: 'center' },
  sideRow: { flexDirection: 'row', alignItems: 'center' },
  item: { alignItems: 'center', width: 72 },
  label: { color: '#fff', fontSize: 12, marginTop: 4, textAlign: 'center' },

  centerWrap: { position: 'absolute', top: -28, alignItems: 'center' },
  centerBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.button, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6 },
  centerLabelWrap: { marginTop: 8 },
  centerLabel: { color: '#fff', fontSize: 13 },
});

