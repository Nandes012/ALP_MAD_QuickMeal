import React from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomButton from "@/components/ui/customButton";
import CustomInput from "@/components/ui/customInput";
import HeaderAuth from "@/components/ui/headerAuth";
import LoginForm from "@/components/auth/LoginForm";
import { shared } from "@/components/ui/styles";

export default function Login() {
  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <HeaderAuth>
          <LoginForm />
        </HeaderAuth>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // page-specific overrides (use shared for form/label/link/row)
  scrollContainer: shared.scrollContainer,
});