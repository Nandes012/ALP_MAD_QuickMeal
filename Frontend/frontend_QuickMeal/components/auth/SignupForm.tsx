import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomInput from "@/components/ui/customInput";
import CustomButton from "@/components/ui/customButton";
import { shared } from "@/components/ui/styles";

// Consolidated small components inside this file for simpler structure
function FormField({ label, ...inputProps }: any) {
  return (
    <View style={localStyles.fieldWrap}>
      <Text style={localStyles.label}>{label}</Text>
      <CustomInput {...inputProps} />
    </View>
  );
}

import { useRouter } from "expo-router";
import { colors } from "@/components/ui/styles";

function SignupFooter() {
  const router = useRouter();
  return (
    <View style={localStyles.rowCenter}>
      <Text>Already have an account? </Text>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={localStyles.link}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SignupForm({ onSignup }: { onSignup?: (data: any) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function submit() {
    if (!name || !email || !password || !confirmPassword) {
      console.warn("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      console.warn("Passwords do not match");
      return;
    }

    const payload = { name, email, password };
    if (onSignup) onSignup(payload);
    else console.log("Signup payload", payload);
  }

  return (
    <View style={[shared.form, { paddingHorizontal: 0 }]}>

      <FormField label="Name" placeholder="St mutmainnah" value={name} onChangeText={setName} />

      <FormField label="Email" placeholder="smutmainnah@..." value={email} onChangeText={setEmail} keyboardType="email-address" />

      <FormField label="Password" placeholder="Gowa020627" value={password} onChangeText={setPassword} secureTextEntry />

      <FormField label="Confirm Password" placeholder="Gowa020627" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <View style={shared.buttonWrap}>
        <CustomButton title="Sign Up" onPress={submit} fullWidth />
      </View>

      <SignupFooter />
    </View>
  );
}

// form styles moved to shared styles

const localStyles = StyleSheet.create({
  // keep spacing consistent with LoginForm: CustomInput already adds bottom margin,
  // so avoid duplicating it here.
  fieldWrap: { marginBottom: 0 },
  label: {
    marginBottom: 8,
    color: colors.primary,
    fontWeight: "600",
  },
  rowCenter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: colors.primary,
    fontWeight: "600",
  },
});


