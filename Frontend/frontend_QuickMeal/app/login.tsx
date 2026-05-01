import React from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomButton from "@/components/ui/customButton";
import CustomInput from "@/components/ui/customInput";
import HeaderAuth from "@/components/ui/headerAuth";
import LoginForm from "@/components/auth/LoginForm";

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

  form: {
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
    marginTop: 20,
  },

  label: {
    marginBottom: 8,
    color: "#5B3528",
    fontWeight: "600",
  },

  row: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  link: {
    color: "#5B3528",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 80,
  },
});