import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import CustomInput from "@/components/ui/customInput";
import CustomButton from "@/components/ui/customButton";
import { shared, colors } from "@/components/ui/styles";

// Consolidated small components inside this file for simpler structure
function FormField({ label, ...inputProps }: any) {
  return (
    <View style={localStyles.fieldWrap}>
      <Text style={localStyles.label}>{label}</Text>
      <CustomInput {...inputProps} />
    </View>
  );
}

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
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function submit() {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
      //jika ini tidak berkerja maka ganti ip address dengan ipnya kalian
        "http://192.168.0.194:8000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      console.log("SIGNUP RESPONSE:", data);

      // SIGNUP FAILED
      if (!response.ok) {
        alert(data.message || "Sign up failed");
        setIsLoading(false);
        return;
      }

      // OPTIONAL CALLBACK
      if (onSignup) {
        onSignup({ name, email, password });
      }

      // SUCCESS
      console.log("TOKEN:", data.token);
      console.log("USER:", data.user);

      setIsLoading(false);

      // Navigate to home
      router.replace("/(tabs)");

    } catch (error) {
      console.log("SIGNUP ERROR:", error);
      alert("Could not connect to backend");
      setIsLoading(false);
    }
  }

  return (
    <View style={[shared.form, { paddingHorizontal: 0 }]}>

      <FormField label="Name" placeholder="St mutmainnah" value={name} onChangeText={setName} />

      <FormField label="Email" placeholder="smutmainnah@..." value={email} onChangeText={setEmail} keyboardType="email-address" />

      <FormField label="Password" placeholder="Gowa020627" value={password} onChangeText={setPassword} secureTextEntry />

      <FormField label="Confirm Password" placeholder="Gowa020627" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <View style={shared.buttonWrap}>
        <CustomButton title={isLoading ? "Signing Up..." : "Sign Up"} onPress={submit} fullWidth disabled={isLoading} />
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


