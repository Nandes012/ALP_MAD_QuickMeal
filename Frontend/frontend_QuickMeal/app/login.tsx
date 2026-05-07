import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import HeaderAuth from "@/components/ui/headerAuth";
import LoginForm from "@/components/auth/LoginForm";
import { shared } from "@/components/ui/styles";

export default function Login() {
  return (
    <SafeAreaView style={styles.page}>
      <HeaderAuth>
        <LoginForm />
      </HeaderAuth>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFF8EF",
  },

  // shared styles
  scrollContainer: shared.scrollContainer,
});