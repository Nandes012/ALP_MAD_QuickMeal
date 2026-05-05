import React from "react";
import { Image, StyleSheet } from "react-native";

export default function Banner({ source, height = 96 }: any) {
  return <Image source={source} style={[styles.banner, { height }]} resizeMode="cover" />;
}

const styles = StyleSheet.create({
  banner: { width: "100%", marginBottom: 12 },
});
